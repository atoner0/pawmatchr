import { TextInput, Text, Button, View, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { AuthResponse } from "@/types/authSchemas";
import { colors, spacing, radii, typography } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

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
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Join</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Pawmatchr</Text>
          <Ionicons name="paw" size={28} color={colors.navyDark} style={styles.pawIcon} />
        </View>
      </View>

      <View style={styles.card}> 
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor={colors.placeholder}
          value = {firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor={colors.placeholder}
          value = {lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.placeholder}
          value = {email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.placeholder}
          value = {password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={colors.placeholder}
          value = {phoneNo}
          onChangeText={setPhoneNo}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Postcode"
          placeholderTextColor={colors.placeholder}
          value = {postcode}
          onChangeText={setPostcode}
          autoCapitalize="characters"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <Pressable style={styles.primaryButton} onPress={handleSignup}>
          <Text style={typography.button}>Sign Up</Text>
        </Pressable>

        <Link href="/(auth)/login" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={typography.button}>Already have an account? Log In</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  welcomeText: {
    ...typography.subheading,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pawIcon: {
    marginLeft: spacing.xs,
  },
  title: {
    ...typography.heading,
    fontSize: 32,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.navyMid,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    marginTop: spacing.sm,
    minWidth: 160,
  },
  secondaryButton: {
    backgroundColor: colors.navyMid,
    opacity: 0.85,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    marginTop: spacing.md,
    minWidth: 160,
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacing.sm,
    textAlign: "center"
  }
})