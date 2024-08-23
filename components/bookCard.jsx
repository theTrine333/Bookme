import { StyleSheet,Text, View,Image, Pressable, Button, TouchableOpacity } from 'react-native'
import {React,useState} from 'react'
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'
import details from './details'
import { useSQLiteContext } from "expo-sqlite/next";
const Card = ({
    bookUrl,
    Title,
    Description,
    bookPoster,
    authors,
    lang,
    size,
    Ext,
    download_server,
}) => {

const [imageUrl,setImageUrl] = useState("")
const [loading,isLoading] = useState(false)
const navigation = useNavigation();
const db = useSQLiteContext();

async function insertTransaction() {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `
        INSERT INTO Recent (Title,Authors,Description,Poster,Language,Size,Url,Link,Extension) VALUES (?,?,?,?,?,?,?,?,?);
      `,
        [
          Title,
          authors,
          Description,
          bookPoster,
          lang,
          size,
          bookUrl,
          download_server,
          Ext
        ]
      );
    });
  }

return (
    <TouchableOpacity onPress={() => {
        insertTransaction()
        navigation.navigate("Details",{
            Poster:(bookPoster || "https://libgen.li/img/blank.png"),
            title:Title,
            authors:authors,
            lang:lang,
            size:size,
            Ext:Ext,
            description:Description,
            bookurl:bookUrl,
            Server:download_server
        })
    }}>
        <View style={styles.card}>
            <Image 
                source={{uri : (bookPoster || "https://libgen.li/img/blank.png")}} 
                style={{
                    height:100,width:100,borderRadius:8,resizeMode:'contain'
                }}
            />
            <View style={styles.detailsContainer}>
                <Text style={styles.heading} numberOfLines={2}>{Title}</Text>
                <Text style={styles.subHeading} numberOfLines={3}>Author(s) : {authors}</Text>
                <Text style={styles.subHeading}>Lang : {lang} | Size : {size} | {Ext} | </Text>
            </View>
        </View>
        <Divider style={{marginTop:5,}}/>
    </TouchableOpacity>
  )
}

export default Card;

const styles = StyleSheet.create({
    card:{
        flex: 1,
        flexDirection:'row',
    },heading:{
        fontWeight:'bold',
    },subHeading:{
        fontSize:12,
    },
    detailsContainer:{
        gap:5,
        alignContent:"flex-start",
        justifyContent:"flex-start",
        width:"70%"
    }
})