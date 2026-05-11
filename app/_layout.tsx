import { Stack } from "expo-router";
import { PlaymapsProvider } from "./context/PlaymapsContext";

export default function RootLayout() {
  return (
    <PlaymapsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PlaymapsProvider>
  );
}
