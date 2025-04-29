import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import Styles, { height, width } from "@/constants/Styles";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { CustomTextInput, ORDivider } from "@/components/Input";
import { AuthContext } from "@/contexts/authContext";
import ToastManager from "toastify-react-native/components/ToastManager";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const theme = useColorScheme() ?? "light";
  const [isState, setState] = useState<"idle" | "loading">("idle");
  const context = useContext(AuthContext);
  return (
    <ThemedView style={Styles.container}>
      <ToastManager
        duration={3500}
        height={50}
        width={320}
        textStyle={{ fontSize: 10 }}
        theme={theme}
      />
      <Image
        source={require("@/assets/images/0.png")}
        style={{
          height: height * 0.3,
          width: width * 0.8,
          alignSelf: "center",
        }}
        contentFit="contain"
      />
      <ThemedText
        style={{
          fontWeight: "bold",
          fontSize: 24,
          color: Colors.dark.icon,
          textAlign: "center",
          fontFamily: "SpaceMono",
        }}
      >
        Bookme
      </ThemedText>
      <ThemedView
        style={{
          width: width * 0.95,
          alignSelf: "center",
          height: height * 0.3,
          marginTop: 10,
          backgroundColor: Colors[theme].blur,
          borderRadius: 12,
          marginBottom: 10,
          padding: 10,
        }}
      >
        <ThemedText
          style={{
            fontWeight: "500",
            color: Colors[theme].icon,
            paddingTop: 10,
            fontFamily: "SpaceMono",
          }}
        >
          Email
        </ThemedText>
        <CustomTextInput
          placeholderText="Enter email"
          isEmail
          keyboardType="email-address"
          setter={setEmailAddress}
        />
        <ThemedText
          style={{
            fontWeight: "500",
            color: Colors[theme].icon,
            paddingTop: 10,
            fontFamily: "SpaceMono",
          }}
        >
          Password
        </ThemedText>
        <CustomTextInput
          isPassField
          placeholderText="Enter password"
          setter={setPassword}
        />
      </ThemedView>
      <TouchableOpacity
        style={[
          Styles.authButtons,
          {
            backgroundColor: Colors.dark.icon,
            borderRadius: 10,
            marginBottom: 10,
            opacity: context.isState == "loading" ? 0.5 : 1,
          },
        ]}
        onPress={() => {
          context.Login({ emailAddress: emailAddress, password: password });
        }}
        disabled={context.isState == "loading"}
      >
        {context.isState == "loading" ? (
          <ActivityIndicator color={Colors.dark.text} />
        ) : (
          <ThemedText
            style={[
              Styles.googleButtonText,
              {
                color:
                  theme == "dark" ? Colors.dark.text : Colors.light.background,
              },
            ]}
          >
            Login
          </ThemedText>
        )}
      </TouchableOpacity>
      <ORDivider />
      <TouchableOpacity
        style={[Styles.googleButton, isState !== "idle" && { opacity: 0.7 }]}
        onPress={() => {}}
        disabled={!isLoaded || isState !== "idle"}
      >
        <Image
          source={require("@/assets/images/google.png")}
          style={Styles.iconTextButton}
          contentFit="contain"
        />
        <Text style={[Styles.googleButtonText, { color: Colors.dark.icon }]}>
          Login with Google
        </Text>
      </TouchableOpacity>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          alignSelf: "center",
          marginTop: 10,
          flexDirection: "row",
          gap: 3,
        }}
      >
        <ThemedText>Don't have an account?</ThemedText>
        <Link href="/auth/signup">
          <ThemedText style={Styles.googleButtonText}>Sign up</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}
