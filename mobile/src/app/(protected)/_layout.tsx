import { Stack } from "expo-router";
import { AdopterProvider } from "@/context/AdopterContext";

export default function ProtectedLayout() {
  return (
    <AdopterProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AdopterProvider>
  )
}