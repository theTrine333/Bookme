import {
  Pressable,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import Styles, { height, width } from "@/constants/Styles";
import Headers from "@/components/Headers";
import TypingEffect from "@/hooks/typing-effect";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { AntDesign, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HomeScreen() {
  const theme = useColorScheme() ?? "light";
  return (
    <ThemedView style={Styles.container}>
      <Headers />
      <ThemedView
        style={{
          alignSelf: "center",
          height: height * 0.84,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("@/assets/images/0.png")}
          contentFit="contain"
          style={{
            height: height * 0.3,
            width: width * 0.8,
            alignSelf: "center",
          }}
        />
        <ThemedText
          style={{ fontWeight: "bold", fontSize: 24, color: Colors.dark.icon }}
        >
          Bookme
        </ThemedText>
        <ThemedText
          style={{
            padding: 5,
            fontSize: 11,
            fontFamily: "SpaceMono",
            color: "#5065E2",
          }}
        >
          The most recommended online library
        </ThemedText>
        <Pressable
          style={{
            backgroundColor:
              theme == "light" ? "rgb(230,236,255)" : Colors.dark.blur,
            borderRadius: 40,
            padding: 10,
            width: width * 0.9,
            height: 50,
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
          onPress={() => {
            router.push("/others/search");
          }}
        >
          <View style={{ flexDirection: "row",paddingLeft:5 }}>
            <ThemedText style={{ opacity: 0.5 }}>Search by : </ThemedText>
            <TypingEffect
              texts={[
                "Title",
                "Topic",
                "Edition",
                "Author(S)",
                "Series",
                "Year of publication",
                "Publishers",
                "ISBN",
                "Works",
              ]}
              typingDelay={150}
              cursorDelay={300}
            />
          </View>
          <View
            style={{
              backgroundColor: Colors.dark.icon,
              height: height * 0.05,
              width: "13%",
              borderRadius: 1000,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SimpleLineIcons name="magnifier" color={"white"} size={20} />
          </View>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}
