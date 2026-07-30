import { Stack, useRouter, useSegments } from "expo-router";
import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth";

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

    const inAuthGroup = segments[0] === '(auth)'; 

    if (isAuthed === false && inAuthGroup === false){
        router.replace('/(auth)/login');
    } 

    if (isAuthed === true && inAuthGroup === true){
        router.replace('/(protected)');
    }
  }, [isAuthed, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
