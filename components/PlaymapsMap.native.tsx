import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef } from "react";
import MapView, { Marker, Region } from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";
import { Park } from "../app/constants";

const COLORS = {
  primary: "#6FA57A",
  accent: "#F2D27D",
  border: "#E7E1D6",
  textSecondary: "#6D767C",
};

const FALLBACK_REGION = {
  latitude: 55.6761,
  longitude: 12.5683,
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
  const mapRef = useRef<MapView>(null);
  const focusedPark = parks.find((park) => park.id === focusedId) ?? parks[0];
  const mapRegion = useMemo<Region>(() => {
    if (currentLocation) {
      return {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      };
    }

    return {
      latitude: focusedPark?.latitude ?? FALLBACK_REGION.latitude,
      longitude: focusedPark?.longitude ?? FALLBACK_REGION.longitude,
      latitudeDelta: 0.035,
      longitudeDelta: 0.035,
    };
  }, [currentLocation, focusedPark?.latitude, focusedPark?.longitude]);

  useEffect(() => {
    mapRef.current?.animateToRegion(mapRegion, 450);
  }, [mapRegion]);

  return (
    <View style={styles.nativeMapShell}>
      <MapView
        ref={mapRef}
        style={styles.nativeMap}
        initialRegion={mapRegion}
        showsCompass={false}
        showsUserLocation={Boolean(currentLocation)}
        showsScale={false}
        toolbarEnabled={false}
        rotateEnabled={false}
      >
        {currentLocation ? (
          <Marker
            coordinate={currentLocation}
            tracksViewChanges={false}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.userLocationRing}>
              <View style={styles.userLocationDot} />
            </View>
          </Marker>
        ) : null}

        {parks.map((park) => {
          const selected = park.id === focusedId;

          return (
            <Marker
              key={park.id}
              coordinate={{
                latitude: park.latitude,
                longitude: park.longitude,
              }}
              onPress={() => onSelect(park.id)}
              tracksViewChanges={false}
            >
              <View
                style={[
                  styles.nativeMarker,
                  selected && styles.nativeMarkerSelected,
                ]}
              >
                <MaterialCommunityIcons
                  name="map-marker"
                  size={selected ? 34 : 28}
                  color={selected ? COLORS.accent : COLORS.primary}
                />
              </View>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.mapHintChip}>
        <MaterialCommunityIcons
          name="gesture-tap"
          size={16}
          color={COLORS.textSecondary}
        />
        <Text style={styles.mapHintText}>Tap a pin to inspect a playground</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nativeMapShell: {
    width: "100%",
    aspectRatio: 363 / 248,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#E7F0E3",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 3,
  },
  nativeMap: {
    width: "100%",
    height: "100%",
  },
  nativeMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  nativeMarkerSelected: {
    transform: [{ scale: 1.05 }],
  },
  userLocationRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(143,191,217,0.24)",
    borderWidth: 2,
    borderColor: "#8FBFD9",
  },
  userLocationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#8FBFD9",
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
});
