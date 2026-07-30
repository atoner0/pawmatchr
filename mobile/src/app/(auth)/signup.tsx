import { TextInput, Text, Button, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { AuthResponse } from "@/types/authSchemas";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [postcode, setPostcode] = useState("");
  const [error, setError] = useState("");

  const router = useRouter()

  const handleSignup = async () => {
    try {
      const response = await apiFetch<AuthResponse>('/adopter/signup', {
        method: 'POST',
        body: JSON.stringify({ 
            first_name: firstName, 
            last_name: lastName, 
            email, 
            password, 
            phone: phoneNo, 
            postcode  }),
      });

      await setToken(response.token);
    
      router.replace('/(protected)/questionnaire')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setError(errorMessage);
    }
  }

  return (
    <View>
    <TextInput
        placeholder="First Name"
        value = {firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        placeholder="Last Name"
        value = {lastName}
        onChangeText={setLastName}
      />
      <TextInput
        placeholder="Email"
        value = {email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value = {password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="Phone Number"
        value = {phoneNo}
        onChangeText={setPhoneNo}
      />
      <TextInput
        placeholder="Postcode"
        value = {postcode}
        onChangeText={setPostcode}
      />
      {error ? <Text>{error}</Text> : null}
      <Button title="Sign Up" onPress={handleSignup}/>
    </View>
  );
}