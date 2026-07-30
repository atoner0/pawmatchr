import { TextInput, Text, Button, View, Pressable } from "react-native";
import { useState } from "react";
import { useRouter, Link } from "expo-router";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { AuthResponse } from "@/types/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter()

  const handleLogin = async () => {
    try {
      const response = await apiFetch<AuthResponse>('/adopter/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      await setToken(response.token);
    
      router.replace('/(protected)')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setError(errorMessage);
    }
    
  }

  return (
    <View>
      <TextInput
        placeholder="Email"
        value = {email}
        onChangeText={setEmail}
      / >

      <TextInput
        placeholder="Password"
        value = {password}
        onChangeText={setPassword}
        secureTextEntry
      / >

      {error ? <Text>{error}</Text> : null}

      <Button title="Login" onPress={handleLogin}/>

      <Link href="/signup" asChild>
        <Pressable>
          <Text>Don't have an account? Sign Up</Text>
        </Pressable>
      </Link>

    </View>
  );
}