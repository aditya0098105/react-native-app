import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../../lib/db";

export default function BookHotel() {
  const { hotel, cityId, city } = useLocalSearchParams<{
    hotel: string;
    cityId: string; // ✅ ab slug bhi aa raha hai
    city: string;
  }>();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const saveBooking = async () => {
    try {
      await db.runAsync(
        "INSERT INTO bookings (hotel_name, city, customer_name, customer_address, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
        [
          hotel || "Unknown Hotel",
          cityId, // ✅ slug store ho raha hai e.g. "new-york"
          name,
          address,
          start,
          end,
        ]
      );

      Alert.alert("✅ Success", "Booking confirmed!");
    } catch (e) {
      console.log("❌ Error:", e);
      Alert.alert("Error", "Could not save booking");
    }
  };

  return (
    <View style={s.wrap}>
      <Text style={s.title}>
        Book {hotel} ({city})
      </Text>

      <TextInput
        style={s.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={s.input}
        placeholder="Your Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={s.input}
        placeholder="Start Date (YYYY-MM-DD)"
        value={start}
        onChangeText={setStart}
      />
      <TextInput
        style={s.input}
        placeholder="End Date (YYYY-MM-DD)"
        value={end}
        onChangeText={setEnd}
      />

      <TouchableOpacity style={s.btn} onPress={saveBooking}>
        <Text style={s.btnText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  btn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
