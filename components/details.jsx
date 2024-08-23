import { ScrollView, StyleSheet,  Image, Text, Dimensions, View,Pressable, Button, TouchableOpacity, ActivityIndicator} from 'react-native'
import * as Linking from 'expo-linking';
import {React,useState,useEffect,useRef } from 'react'
import * as Fetch from '../api/api'
import { Title, Divider} from 'react-native-paper';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import { useSQLiteContext } from "expo-sqlite/next";

const adUnitId ='ca-app-pub-5482160285556109/3851781686';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    keywords: ['fashion', 'clothing'],
});

const Details = ({navigation, route}) => {

    const url = route.params.bookurl
    const download_server = route.params.Server
    const [adLoaded, setadLoaded] = useState(false)
    const [downloading,setdownLoading] = useState(false)
    const [started,setStarted] = useState(false)
    const [loading,setLoading] = useState("true")
    const [Description,setDescription] = useState("true")
    const [error,setError] = useState("false")
    const bannerRef = useRef(null);
    const { width, height } = Dimensions.get("window");
    
    const db = useSQLiteContext();

    async function insertTransaction() {
        db.withTransactionAsync(async () => {
          await db.runAsync(
            `
            INSERT INTO Downloads (Title,Authors,Description,Poster,Language,Size,Url,Link,Extension) VALUES (?,?,?,?,?,?,?,?,?);
          `,
            [
              route.params.title,
              route.params.authors,
              route.params.description,
              route.params.Poster,
              route.params.lang,
              route.params.size,
              route.params.bookurl,
              route.params.Server,
              route.params.Ext
            ]
          );
        });
      }

    useEffect(() =>{
        const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            setadLoaded(true);
          });
      
        // Start loading the interstitial straight away
        interstitial.load();

        Fetch.getBookDetails(url).then(details => {
            setLoading("false")
            setDescription(details.replace(/\. ([a-zA-Z])/g, ".\n$1"))
        }).catch(error => {
            setLoading("false")
            setError("true")
        })

    },[])

  return (
    <View style={styles.container}>
        {
          loading == "true" ? (
            <View style={styles.headerCardContainer}>
              <ActivityIndicator size="large" color={"rgba(255,140,0,255)"} />
            </View>
          )
          :error == "true"? (
            <View>
                <Text style={{textAlign:"center",color:'#E3002A'}}>Something went wrong</Text>
                <Text style={{textAlign:"center"}}>Can't fetch data at the moment</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() =>{
                    setLoading("true")
                    Fetch.getBookDetails(url).then(details => {
                        setLoading("false")
                        setDescription(details.replace(/\. ([a-zA-Z])/g, ".\n$1"))
                    }).catch(error => {
                        setLoading("false")
                        setError("true")
                    })                
                }}>
                    <Text style={{textAlign:'center'}}>Retry</Text>
                </TouchableOpacity>
            </View>
          )
          : (
                <ScrollView>
                    <Image
                        source={{uri: route.params.Poster.replace("_small", "")}}
                        style={{width:width*0.95,height:height*0.6,borderRadius:5,alignSelf: 'center'}}
                        resizeMode="cover"
                    />
                    <Divider style={{marginTop:20,width:width*0.92,marginLeft:10}}/>
                    <Title style={styles.titleHead}>Title</Title>
                    <Divider style={{width:width*0.92,marginLeft:10}}/>
                    <Title style={styles.title}>{route.params.title}</Title>
                    <Divider style={{marginTop:5,width:width*0.92,marginLeft:10}}/>
                    <Title style={styles.titleHead}>Description</Title>
                    <Divider style={{marginTop:5,width:width*0.92,marginLeft:10}}/>
                    <Title style={styles.title}>{Description}</Title>
                    <Divider style={{marginTop:5,width:width*0.92,marginLeft:10}}/>
                    <View style={{width:width*0.95,paddingTop:10,paddingBottom:10}}>
                        {
                            downloading ? (
                                <View style={styles.headerCardContainer}>
                                    <ActivityIndicator size="large" color={"rgba(255,140,0,255)"} />
                                </View>
                            ) : started ? (
                                <>
                                    <Text style={styles.infoText}>Download is ongoing on browser</Text>
                                    <BannerAd
                                        size={BannerAdSize.BANNER}
                                        unitId="ca-app-pub-5482160285556109/4302126257"  
                                        onAdLoaded={() => {}}
                                        onAdFailedToLoad={() => {}}
                                    />
                                </>
                                
                            ):(
                                <>
                                <BannerAd
                                    size={BannerAdSize.BANNER}
                                    unitId="ca-app-pub-5482160285556109/4302126257"
                                />
                                <View style={styles.btns}>
                                    <TouchableOpacity style={styles.serverButton} onPress={() =>  {
                                        insertTransaction()
                                        adLoaded ? (() =>{
                                            interstitial.show()
                                            console.log("loaded");
                                        }
                                            
                                        ) :(<></>)
                                        setdownLoading(true)
                                        Fetch.extractLink(download_server).then(link =>{
                                            setStarted(true)
                                            Linking.openURL(`${link}`);
                                            setdownLoading(false)
                                        })
                                    }}>
                                        <Text style={{textAlign:'center'}}>Download</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.readButton} onPress={() =>  {
                                        adLoaded ? (() =>{
                                            interstitial.show()
                                            console.log("loaded");
                                        }
                                            
                                        ) :(<></>)
                                        Fetch.extractLink(download_server).then(link =>{
                                            navigation.navigate("Reader",{
                                                bookUrl:link
                                            })
                                        })
                                    }}>
                                        <Text style={{textAlign:'center'}}>Read online</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex:1,alignSelf:'flex-start'}}>
                                    <BannerAd ref={bannerRef} unitId={"ca-app-pub-5482160285556109/8138173373"} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
                                </View>
                                </>
                            ) 
                        }
                    </View>
                </ScrollView>
          )
        }
    </View>
  )
}

export default Details;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        alignContent: 'flex-start',
        paddingLeft:5,
        paddingTop:45
    },infoText:{
        fontWeight:'bold',
        color:'blue',
        paddingBottom:20,
        textAlign:'center'
    },Imagebox:{
        alignContent: 'center',
        justifyContent: 'center',
        width: "100%",
        borderRadius:20,
        resizeMode:"contain",
    },title:{
        flex: 1,
        flexDirection: 'row',
        width:'95%',
        fontSize:12,
        paddingLeft:20,
        paddingTop:10
    },titleHead:{
        flex: 1,
        flexDirection: 'row',
        width:'95%',
        textAlign:'center',
        fontSize:15,
        fontWeight:'bold',
        paddingLeft:20,
    },description:{
        flex: 1,
        flexDirection: 'column',
        width:'100%',
        
    },buttonsContainer: {
        flex: 1,
        justifyContent:'flex-start',
        flexDirection:'row',
        gap:20,
        paddingTop: 20,
        paddingBottom:40,
        paddingLeft:20,
        marginRight:10 
    },serverButton:{
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:40,
        paddingRight:40,
        backgroundColor:'rgba(255,130,0,205)',
        borderRadius:10,
    },readButton:{
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:40,
        paddingRight:40,
        borderRadius:10,
        borderColor:'rgba(255,130,0,205)',
        borderWidth:1
    },retryButton:{
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:30,
        paddingRight:30,
        backgroundColor:'rgba(255,130,0,205)',
        borderRadius:10,
        width:'95%',
        alignSelf:'center'
    },btns:{
        flex:1,
        flexDirection:'row',
        alignContent:'space-between',
        gap:20,
        paddingLeft:10,
        marginTop:10,
        marginBottom:10,
        justifyContent:'center'
    }
})