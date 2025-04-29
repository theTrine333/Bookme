/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    blur: "rgba(220,220,220,0.5)",
  },
  dark: {
    text: "#ECEDEE",
    background: "#232526",
    tint: tintColorDark,
    icon: "rgb(247,147,30)",
    blur: "rgba(0,0,0,0.5)",
    tabIconDefault: "#232526",
    tabIconSelected: tintColorDark,
  },
  constants: {
    red: "#E3002A",
  },
};
