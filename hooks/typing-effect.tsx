import { Text, useColorScheme, View } from "react-native";
import React from "react";
import Styles from "./typing-effect.styles";
import TypingEffectProps from "./interfaces";
import useTypingEffect from "./useTypingEffect";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { width } from "@/constants/Styles";

const TypingEffect = ({
  texts,
  typingDelay = 200,
  cursorDelay = 400,
  onEndTyping,
}: TypingEffectProps) => {
  const { typedText, isCursor } = useTypingEffect({
    texts,
    typingDelay,
    cursorDelay,
    onEndTyping,
  });
  const [theme] = useColorScheme() ?? "light";
  return (
    <ThemedView
      style={[
        Styles.container,
        {
          backgroundColor: "transparent",
          width: width * 0.5,
          alignItems: "center",
        },
      ]}
    >
      <ThemedText
        style={{
          fontFamily: "SpaceMono",
          fontSize: 13,
          alignSelf: "center",
          opacity: 0.5,
        }}
      >
        {`${typedText}`}
        {isCursor && <ThemedText style={Styles.corsur}> |</ThemedText>}
      </ThemedText>
    </ThemedView>
  );
};

export default TypingEffect;
