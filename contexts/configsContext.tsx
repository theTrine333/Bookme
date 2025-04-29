// ConfigsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme, Appearance, ColorSchemeName } from "react-native";

interface UserDetails {
  name: string;
  email: string;
}

interface ConfigsContextType {
  theme: "system" | "light" | "dark";
  toggleTheme: (theme: "system" | "light" | "dark") => void;
  isSubscribed: boolean;
  setSubscription: (subscribed: boolean) => void;
  isLoggedIn: boolean;
  login: (details: UserDetails) => void;
  logout: () => void;
  userDetails: UserDetails | null;
}

const ConfigsContext = createContext<ConfigsContextType | undefined>(undefined);

export const useConfigs = () => {
  const context = useContext(ConfigsContext);
  if (!context) {
    throw new Error("useConfigs must be used within a ConfigsProvider");
  }
  return context;
};

export const ConfigsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [appTheme, setAppTheme] = useColorScheme() ?? "light";
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  useEffect(() => {
    saveConfigs();
  }, [theme, isSubscribed, isLoggedIn, userDetails]);

  const loadConfigs = async () => {
    try {
      const themeValue = await AsyncStorage.getItem("theme");
      const subValue = await AsyncStorage.getItem("isSubscribed");
      const loginValue = await AsyncStorage.getItem("isLoggedIn");
      const userValue = await AsyncStorage.getItem("userDetails");

      if (themeValue == "light" || themeValue == "dark") {
        setTheme(themeValue as "light" | "dark");
        Appearance.setColorScheme(themeValue);
      } else {
        setTheme("system");
        Appearance.setColorScheme(null);
      }
      if (subValue) setIsSubscribed(subValue === "true");
      if (loginValue) setIsLoggedIn(loginValue === "true");
      if (userValue) setUserDetails(JSON.parse(userValue));
    } catch (error) {
      console.error("Failed to load configs:", error);
    }
  };

  const saveConfigs = async () => {
    try {
      await AsyncStorage.setItem("theme", theme);
      await AsyncStorage.setItem("isSubscribed", JSON.stringify(isSubscribed));
      await AsyncStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
      await AsyncStorage.setItem("userDetails", JSON.stringify(userDetails));
    } catch (error) {
      console.error("Failed to save configs:", error);
    }
  };

  const toggleTheme = (theme: "system" | "light" | "dark") => {
    if (theme == "system") {
      Appearance.setColorScheme(null);
    } else {
      Appearance.setColorScheme(theme);
    }
    setTheme(theme);
  };

  const setSubscription = (subscribed: boolean) => {
    setIsSubscribed(subscribed);
  };

  const login = (details: UserDetails) => {
    setUserDetails(details);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUserDetails(null);
    setIsLoggedIn(false);
    setIsSubscribed(false);
  };

  return (
    <ConfigsContext.Provider
      value={{
        theme,
        toggleTheme,
        isSubscribed,
        setSubscription,
        isLoggedIn,
        login,
        logout,
        userDetails,
      }}
    >
      {children}
    </ConfigsContext.Provider>
  );
};
