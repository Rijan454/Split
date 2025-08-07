import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Assets
const logo = require("../assets/images/Split-logo.png");
const backgroundVideo = require("../assets/images/BackgroundSplit.mp4");

export default function IndexScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { inviteGroupId } = useLocalSearchParams();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );
      const user = userCredential.user;
      const uid = user.uid;

      if (inviteGroupId) {
        const memberRef = doc(db, `users/${uid}/groupMembers/${uid}`);
        const snapshot = await getDoc(memberRef);
        if (!snapshot.exists()) {
          await setDoc(memberRef, {
            uid,
            name: user.displayName || "Anonymous",
            groupId: inviteGroupId,
          });
        }
      }

      router.replace("/(tabs)");
    } catch (error: any) {
      let message = "Login failed. Please try again.";

      switch (error.code) {
        case "auth/invalid-email":
          message = "Invalid email format.";
          break;
        case "auth/user-not-found":
          message = "No account found with this email. Please sign up.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password. Please try again.";
          break;
        case "auth/user-disabled":
          message = "This user account has been disabled.";
          break;
        default:
          message = error.message || message;
      }

      Alert.alert("Login Error", message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        source={backgroundVideo}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isMuted
        isLooping
      />

      {/* Dark overlay */}
      <View style={styles.overlay} />

      {/* Login content */}
      <View style={styles.content}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
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

        <TouchableOpacity onPress={() => router.push("/resetPassword")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.linkText}>Don’t have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
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
    marginBottom: 5,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  eyeIcon: {
    paddingHorizontal: 6,
  },
  forgotPassword: {
    color: "#fff",
    textAlign: "right",
    marginBottom: 15,
    marginRight: 4,
    textDecorationLine: "underline",
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
