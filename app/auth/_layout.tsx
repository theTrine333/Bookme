import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AuthenTicationLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
    </Stack>
  );
};

export default AuthenTicationLayout;
