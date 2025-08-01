import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase"; // adjust your path

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset email sent!");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Reset Password</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          marginBottom: 10,
          padding: 8,
        }}
      />
      <Button title="Send Reset Email" onPress={handleReset} />
    </View>
  );
}