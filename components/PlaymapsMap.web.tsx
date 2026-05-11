import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Park } from "../app/constants";

const COLORS = {
  primary: "#6FA57A",
  accent: "#F2D27D",
  textSecondary: "#6D767C",
};

export function PlaymapsMapSurface({
  parks,
  focusedId,
  currentLocation,
  onSelect,
}: {
  parks: Park[];
  focusedId: string;
  currentLocation?: { latitude: number; longitude: number } | null;
  onSelect: (parkId: string) => void;
}) {
  return (
    <View style={styles.mapContainer}>
      <View style={styles.mapBackground}>
        <View style={[styles.mapRoad, styles.mapRoadA]} />
        <View style={[styles.mapRoad, styles.mapRoadB]} />
        <View style={[styles.mapRoad, styles.mapRoadC]} />
        <View style={styles.mapParkShape} />
        <View
          style={[
            styles.currentLocation,
            currentLocation ? styles.currentLocationActive : null,
          ]}
        />
      </View>
      <View style={styles.mapHintChip}>
        <MaterialCommunityIcons
          name="monitor"
          size={16}
          color={COLORS.textSecondary}
        />
        <Text style={styles.mapHintText}>
          Interactive native map is enabled on iOS and Android
        </Text>
      </View>
      {parks.map((park) => {
        const selected = park.id === focusedId;
        return (
          <Pressable
            key={park.id}
            onPress={() => onSelect(park.id)}
            style={[
              styles.mapPin,
              { left: `${park.x}%`, top: `${park.y}%` },
              selected && styles.mapPinSelected,
            ]}
          >
            <MaterialCommunityIcons
              name="map-marker"
              size={selected ? 40 : 32}
              color={selected ? COLORS.accent : COLORS.primary}
            />
            {selected ? <Text style={styles.pinLabel}>{park.name}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    aspectRatio: 363 / 248,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#E7F0E3",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 3,
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#EEF2E8",
  },
  mapHintChip: {
    position: "absolute",
    left: 12,
    right: 12,
    top: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,253,248,0.92)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mapHintText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  mapPin: {
    position: "absolute",
    minWidth: 42,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -21 }, { translateY: -36 }],
  },
  mapPinSelected: {
    zIndex: 2,
    transform: [{ translateX: -21 }, { translateY: -38 }],
  },
  pinLabel: {
    position: "absolute",
    top: -18,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(56,66,72,0.92)",
    color: "#FFFDF8",
    fontSize: 11,
    fontWeight: "700",
    minWidth: 86,
    textAlign: "center",
  },
  mapRoad: {
    position: "absolute",
    height: 28,
    borderRadius: 16,
    backgroundColor: "rgba(255,253,248,0.9)",
  },
  mapRoadA: {
    width: "120%",
    top: "28%",
    left: "-10%",
    transform: [{ rotate: "-13deg" }],
  },
  mapRoadB: {
    width: "90%",
    top: "57%",
    right: "-12%",
    transform: [{ rotate: "24deg" }],
  },
  mapRoadC: {
    width: "70%",
    top: "12%",
    left: "18%",
    transform: [{ rotate: "78deg" }],
  },
  mapParkShape: {
    position: "absolute",
    width: "36%",
    height: "42%",
    left: "7%",
    top: "45%",
    borderRadius: 28,
    backgroundColor: "rgba(111,165,122,0.24)",
  },
  currentLocation: {
    position: "absolute",
    left: "46%",
    top: "50%",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#8FBFD9",
    borderWidth: 4,
    borderColor: "rgba(255,253,248,0.92)",
  },
  currentLocationActive: {
    transform: [{ scale: 1.1 }],
  },
});
