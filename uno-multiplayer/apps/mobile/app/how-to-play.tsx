import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Fonts } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInRight,
  FadeInUp,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

// Localized types for deep content
type RuleDetail = {
  id: number;
  title: string;
  desc: string;
  longDesc: string;
  icon: string;
  color: string;
  tip: string;
};

const RULES: RuleDetail[] = [
  {
    id: 1,
    title: "The Objective",
    desc: "Be the first to clear your hand.",
    longDesc:
      "The game ends immediately when a player plays their last card. Points are then tallied from the cards remaining in other players' hands.",
    icon: "trophy",
    color: "#FFDE00",
    tip: "Keep an eye on opponents' card counts at all times!",
  },
  {
    id: 2,
    title: "Matching Cards",
    desc: "Match by Color, Number, or Symbol.",
    longDesc:
      "You can play a card if it matches the current top card's color (Red, Blue, Green, Yellow) or its value (0-9). Symbols (Skip/Reverse) also count as matches.",
    icon: "copy",
    color: "#00A651",
    tip: "Save your matching colors for when you need to pivot the game flow.",
  },
  {
    id: 3,
    title: "Action Cards",
    desc: "Strategic disruption tools.",
    longDesc:
      "Draw Two: Next player draws 2 and misses a turn.\nSkip: Next player is skipped.\nReverse: Changes the direction of play.",
    icon: "flash",
    color: "#ED1C24",
    tip: "Use Reverse strategically to keep a winning player away from their turn.",
  },
  {
    id: 4,
    title: "Wild Cards",
    desc: "The ultimate power move.",
    longDesc:
      "Wild: Choose the next active color.\nWild Draw 4: Choose the color AND the next player draws 4. Can only be played if you have no cards matching the current color.",
    icon: "color-palette",
    color: "#000000",
    tip: "Wild Draw 4 is your strongest weapon—use it for the 'shout' phase.",
  },
];

export default function HowToPlay() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Immersive Header */}
      <BlurView
        intensity={isDark ? 20 : 40}
        tint={isDark ? "dark" : "light"}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <Ionicons name="chevron-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text
            style={[
              styles.headerTitle,
              { color: theme.text, fontFamily: Fonts?.sans },
            ]}
          >
            RULEBOOK
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.icon }]}>
            Master the Art of Uno
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </BlurView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Stats/Summary Header */}
        <View style={[styles.summaryBox, { borderColor: theme.icon + "22" }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text }]}>2-10</Text>
            <Text style={[styles.statLabel, { color: theme.icon }]}>
              Players
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: theme.icon + "22" }]}
          />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text }]}>7</Text>
            <Text style={[styles.statLabel, { color: theme.icon }]}>
              Cards Dealt
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: theme.icon + "22" }]}
          />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text }]}>108</Text>
            <Text style={[styles.statLabel, { color: theme.icon }]}>
              Total Deck
            </Text>
          </View>
        </View>

        {RULES.map((rule, index) => {
          const isExpanded = expandedId === rule.id;

          return (
            <Pressable
              key={rule.id}
              onPress={() => setExpandedId(isExpanded ? null : rule.id)}
            >
              <Animated.View
                layout={Layout.springify()}
                entering={FadeInUp.delay(index * 100)}
                style={[
                  styles.ruleCard,
                  {
                    backgroundColor: isDark ? "#121212" : "#FFFFFF",
                    borderColor: isExpanded ? rule.color : "transparent",
                    borderWidth: 1,
                  },
                ]}
              >
                <View style={styles.ruleHeader}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: rule.color + "15" },
                    ]}
                  >
                    <Ionicons
                      name={rule.icon as any}
                      size={22}
                      color={rule.color}
                    />
                  </View>
                  <View style={styles.ruleMainInfo}>
                    <Text style={[styles.ruleTitle, { color: theme.text }]}>
                      {rule.title}
                    </Text>
                    <Text style={[styles.ruleDesc, { color: theme.icon }]}>
                      {rule.desc}
                    </Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={theme.icon}
                  />
                </View>

                {isExpanded && (
                  <Animated.View
                    entering={FadeInUp}
                    style={styles.expandedContent}
                  >
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: theme.icon + "15" },
                      ]}
                    />
                    <Text style={[styles.longDesc, { color: theme.text }]}>
                      {rule.longDesc}
                    </Text>

                    <View
                      style={[
                        styles.tipContainer,
                        {
                          backgroundColor: rule.color + "10",
                          borderColor: rule.color + "30",
                        },
                      ]}
                    >
                      <Ionicons
                        name="bulb-outline"
                        size={16}
                        color={rule.color}
                      />
                      <Text style={[styles.tipText, { color: theme.text }]}>
                        <Text style={{ fontWeight: "bold", color: rule.color }}>
                          PRO TIP:{" "}
                        </Text>
                        {rule.tip}
                      </Text>
                    </View>
                  </Animated.View>
                )}
              </Animated.View>
            </Pressable>
          );
        })}

        {/* The "Uno Shout" Section - Highlighted separately because it's the core mechanic */}
        <View
          style={[
            styles.specialSection,
            { backgroundColor: isDark ? "#1A0000" : "#FFF5F5" },
          ]}
        >
          <Text style={styles.specialTitle}>The "UNO" Shout</Text>
          <Text style={[styles.specialDesc, { color: theme.text }]}>
            Failure to shout{" "}
            <Text style={{ fontWeight: "900", color: "#ED1C24" }}>UNO</Text>{" "}
            when playing your second-to-last card results in a{" "}
            <Text style={{ fontWeight: "bold" }}>2-card penalty</Text> if caught
            by another player.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.back()}
        >
          <Text style={styles.ctaText}>I'M READY TO PLAY</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    zIndex: 10,
  },
  headerTextContainer: { alignItems: "center" },
  headerTitle: { fontSize: 14, fontWeight: "900", letterSpacing: 3 },
  headerSubtitle: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  closeButton: { padding: 5 },
  scrollContent: { padding: 20 },

  summaryBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 25,
  },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800" },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    marginTop: 4,
  },
  statDivider: { width: 1, height: "60%", alignSelf: "center" },

  ruleCard: {
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  ruleHeader: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  ruleMainInfo: { flex: 1 },
  ruleTitle: { fontSize: 16, fontWeight: "800" },
  ruleDesc: { fontSize: 13, fontWeight: "500", marginTop: 2 },

  expandedContent: { marginTop: 15 },
  divider: { height: 1, width: "100%", marginBottom: 15 },
  longDesc: { fontSize: 14, lineHeight: 22, fontWeight: "500" },
  tipContainer: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
    borderWidth: 1,
    alignItems: "flex-start",
    gap: 8,
  },
  tipText: { flex: 1, fontSize: 12, lineHeight: 18 },

  specialSection: {
    padding: 25,
    borderRadius: 24,
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#ED1C2433",
  },
  specialTitle: {
    color: "#ED1C24",
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "italic",
    marginBottom: 10,
  },
  specialDesc: { fontSize: 14, lineHeight: 22, fontWeight: "500" },

  ctaButton: {
    backgroundColor: "#ED1C24",
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 50,
    shadowColor: "#ED1C24",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  ctaText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
});
