import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { StyleSheet, SafeAreaView, Button } from 'react-native';
import Pdf from 'react-native-pdf';


export default function Reader({navigation, route}) {
  const book_url = route.params.bookUrl
  const onlineSource = { uri: `${book_url}`, cache: true };
  const [pdfSource, setPdfSource] = useState(onlineSource);
  const pdfRef = useRef();

  return (
    <SafeAreaView style={styles.container}>
      <Pdf
        trustAllCerts={false}
        ref={pdfRef} 
        source={pdfSource}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width:'100%',
    marginTop: 40
  },
  pdf: {
    flex: 1,
    alignSelf: "stretch",
    width:'100%'
  }
});