import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { BlurView } from "expo-blur";

const COLORS = [
  { id: "red", hex: "#ED1C24", label: "RED" },
  { id: "blue", hex: "#005697", label: "BLUE" },
  { id: "green", hex: "#00A651", label: "GREEN" },
  { id: "yellow", hex: "#FFDE00", label: "YELLOW" },
];

export default function ColorPicker({
  visible,
  onSelect,
}: {
  visible: boolean;
  onSelect: (color: string) => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={80} tint="dark" style={styles.container}>
        <Animated.View entering={ZoomIn.duration(300)} style={styles.modalCard}>
          <Text style={styles.title}>PICK A COLOR</Text>
          <View style={styles.grid}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color.id}
                onPress={() => onSelect(color.id)}
                style={[styles.colorBtn, { backgroundColor: color.hex }]}
                activeOpacity={0.8}
              >
                <View style={styles.innerRing} />
                <Text
                  style={[
                    styles.colorLabel,
                    color.id === "yellow" && { color: "#000" },
                  ]}
                >
                  {color.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalCard: {
    width: "85%",
    backgroundColor: "#000",
    borderRadius: 30,
    padding: 25,
    borderWidth: 3,
    borderColor: "#333",
    alignItems: "center",
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 25,
    fontStyle: "italic",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    justifyContent: "center",
  },
  colorBtn: {
    width: "45%",
    height: 120,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#000",
  },
  innerRing: {
    position: "absolute",
    width: "80%",
    height: "80%",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    borderStyle: "dashed",
  },
  colorLabel: {
    color: "#FFF",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },
});
