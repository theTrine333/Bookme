import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const OtherLayouts = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="details" />
      <Stack.Screen name="search" />
    </Stack>
  );
};

export default OtherLayouts;
