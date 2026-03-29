import React from "react";
import { View, Text, FlatList, Dimensions } from "react-native";
import Card from "../components/Card";
import UnoButton from "../components/UnoButton";
import DrawPile from "../components/DrawPile";

const { width } = Dimensions.get("window");

const mockHand = [
  { id: "1", color: "red", value: "5" },
  { id: "2", color: "blue", value: "9" },
  { id: "3", color: "green", value: "2" },
  { id: "4", color: "yellow", value: "skip" },
];

const GameScreen = () => {
  return (
    <View className="flex-1 bg-green-700 p-3">
      {/* 🔴 Opponents */}
      <View className="h-24 flex-row justify-around items-center">
        <Text className="text-white">Player 2 (5 cards)</Text>
        <Text className="text-white">Player 3 (3 cards)</Text>
      </View>

      {/* 🟡 Center Board */}
      <View className="flex-1 justify-center items-center">
        {/* Current Card */}
        <Card color="red" value="7" large />

        {/* Draw + UNO */}
        <View className="flex-row mt-6 items-center gap-6">
          <DrawPile />
          <UnoButton />
        </View>
      </View>

      {/* 🔵 Player Hand */}
      <View className="h-36">
        <FlatList
          horizontal
          data={mockHand}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card color={item.color} value={item.value} />
          )}
        />
      </View>
    </View>
  );
};

export default GameScreen;
