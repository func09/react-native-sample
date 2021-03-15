import "react-native-gesture-handler";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { RootNavigator } from "./screens";
import {
  useFonts,
  NotoSansJP_400Regular,
  NotoSansJP_700Bold,
} from "@expo-google-fonts/noto-sans-jp";

export default function App() {
  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
