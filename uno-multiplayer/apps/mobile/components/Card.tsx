import React from "react";
import { View, Text, Pressable } from "react-native";

type Props = {
  color: string;
  value: string;
  large?: boolean;
  onPress?: () => void;
};

const colorMap: any = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  wild: "bg-black",
};

export default function Card({ color, value, large, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`${colorMap[color]} ${
        large ? "w-24 h-36" : "w-16 h-24"
      } rounded-xl m-1 justify-center items-center shadow-lg`}
    >
      <Text className="text-white text-xl font-bold">{value}</Text>
    </Pressable>
  );
}
