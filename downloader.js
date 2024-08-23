import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';


const actualDownload = () => {
    const { dirs } = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const configfb = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: `Invoice.pdf`,
        path: `${dirs.DownloadDir}/Invoice.pdf`,
      },
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: 'Invoice.pdf',
      path: `${dirToSave}/Invoice.pdf`,
    };
    const configOptions = Platform.select({
      ios: configfb,
      android: configfb,
    });
 
    RNFetchBlob.config(configOptions || {})
      .fetch('GET', invoiceUrl, {})
      .then(res => {
 
        if (Platform.OS === 'ios') {
          RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
          RNFetchBlob.ios.previewDocument(configfb.path);
        }
        if (Platform.OS === 'android') {
          console.log("file downloaded")      
 }
      })
      .catch(e => {
        console.log('invoice Download==>', e);
            });
  };

  const getPermission = async () => {
    if (Platform.OS === 'ios') {
      actualDownload();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          actualDownload();
        } else {
          console.log("please grant permission");
        }
      } catch (err) {
        console.log("display error",err)    }
    }
  };