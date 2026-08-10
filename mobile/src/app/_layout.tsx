import { Stack, useRouter, useSegments } from "expo-router";
import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    getToken().then((token) => {
        setIsAuthed(!!token);
    }).catch((err) => {
        console.error('Failed to check auth token:', err);
        setIsAuthed(false);
    });
  }, []);

  useEffect(() => {
    if (isAuthed === null) return;

    getToken().then((token) => {
        const currentlyAuthed = !!token
        const inAuthGroup = segments[0] === '(auth)';

        if (currentlyAuthed === false && inAuthGroup === false){
            router.replace('/(auth)/login');
        } 

        if (currentlyAuthed === true && inAuthGroup === true){
            router.replace('/(protected)');
        }
    })
  }, [segments]);

  return (
    <SafeAreaProvider>
       <Stack screenOptions={{ headerShown: false }} /> 
    </SafeAreaProvider>
    )
}
