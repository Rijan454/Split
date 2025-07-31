import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SummariesRepository from "../app/Repositories/SummariesRepository";

export default function SummariesScreen() {
  const router = useRouter();

  const [suggestedPayment, setSuggestedPayment] = useState(true);
  const [currencies, setCurrencies] = useState(true);
  const [dates, setDates] = useState(true);
  const [categories, setCategories] = useState(true);

  // Fetch preferences on load
  useEffect(() => {
    const loadPreferences = async () => {
      const saved = await SummariesRepository.getSummariesSettings();
      if (saved) {
        setSuggestedPayment(saved.suggestedPayment ?? true);
        setCurrencies(saved.currencies ?? true);
        setDates(saved.dates ?? true);
        setCategories(saved.categories ?? true);
      }
    };
    loadPreferences();
  }, []);

  // Update helper
  const handleToggle = (key: string, value: boolean) => {
    const update = { [key]: value };
    SummariesRepository.updateSummariesSettings(update);

    // Local update
    switch (key) {
      case "suggestedPayment":
        setSuggestedPayment(value);
        break;
      case "currencies":
        setCurrencies(value);
        break;
      case "dates":
        setDates(value);
        break;
      case "categories":
        setCategories(value);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Suggested Payment</Text>
          <Switch
            value={suggestedPayment}
            onValueChange={(val) => handleToggle("suggestedPayment", val)}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Currencies</Text>
          <Switch
            value={currencies}
            onValueChange={(val) => handleToggle("currencies", val)}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Dates</Text>
          <Switch
            value={dates}
            onValueChange={(val) => handleToggle("dates", val)}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Categories</Text>
          <Switch
            value={categories}
            onValueChange={(val) => handleToggle("categories", val)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  card: {
    marginTop: 60,
    backgroundColor: "#EFEAEA",
    borderRadius: 10,
    paddingVertical: 10,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
