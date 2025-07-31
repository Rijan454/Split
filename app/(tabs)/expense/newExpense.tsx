import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NewExpense() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("0.00");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateLabel, setDateLabel] = useState("Select date");

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setDateLabel(selectedDate.toLocaleDateString());
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <TouchableOpacity>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.row}>
        <TextInput
          placeholder="Title"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
          style={styles.titleInput}
        />
      </View>

      {/* Amount */}
      <View style={styles.row}>
        <Text style={styles.label}>Amount</Text>
        <Text style={styles.value}>${amount}</Text>
      </View>

      {/* By */}
      <View style={styles.row}>
        <Text style={styles.label}>By</Text>
        <Ionicons name="arrow-forward" size={24} color="black" />
      </View>

      {/* For */}
      <View style={styles.row}>
        <Text style={styles.label}>For</Text>
        <Ionicons name="arrow-forward" size={24} color="black" />
      </View>

      {/* Currency */}
      <View style={styles.row}>
        <Text style={styles.label}>Currency</Text>
        <Text style={styles.value}>$(AUD)</Text>
      </View>

      {/* Date Picker */}
      <View style={styles.row}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>{dateLabel}</Text>
          <Ionicons name="calendar" size={24} color="black" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={onChangeDate}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#888",
  },
  cancelText: {
    color: "red",
    fontWeight: "600",
    fontSize: 16,
  },
  saveText: {
    color: "red",
    fontWeight: "600",
    fontSize: 16,
  },
  row: {
    backgroundColor: "#f1e7e8",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontWeight: "bold",
    fontSize: 16,
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#888",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d3d3d3",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#888",
    marginRight: 8,
  },
});