import { Button,Image, StyleSheet, SafeAreaView,Text, Pressable, View, useColorScheme } from 'react-native'
import React from 'react'
import { router, useRouter } from 'expo-router'
import Home from './Home'
import { StatusBar } from 'expo-status-bar';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';


const Startup = ({navigation}) => {
  return (
    <View style={style.container}>
        <Image
          source={require('../assets/icons/0.png')}
        />
        <Text style={style.headingText}>BOOKME</Text>
        <Text style={style.preText}>Looking for that book on the web is not easy, 
          Here you just tell us the book title or the topic and we organise your results.</Text>
        <Pressable style={style.button} onPress={() => {
          navigation.navigate("ScreenTabs")
        }}>
          <Text style={{color:'white',fontWeight:'700'}}>Get Started</Text>
        </Pressable>
      <Text style={{paddingTop:10}}>POWEREDBY : </Text>
      <Text style={{color:'rgba(0,0,255,255)',fontWeight:'bold'}}>TRINETECHNOLOGIES</Text>
      {/* <BannerAd
        size={BannerAdSize.BANNER}
        unitId="ca-app-pub-5482160285556109/8138173373"  
        requestOptions={{
          requestNonPersonalizedAdsOnly: true
        }}
      /> */}
    </View>
  )
}

export default Startup;

const style = StyleSheet.create({
    container:{
      flex:1,
      alignItems:"center",
      justifyContent:"flex-end",
    },headingText:{
      fontWeight:"bold",
      fontSize:26,
      padding:20
    },preText:{
        fontSize:12,
        textAlign:"center",
        paddingBottom:10
    },infoText:{
        fontWeight:'bold',
        color:'#E3002A',
        paddingBottom:20
    },button:{
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:60,
        paddingRight:60,
        backgroundColor:'rgba(255,130,0,205)',
        borderRadius:10,
    }
})