import React from "react";
import { Pressable, Text } from "react-native";

export default function UnoButton() {
  return (
    <Pressable className="bg-yellow-400 px-6 py-3 rounded-full shadow-lg">
      <Text className="font-bold text-black text-lg">UNO</Text>
    </Pressable>
  );
}
