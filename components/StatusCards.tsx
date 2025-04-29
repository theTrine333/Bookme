import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { ThemedView } from "./ThemedView";
import Styles, { height } from "@/constants/Styles";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
interface props {
  status: number | undefined;
  reloadAction: any;
}
const StatusCards = ({ status, reloadAction }: props) => {
  const theme = useColorScheme() ?? "light";
  const [loading, setLoading] = useState(false);
  return (
    <ThemedView
      style={[Styles.statusCard, { backgroundColor: Colors[theme].blur }]}
    >
      {status == 200 ? (
        <>
          <ThemedText style={{ fontWeight: "400", fontFamily: "SpaceMono" }}>
            Status code
          </ThemedText>
          <ThemedText
            style={{ fontSize: 22, fontFamily: "SpaceMono", color: "#E2003A" }}
          >
            404
          </ThemedText>
        </>
      ) : (
        <>
          <ThemedText style={{ fontWeight: "400", fontFamily: "SpaceMono" }}>
            Status code
          </ThemedText>
          <ThemedText
            style={{ fontSize: 22, fontFamily: "SpaceMono", color: "#E2003A" }}
          >
            {status}
          </ThemedText>
        </>
      )}

      {status == 503 ? (
        <ThemedText style={{ fontSize: 10 }}>
          Check on your internet connection and try again later
        </ThemedText>
      ) : status == 200 ? (
        <ThemedText style={{ fontSize: 10 }}>
          No results found at the momemnt, try again later
        </ThemedText>
      ) : (
        <ThemedText style={{ fontSize: 10 }}>
          Check on your internet connection and try again later
        </ThemedText>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: Colors.dark.icon,
          width: "60%",
          height: height * 0.06,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          setLoading(true);
          setTimeout(reloadAction, 1500);
        }}
      >
        {loading ? (
          <ActivityIndicator size={28} color={"white"} />
        ) : (
          <MaterialCommunityIcons name="reload" color={"white"} size={28} />
        )}
      </TouchableOpacity>
    </ThemedView>
  );
};

export const Empty = () => {
  const theme = useColorScheme() ?? "light";
  return (
    <ThemedView
      style={[Styles.statusCard, { backgroundColor: Colors[theme].blur }]}
    >
      <Ionicons
        name="reload-circle-outline"
        size={70}
        color={Colors[theme].text}
      />
      <ThemedText>No more content found</ThemedText>
    </ThemedView>
  );
};
export default StatusCards;
