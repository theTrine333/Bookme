import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Suspense, useEffect, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/contexts/authContext";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as Constants from "expo-constants";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConfigsProvider } from "@/contexts/configsContext";
import { SQLiteProvider } from "expo-sqlite";
import Splash from "@/components/Splash";
import * as FileSystem from "expo-file-system";
import * as Asset from "expo-asset";
import * as MediaLibrary from "expo-media-library";
import { BookDownloadProvider } from "@/contexts/downloadContext";
SplashScreen.preventAutoHideAsync();

const loadDatabase = async () => {
  const dbName = "base.db";
  const dbAsset = require("../assets/db/base.db");
  const asset = Asset.Asset.fromModule(dbAsset);
  await asset.downloadAsync();

  if (!asset.localUri) {
    throw new Error("Failed to get local URI for database asset");
  }

  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);

  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      {
        intermediates: true,
      }
    );
    await FileSystem.copyAsync({
      from: asset.localUri,
      to: dbFilePath,
    });
  }
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [dbLoaded, setDbLoaded] = useState<boolean>(false);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const ClerkKey =
    Constants.default.expoConfig?.extra?.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error("Database load error: ", e));
  }, []);

  useEffect(() => {
    if (loaded && dbLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, dbLoaded]);

  if (!loaded || !dbLoaded) {
    return <Splash />;
  }
  return (
    <ClerkProvider publishableKey={ClerkKey} tokenCache={tokenCache}>
      <Suspense fallback={<Splash />}>
        <SQLiteProvider
          databaseName="base.db"
          assetSource={{ assetId: require("../assets/db/base.db") }}
          useSuspense
        >
          <AuthProvider>
            <BookDownloadProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <ConfigsProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="auth" />
                    <Stack.Screen name="others" />
                    <Stack.Screen name="settings" />
                    <Stack.Screen name="handler" />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                </ConfigsProvider>
                <StatusBar style="auto" />
              </ThemeProvider>
            </BookDownloadProvider>
          </AuthProvider>
        </SQLiteProvider>
      </Suspense>
    </ClerkProvider>
  );
}
