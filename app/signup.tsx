import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { account } from "../lib/appwrite";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password || !name) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      await account.create("unique()", email, password, name);
      console.log("User created!");
      router.navigate("/");
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

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

      <Button title="Sign Up" onPress={handleSignup} />

      <Button
        title="Already have an account? Sign In"
        onPress={() => router.navigate("/")}
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
