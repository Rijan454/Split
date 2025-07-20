import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../lib/firebase";

const logo = require("../assets/images/Split-logo.png");

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );

      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });

      console.log("Account created successfully");

      //Show success message
      Alert.alert("Success", "Account created successfully!");

      // Navigate to Sign In screen
      router.replace("/");
    } catch (error: any) {
      console.log("Signup Error:", error);
      Alert.alert("Sign Up Failed", error.message || "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Create a new account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        textContentType="username"
        autoComplete="username"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          textContentType="newPassword"
          autoComplete="password-new"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#888"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry={!showConfirm}
          textContentType="newPassword"
          autoComplete="password-new"
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Ionicons
            name={showConfirm ? "eye-off" : "eye"}
            size={24}
            color="#888"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/")}>
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2DBCC0",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  eyeIcon: {
    paddingHorizontal: 6,
  },
  button: {
    backgroundColor: "#3BE7CD",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
  linkText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});