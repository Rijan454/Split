import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { account } from "../lib/appwrite";
import { useRouter } from "expo-router";

const logo = require("../assets/images/Split-logo.png");

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      await account.createSession(email, password);
      console.log("Logged in!");
      router.navigate("/");
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button title="Sign In" onPress={handleLogin} />

      <Button
        title="Don't have an account? Sign Up"
        onPress={() => router.navigate("/signup")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: "cover",
    marginBottom: 20,
    alignSelf: "center",
    overflow: "hidden",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});