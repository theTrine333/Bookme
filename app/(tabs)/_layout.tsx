import { Redirect, Tabs, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Styles, { height, width } from "@/constants/Styles";
import {
  AntDesign,
  Feather,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { ActivityIndicator, Alert, View } from "react-native";
import { AuthContext } from "@/contexts/authContext";
import { ThemedView } from "@/components/ThemedView";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import Splash from "@/components/Splash";
import * as Linking from "expo-linking";
import { decordName, sanitizeFileName } from "@/api/q";
export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const authState = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;
      const parsed = Linking.parse(url);
      // console.log("Parsed data:", parsed);
      const name = decordName(url);
      const res = await Linking.canOpenURL(url);
      router.replace({
        pathname: "/handler",
        params: {
          url: url,
          name: name.toString(),
        },
      });
    };

    // Listen for incoming links
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Handle initial URL if app was opened via link
    (async () => {
      const initialUrl = await Linking.getInitialURL();

      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    })();

    return () => {
      subscription.remove(); // Clean up the event listener
    };
  }, []);

  if (authState.isLoggedIn == undefined) {
    return <Splash />;
  }
  if (authState.isLoggedIn == false) {
    return <Redirect href={"/auth"} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.text,
        headerShown: false,
        animation: "shift",
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          width: width * 0.9,
          height: height * 0.08,
          marginHorizontal: 15,
          alignSelf: "center",
          bottom: 10,
          left: 20,
          right: 20,
          borderRadius: 40,
          alignItems: "center",
          paddingHorizontal: 10,
          justifyContent: "space-between",
        },
        tabBarItemStyle: {
          borderRadius: 10,
          margin: 20,
          height: "90%",
          alignSelf: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 45,
                alignSelf: "center",
                marginTop: 15,
                height: 45,
                borderRadius: 30,
                backgroundColor: focused
                  ? Colors.dark.icon
                  : Colors[colorScheme].background,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: focused ? 5 : 0,
              }}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={20}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourite",
          tabBarLabel: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 45,
                alignSelf: "center",
                marginTop: 15,
                height: 45,
                borderRadius: 30,
                backgroundColor: focused
                  ? Colors.dark.icon
                  : Colors[colorScheme].background,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: focused ? 5 : 0,
              }}
            >
              <Ionicons
                size={25}
                name={focused ? "heart-sharp" : "heart-outline"}
                color={color}
              />
            </View>
            //
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Bookmark",
          tabBarLabel: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 45,
                alignSelf: "center",
                marginTop: 15,
                height: 45,
                borderRadius: 30,
                backgroundColor: focused
                  ? Colors.dark.icon
                  : Colors[colorScheme].background,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: focused ? 5 : 0,
              }}
            >
              <MaterialCommunityIcons
                size={25}
                name={
                  focused
                    ? "bookmark-box-multiple"
                    : "bookmark-box-multiple-outline"
                }
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="downloads"
        options={{
          title: "Downloads",
          tabBarLabel: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 45,
                alignSelf: "center",
                marginTop: 15,
                height: 45,
                borderRadius: 30,
                backgroundColor: focused
                  ? Colors.dark.icon
                  : Colors[colorScheme].background,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: focused ? 5 : 0,
              }}
            >
              <Feather name="download" size={25} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
