import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { PlaymapsMapSurface } from "../../components/PlaymapsMap";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { Kid, Park, PARKS } from "../constants";

const COLORS = {
  primary: "#6FA57A",
  secondary: "#8FBFD9",
  accent: "#F2D27D",
  background: "#F7F5F0",
  surface: "#FFFDF8",
  textPrimary: "#384248",
  textSecondary: "#6D767C",
  success: "#78B97A",
  hover: "#5D8D68",
  border: "#E7E1D6",
};

type BottomNavProps = {
  active: "home" | "profile" | "menu";
  onNavigate: (screen: "home" | "profile" | "menu") => void;
};

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <View style={styles.bottomNav}>
      <NavButton
        icon="menu"
        label="Menu"
        active={active === "menu"}
        onPress={() => onNavigate("menu")}
      />
      <NavButton
        icon="map-marker-radius"
        label="Kort"
        active={active === "home"}
        onPress={() => onNavigate("home")}
      />
      <NavButton
        icon="account-circle"
        label="Profil"
        active={active === "profile"}
        onPress={() => onNavigate("profile")}
      />
    </View>
  );
}

function NavButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.navButton, active && styles.navButtonActive]}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={28}
        color={active ? COLORS.primary : COLORS.textSecondary}
      />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ParkInfoCard({
  park,
  onNavigate,
  onOpenDetails,
  onCopyLink,
  compact = false,
}: {
  park: Park;
  onNavigate: () => void;
  onOpenDetails: () => void;
  onCopyLink?: () => void;
  compact?: boolean;
}) {
  const featureTags = park.facilities.slice(0, 3);
  const rating = (4.4 + (park.count % 5) * 0.1).toFixed(1);

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.cardMedia}>
        <View style={styles.cardMediaGlow} />
        <View style={styles.cardMediaBadge}>
          <MaterialCommunityIcons
            name="heart-outline"
            size={18}
            color={COLORS.textSecondary}
          />
        </View>
        <View style={styles.cardMediaPlayground}>
          <MaterialCommunityIcons
            name="slide"
            size={38}
            color={COLORS.surface}
          />
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Pressable onPress={onOpenDetails} style={styles.cardTitleButton}>
            <Text style={styles.cardTitle}>{park.name}</Text>
          </Pressable>
          <View style={styles.cardRating}>
            <MaterialCommunityIcons
              name="star"
              size={16}
              color={COLORS.accent}
            />
            <Text style={styles.cardRatingText}>{rating}</Text>
          </View>
        </View>

        <Text style={styles.cardMeta}>
          {park.km.toFixed(1)} km væk ·{" "}
          <Text style={styles.cardMetaActive}>{park.count} børn her nu</Text>
        </Text>
        <Pressable
          disabled={!onCopyLink}
          onPress={onCopyLink}
          style={styles.copyCoordinateButton}
        >
          <MaterialCommunityIcons
            name="link-variant"
            size={14}
            color={COLORS.textSecondary}
          />
          <Text style={styles.cardSubtitle}>
            {park.address} · {park.facilityCount} faciliteter
          </Text>
        </Pressable>

        <View style={styles.cardTags}>
          {featureTags.map((facility) => (
            <View key={facility} style={styles.cardTag}>
              <Text style={styles.cardTagText}>{facility}</Text>
            </View>
          ))}
          {park.facilityCount > featureTags.length ? (
            <View style={styles.cardTagMuted}>
              <Text style={styles.cardTagMutedText}>
                +{park.facilityCount - featureTags.length}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.cardActions}>
          <Pressable onPress={onNavigate} style={styles.secondaryAction}>
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={16}
              color={COLORS.surface}
            />
            <Text style={styles.secondaryActionText}>View on Map</Text>
          </Pressable>
          <Pressable onPress={onOpenDetails} style={styles.detailsAction}>
            <MaterialCommunityIcons
              name="chevron-right-circle"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.detailsActionText}>Details</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function PlaymapsMap({
  parks = PARKS,
  focusedId,
  currentLocation,
  onSelect,
}: {
  parks?: Park[];
  focusedId: string;
  currentLocation?: { latitude: number; longitude: number } | null;
  onSelect: (parkId: string) => void;
}) {
  return (
    <PlaymapsMapSurface
      parks={parks}
      focusedId={focusedId}
      currentLocation={currentLocation}
      onSelect={onSelect}
    />
  );
}

export function FacilityRow({ name }: { name: string }) {
  return (
    <View style={styles.facilityRow}>
      <MaterialCommunityIcons
        name={facilityIcon(name) as any}
        size={18}
        color={COLORS.primary}
      />
      <Text style={styles.facilityText}>{name}</Text>
    </View>
  );
}

function facilityIcon(name: string) {
  switch (name) {
    case "Gynger":
      return "human-child";
    case "Rutsjebane":
      return "slide";
    case "Fodboldbane":
      return "soccer-field";
    case "Sandkasse":
      return "beach";
    case "Klatrestativ":
      return "tree";
    case "Vippe":
      return "swap-horizontal";
    case "Legehus":
      return "home-variant";
    case "Karrusel":
      return "rotate-3d-variant";
    case "Basketball":
      return "basketball";
    case "Picnic":
      return "food";
    case "Belysning":
      return "lightbulb-outline";
    case "Bænke":
      return "seat";
    case "Vandpost":
      return "water";
    case "Tilgængelighed":
      return "wheelchair-accessibility";
    case "Førstehjælp":
      return "medical-bag";
    case "Hundegård":
      return "dog";
    case "Toilet":
      return "toilet";
    default:
      return "shape";
  }
}

export function ModalSheet({
  visible,
  onClose,
  title,
  subtitle,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackdrop}>
        <Pressable style={styles.modalOverlay} onPress={onClose} />
        <View style={styles.modalSheet}>
          <View style={styles.modalBar} />
          <Text style={styles.modalTitle}>{title}</Text>
          {subtitle ? (
            <Text style={styles.modalSubtitle}>{subtitle}</Text>
          ) : null}
          <ScrollView contentContainerStyle={styles.modalContent}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function ChildCard({
  kid,
  onPress,
  disabled = false,
  note,
}: {
  kid: Kid;
  onPress: () => void;
  disabled?: boolean;
  note?: string;
}) {
  return (
    <Pressable
      disabled={disabled}
      style={[styles.childCard, disabled && styles.childCardDisabled]}
      onPress={onPress}
    >
      <Text style={styles.childCardText}>{kid.name}</Text>
      {note ? <Text style={styles.childCardNote}>{note}</Text> : null}
    </Pressable>
  );
}

export function Screen({
  children,
  variant = "cream",
}: {
  children: ReactNode;
  variant?: "cream" | "home";
}) {
  return (
    <View
      style={[
        styles.screen,
        variant === "home" ? styles.homeScreen : styles.creamScreen,
      ]}
    >
      {children}
    </View>
  );
}

export function AppLogo({ size = 112 }: { size?: number }) {
  return (
    <View style={[styles.logo, { width: size, height: size }]}>
      <MaterialCommunityIcons
        name="map-marker-radius"
        size={size * 0.7}
        color={COLORS.hover}
      />
      <View style={styles.logoSmile}>
        <MaterialCommunityIcons
          name="emoticon-happy-outline"
          size={size * 0.32}
          color={COLORS.hover}
        />
      </View>
    </View>
  );
}

export function IconButton({
  icon,
  onPress,
  active = false,
  style,
}: {
  icon: string;
  onPress: () => void;
  active?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.iconButton, active && styles.iconButtonActive, style]}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={22}
        color={active ? COLORS.hover : COLORS.textPrimary}
      />
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  danger = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.primaryButton,
        danger && styles.dangerButton,
        disabled && styles.disabledButton,
      ]}
    >
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        style={styles.fieldInput}
      />
    </View>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.selectBox}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectContent}
        >
          {options.map((option) => (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={[
                styles.selectOption,
                value === option && styles.selectOptionActive,
              ]}
            >
              <Text
                style={[
                  styles.selectOptionText,
                  value === option && styles.selectOptionTextActive,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

export function MenuRow({
  iconName,
  label,
  onClick,
}: {
  iconName: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Pressable style={styles.menuRow} onPress={onClick}>
      <MaterialCommunityIcons
        name={iconName as any}
        size={22}
        color={COLORS.textPrimary}
      />
      <Text style={styles.menuRowLabel}>{label}</Text>
    </Pressable>
  );
}

export function Toast({ message }: { message: string }) {
  return (
    <View style={styles.toastContainer} pointerEvents="none">
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    height: 84,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 78,
    paddingVertical: 8,
    borderRadius: 18,
  },
  navButtonActive: {
    backgroundColor: "#EEF5EE",
  },
  navLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  navLabelActive: {
    color: COLORS.hover,
    fontWeight: "700",
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 3,
    overflow: "hidden",
  },
  cardCompact: {
    opacity: 0.96,
  },
  cardMedia: {
    height: 150,
    backgroundColor: "#BDD4A9",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cardMediaGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(93,141,104,0.16)",
  },
  cardMediaBadge: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,253,248,0.94)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardMediaPlayground: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: "rgba(93,141,104,0.78)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: 18,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  cardTitleButton: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    lineHeight: 26,
  },
  cardRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingTop: 2,
  },
  cardRatingText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  cardMeta: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  cardMetaActive: {
    color: COLORS.success,
    fontWeight: "700",
  },
  cardSubtitle: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  copyCoordinateButton: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardTags: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cardTag: {
    backgroundColor: "#F5F1E8",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  cardTagText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  cardTagMuted: {
    backgroundColor: "#F0EEE7",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  cardTagMutedText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  cardActions: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.surface,
  },
  detailsAction: {
    minWidth: 104,
    minHeight: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8E8D4",
    backgroundColor: "#FFFDF8",
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  detailsActionText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "800",
  },
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
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#EEF2E8",
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
    color: COLORS.surface,
    fontSize: 11,
    fontWeight: "700",
    minWidth: 86,
    textAlign: "center",
  },
  facilityRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#F5F1E8",
  },
  facilityText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(56,66,72,0.22)",
    justifyContent: "flex-end",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 40,
    minHeight: 320,
  },
  modalBar: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D8D2C8",
    alignSelf: "center",
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 18,
    lineHeight: 20,
  },
  modalContent: {
    paddingBottom: 20,
  },
  childCard: {
    width: 140,
    height: 70,
    borderRadius: 20,
    backgroundColor: COLORS.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginHorizontal: 5,
  },
  childCardDisabled: {
    backgroundColor: "#C9D3C5",
    opacity: 0.72,
  },
  childCardText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.surface,
  },
  childCardNote: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
  },
  screen: {
    flex: 1,
  },
  creamScreen: {
    backgroundColor: COLORS.background,
  },
  homeScreen: {
    backgroundColor: COLORS.background,
  },
  logo: {
    alignSelf: "center",
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.accent,
    borderWidth: 3,
    borderColor: COLORS.hover,
  },
  logoSmile: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: "42%",
    height: "42%",
    borderRadius: 999,
    backgroundColor: COLORS.surface,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  iconButtonActive: {
    backgroundColor: "#F6EDCF",
  },
  primaryButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.success,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 3,
  },
  dangerButton: {
    backgroundColor: COLORS.hover,
  },
  disabledButton: {
    opacity: 0.48,
  },
  primaryButtonText: {
    color: COLORS.surface,
    fontSize: 17,
    fontWeight: "800",
  },
  fieldWrapper: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  fieldInput: {
    width: "100%",
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surface,
  },
  selectBox: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  selectContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
  },
  selectOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F5F1E8",
    marginRight: 8,
  },
  selectOptionActive: {
    backgroundColor: "#EAF3E8",
  },
  selectOptionText: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  selectOptionTextActive: {
    fontWeight: "700",
  },
  menuRow: {
    width: "100%",
    borderRadius: 14,
    backgroundColor: "#EEF3F6",
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuRowLabel: {
    marginLeft: 14,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  toastContainer: {
    position: "absolute",
    bottom: 34,
    left: 24,
    right: 24,
    backgroundColor: COLORS.hover,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: "center",
  },
  toastText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "600",
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
    backgroundColor: COLORS.secondary,
    borderWidth: 4,
    borderColor: "rgba(255,253,248,0.92)",
  },
});
