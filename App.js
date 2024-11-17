import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Details from "./components/details";
import { StatusBar } from "expo-status-bar";
import {
  AppOpenAd,
  TestIds,
  AdEventType,
} from "react-native-google-mobile-ads";
import { Suspense, useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import Home from "./screens/Home";
import Reader from "./components/reader";
import { SQLiteProvider } from "expo-sqlite";
import * as SplashScreen from "expo-splash-screen";
import Downloads from "./screens/Downloads";
import { height } from "./components/bookCard";
SplashScreen.preventAutoHideAsync();
const loadDatabase = async () => {
  const dbName = "bookme.db";
  const dbAsset = require("./assets/bookme.db");
  const dbUri = Asset.fromModule(dbAsset).uri;

  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      {
        intermediates: true,
      }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

const loadInterstitial = async () => {
  interstitialLoader = await Notix.Interstitial.createLoader(7563075);
  interstitialLoader.startLoading();

  try {
    var interstitialData = await interstitialLoader.next(5000);
  } catch (Exception) {
    return;
  }

  // Notix.Interstitial.show(interstitialData);
};

export default function App() {
  const Stack = createNativeStackNavigator();
  const [dbLoaded, setDbLoaded] = useState(false);
  const adUnitId = TestIds.APP_OPEN;
  useEffect(() => {
    loadDatabase()
      .then(async () => {
        setDbLoaded(true);
        await SplashScreen.hideAsync();
      })
      .catch((e) => console.error("Database load error: ", e));
  }, []);

  // useEffect(() => {
  //   db.execAsync(
  //     `CREATE TABLE IF NOT EXISTS "Downloads" ("ID" INTEGER PRIMARY KEY AUTOINCREMENT,"Title"	TEXT UNIQUE,"Authors"	TEXT,	"Description"	TEXT,"Poster"	TEXT,	"Language"	TEXT,	"Size"	TEXT,	"Url"	TEXT,	"Link"	TEXT,	"Extension"	TEXT)`,
  //     []
  //   );
  //   db.execAsync(
  //     `CREATE TABLE IF NOT EXISTS "Recent" ("ID" INTEGER PRIMARY KEY AUTOINCREMENT,"Title"	TEXT UNIQUE,	"Authors"	TEXT,	"Description"	TEXT,	"Poster"	TEXT,	"Language"	TEXT,	"Size"	TEXT,	"Url"	TEXT,	"Link"	TEXT,	"Extension"	TEXT)`,
  //     []
  //   );
  // }, []);
  // npm i react-lazy-load-image-component
  if (!dbLoaded)
    return (
      <>
        <View style={styles.headerView}>
          <Image
            source={require("./assets/icons/0.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <StatusBar style="auto" />
        </View>
        <ActivityIndicator
          size={25}
          color={"rgb(255,140,0)"}
          style={{ marginTop: 10 }}
        />
      </>
    );
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Suspense
        fallback={
          <>
            <View style={styles.headerView}>
              <Image
                source={require("./assets/icons/0.png")}
                style={styles.image}
                resizeMode="contain"
              />
              <StatusBar style="auto" />
            </View>
            <ActivityIndicator
              size={25}
              color={"rgb(255,140,0)"}
              style={{ marginTop: 10 }}
            />
          </>
        }
      >
        <SQLiteProvider databaseName="bookme.db" useSuspense>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            {/* <Stack.Screen name="Startup" component={Startup} /> */}
            {/* <Stack.Screen name="ScreenTabs" component={Navigation} /> */}
            <Stack.Screen name="Details" component={Details} />
            <Stack.Screen name="Reader" component={Reader} />
            <Stack.Screen name="Downloads" component={Downloads} />
          </Stack.Navigator>
        </SQLiteProvider>
      </Suspense>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignContent: "center",
  },
  headerView: {
    backgroundColor: "grey",
    alignItems: "center",
    paddingTop: height * 0.25,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 20,
  },
  image: {
    height: 220,
    width: 220,
  },
});
