import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ALL_FACILITIES, Facility, Park } from "./constants";
import {
  AppLogo,
  BottomNav,
  ChildCard,
  FacilityRow,
  Field,
  IconButton,
  MenuRow,
  ModalSheet,
  ParkInfoCard,
  PlaymapsMap,
  PrimaryButton,
  Screen,
  SelectField,
} from "./components/PlaymapsUI";
import { usePlaymaps } from "./context/PlaymapsContext";

type Route = "home" | "details" | "profile" | "menu";
type InfoSheet = "faq" | "settings" | "adfree" | null;

async function openExternalMap(
  name: string,
  latitude: number,
  longitude: number,
) {
  const label = encodeURIComponent(name);
  const appleUrl = `http://maps.apple.com/?ll=${latitude},${longitude}&q=${label}`;
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const url = Platform.OS === "ios" ? appleUrl : googleUrl;
  await Linking.openURL(url);
}

async function copyMapLink(
  park: Park,
  flashToast: (message: string) => void,
) {
  const coordinates = `${park.latitude}, ${park.longitude}`;
  await Clipboard.setStringAsync(coordinates);
  flashToast(`Koordinater for ${park.name} kopieret`);
}

export default function PlaymapsApp() {
  const playmaps = usePlaymaps();
  const [route, setRoute] = useState<Route>("home");
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<Facility[]>([]);
  const [showAreaSearch, setShowAreaSearch] = useState(false);
  const [showFacilitySearch, setShowFacilitySearch] = useState(false);
  const [infoSheet, setInfoSheet] = useState<InfoSheet>(null);

  const filteredParks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return playmaps.parks.filter((park) => {
      const matchesFavorites =
        !favoritesOnly || playmaps.favorites.includes(park.id);
      const matchesQuery =
        !normalizedQuery ||
        park.name.toLowerCase().includes(normalizedQuery) ||
        park.address.toLowerCase().includes(normalizedQuery);
      const matchesFacilities =
        selectedFacilities.length === 0 ||
        selectedFacilities.every((facility) =>
          park.facilities.includes(facility),
        );

      return matchesFavorites && matchesQuery && matchesFacilities;
    });
  }, [
    favoritesOnly,
    playmaps.favorites,
    playmaps.parks,
    searchQuery,
    selectedFacilities,
  ]);

  const selectedPark = useMemo(
    () =>
      filteredParks.find((park) => park.id === playmaps.selectedParkId) ??
      filteredParks[0] ??
      playmaps.parks.find((park) => park.id === playmaps.selectedParkId) ??
      playmaps.parks[0],
    [filteredParks, playmaps.parks, playmaps.selectedParkId],
  );

  const checkedKidsHere = (playmaps.checkedIn[selectedPark.id] ?? [])
    .map((kidId) => playmaps.kids.find((kid) => kid.id === kidId))
    .filter(Boolean);
  const checkedInKidIds = useMemo(
    () => new Set(Object.values(playmaps.checkedIn).flat()),
    [playmaps.checkedIn],
  );

  const openPark = (parkId: string) => {
    playmaps.setSelectedParkId(parkId);
    playmaps.setFocusedParkId(parkId);
    setRoute("details");
  };

  const openFavorites = () => {
    setFavoritesOnly(true);
    setRoute("home");
  };

  const clearFilters = () => {
    setFavoritesOnly(false);
    setSearchQuery("");
    setSelectedFacilities([]);
  };

  if (!playmaps.session) {
    return <LoginScreen onLogin={() => setRoute("home")} />;
  }

  return (
    <Screen variant={route === "home" ? "home" : "cream"}>
      {route === "home" ? (
        <HomeScreen
          onNavigate={setRoute}
          onOpenPark={openPark}
          parks={filteredParks}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          favoritesOnly={favoritesOnly}
          selectedFacilities={selectedFacilities}
          onOpenFacilitySearch={() => setShowFacilitySearch(true)}
          onClearFilters={clearFilters}
        />
      ) : null}
      {route === "details" ? (
        <DetailsScreen
          onBack={() => setRoute("home")}
          onNavigate={setRoute}
          onCheckIn={() => setShowCheckIn(true)}
          onCheckOut={() => setShowCheckOut(true)}
        />
      ) : null}
      {route === "profile" ? (
        <ProfileScreen
          onNavigate={setRoute}
          onAddChild={() => setShowAddChild(true)}
          onLogout={() => {
            playmaps.logout();
            setRoute("home");
          }}
        />
      ) : null}
      {route === "menu" ? (
        <MenuScreen
          onNavigate={setRoute}
          onOpenFavorites={openFavorites}
          onOpenAreaSearch={() => setShowAreaSearch(true)}
          onOpenFacilitySearch={() => setShowFacilitySearch(true)}
          onOpenInfo={setInfoSheet}
        />
      ) : null}

      <ModalSheet
        visible={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        title="Check Ind"
        subtitle="Hvem checker ind?"
      >
        <View style={styles.childGrid}>
          {playmaps.kids.map((kid) => {
            const alreadyCheckedIn = checkedInKidIds.has(kid.id);

            return (
              <ChildCard
                key={kid.id}
                kid={kid}
                disabled={alreadyCheckedIn}
                note={alreadyCheckedIn ? "Allerede checket ind" : undefined}
                onPress={() => {
                  playmaps.checkInKid(selectedPark.id, kid.id);
                  setShowCheckIn(false);
                }}
              />
            );
          })}
          <Pressable
            style={styles.addChildButton}
            onPress={() => {
              setShowCheckIn(false);
              setShowAddChild(true);
            }}
          >
            <MaterialCommunityIcons name="plus" size={28} color="#fff" />
          </Pressable>
        </View>
      </ModalSheet>

      <ModalSheet
        visible={showCheckOut}
        onClose={() => setShowCheckOut(false)}
        title="Check Ud"
        subtitle="Vælg barn at checke ud"
      >
        <View style={styles.sheetList}>
          {checkedKidsHere.length ? (
            checkedKidsHere.map((kid) =>
              kid ? (
                <ChildCard
                  key={kid.id}
                  kid={kid}
                  onPress={() => {
                    playmaps.checkOutKid(selectedPark.id, kid.id);
                    setShowCheckOut(false);
                  }}
                />
              ) : null,
            )
          ) : (
            <Text style={styles.emptyText}>
              Ingen er checket ind her endnu.
            </Text>
          )}
        </View>
      </ModalSheet>

      <AddChildModal
        visible={showAddChild}
        onClose={() => setShowAddChild(false)}
      />

      <AreaSearchModal
        visible={showAreaSearch}
        value={searchQuery}
        onChange={setSearchQuery}
        onClose={() => setShowAreaSearch(false)}
        onApply={() => {
          setShowAreaSearch(false);
          setRoute("home");
        }}
      />

      <FacilitySearchModal
        visible={showFacilitySearch}
        selectedFacilities={selectedFacilities}
        onToggle={(facility) => {
          setSelectedFacilities((current) =>
            current.includes(facility)
              ? current.filter((item) => item !== facility)
              : [...current, facility],
          );
        }}
        onClose={() => setShowFacilitySearch(false)}
        onReset={() => setSelectedFacilities([])}
        onApply={() => {
          setShowFacilitySearch(false);
          setRoute("home");
        }}
      />

      <InfoModal kind={infoSheet} onClose={() => setInfoSheet(null)} />
    </Screen>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const { login, loginPending, loginError, defaultEmail, defaultPassword } =
    usePlaymaps();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);

  const submit = async () => {
    try {
      await login(email, password);
      onLogin();
    } catch {
      // Error is already surfaced through loginError.
    }
  };

  return (
    <Screen>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loginContent}>
          <AppLogo size={128} />
          <Text style={styles.brandTitle}>playmaps</Text>
          <Text style={styles.brandSubtitle}>Find legepladser i nærheden</Text>

          <View style={styles.loginFields}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#485240"
              style={styles.loginInput}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Kodeord"
              placeholderTextColor="#485240"
              secureTextEntry
              style={styles.loginInput}
            />
          </View>

          {loginError ? (
            <Text style={styles.loginError}>{loginError}</Text>
          ) : null}

          <PrimaryButton
            label={loginPending ? "Logger ind..." : "Login"}
            onPress={submit}
            disabled={loginPending || !email.trim() || !password.trim()}
          />
          <Text style={styles.loginHint}>
            Bruger API login og gemmer JWT til efterfoelgende kald.
          </Text>
        </View>
      </SafeAreaView>
    </Screen>
  );
}

function HomeScreen({
  onNavigate,
  onOpenPark,
  parks,
  searchQuery,
  setSearchQuery,
  favoritesOnly,
  selectedFacilities,
  onOpenFacilitySearch,
  onClearFilters,
}: {
  onNavigate: (route: Route) => void;
  onOpenPark: (parkId: string) => void;
  parks: Park[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  favoritesOnly: boolean;
  selectedFacilities: Facility[];
  onOpenFacilitySearch: () => void;
  onClearFilters: () => void;
}) {
  const {
    focusedParkId,
    setFocusedParkId,
    favorites,
    toggleFavorite,
    loadingParks,
    locationPending,
    currentLocation,
    requestCurrentLocation,
    refreshParks,
    flashToast,
  } = usePlaymaps();
  const focused = parks.find((park) => park.id === focusedParkId) ?? parks[0];
  const nearby = focused
    ? parks.filter((park) => park.id !== focused.id).slice(0, 2)
    : [];
  const hasFilters =
    favoritesOnly ||
    Boolean(searchQuery.trim()) ||
    selectedFacilities.length > 0;

  useEffect(() => {
    if (focused || !parks[0]) {
      return;
    }

    setFocusedParkId(parks[0].id);
  }, [focused, parks, setFocusedParkId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CheckInBanner />
      <View style={styles.topBar}>
        <IconButton icon="menu" onPress={() => onNavigate("menu")} />
        <View style={styles.brandLockup}>
          <Text style={styles.brandWordmark}>FindAPlayground</Text>
          <Text style={styles.subtitle}>
            {loadingParks ? "Henter legepladser..." : "Legepladser tæt på dig"}
          </Text>
        </View>
        <IconButton
          icon="bell-outline"
          onPress={() => flashToast("No alerts")}
        />
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchInputWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color="#6D767C" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for a playground..."
            placeholderTextColor="#8C959A"
            style={styles.searchInput}
          />
        </View>
        <IconButton icon="tune-variant" onPress={onOpenFacilitySearch} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentBody}
        showsVerticalScrollIndicator={false}
      >
        {hasFilters ? (
          <View style={styles.filterSummary}>
            {favoritesOnly ? (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>Favoritter</Text>
              </View>
            ) : null}
            {selectedFacilities.map((facility) => (
              <View key={facility} style={styles.filterChip}>
                <Text style={styles.filterChipText}>{facility}</Text>
              </View>
            ))}
            {searchQuery.trim() ? (
              <View style={styles.filterChipAlt}>
                <Text style={styles.filterChipAltText}>
                  {searchQuery.trim()}
                </Text>
              </View>
            ) : null}
            <Pressable
              onPress={onClearFilters}
              style={styles.clearFiltersButton}
            >
              <Text style={styles.clearFiltersText}>Nulstil</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.mapWrap}>
          <PlaymapsMap
            parks={parks}
            focusedId={focused?.id ?? focusedParkId}
            currentLocation={currentLocation}
            onSelect={(parkId) => {
              if (parks.some((park) => park.id === parkId)) {
                setFocusedParkId(parkId);
              }
            }}
          />
          {focused ? (
            <IconButton
              icon={favorites.includes(focused.id) ? "star" : "star-outline"}
              active={favorites.includes(focused.id)}
              onPress={() => toggleFavorite(focused.id)}
              style={styles.favoriteFloat}
            />
          ) : null}
          <IconButton
            icon={locationPending ? "crosshairs-gps" : "crosshairs"}
            onPress={requestCurrentLocation}
            style={styles.locationFloat}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {parks.length} legepladser matcher dine filtre
          </Text>
          <Pressable
            onPress={() => {
              refreshParks();
              flashToast("Legepladser opdateret");
            }}
          >
            <Text style={styles.actionText}>Opdater</Text>
          </Pressable>
        </View>

        {focused ? (
          <>
            <ParkInfoCard
              park={focused}
              onCopyLink={() => copyMapLink(focused, flashToast)}
              onNavigate={() =>
                openExternalMap(
                  focused.name,
                  focused.latitude,
                  focused.longitude,
                )
              }
              onOpenDetails={() => onOpenPark(focused.id)}
            />
            {nearby.map((park) => (
              <ParkInfoCard
                key={park.id}
                park={park}
                compact
                onCopyLink={() => copyMapLink(park, flashToast)}
                onNavigate={() =>
                  openExternalMap(park.name, park.latitude, park.longitude)
                }
                onOpenDetails={() => onOpenPark(park.id)}
              />
            ))}
          </>
        ) : (
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateTitle}>Ingen legepladser fundet</Text>
            <Text style={styles.emptyStateText}>
              Proev en anden kombination af soegning eller faciliteter.
            </Text>
          </View>
        )}
      </ScrollView>
      <BottomNav active="home" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function DetailsScreen({
  onBack,
  onNavigate,
  onCheckIn,
  onCheckOut,
}: {
  onBack: () => void;
  onNavigate: (route: Route) => void;
  onCheckIn: () => void;
  onCheckOut: () => void;
}) {
  const {
    parks,
    selectedParkId,
    checkedIn,
    favorites,
    toggleFavorite,
    flashToast,
  } = usePlaymaps();
  const park = parks.find((item) => item.id === selectedParkId) ?? parks[0];
  const hasCheckedIn = Boolean(checkedIn[park.id]?.length);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CheckInBanner />
      <View style={styles.detailTopBar}>
        <IconButton icon="chevron-left" onPress={onBack} />
        <IconButton
          icon={favorites.includes(park.id) ? "star" : "star-outline"}
          active={favorites.includes(park.id)}
          onPress={() => toggleFavorite(park.id)}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.detailBody}
        showsVerticalScrollIndicator={false}
      >
        <ParkInfoCard
          park={park}
          onCopyLink={() => copyMapLink(park, flashToast)}
          onNavigate={() =>
            openExternalMap(park.name, park.latitude, park.longitude)
          }
          onOpenDetails={() => undefined}
        />

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Faciliteter</Text>
          <View style={styles.facilityList}>
            {park.facilities.map((facility) => (
              <FacilityRow key={facility} name={facility} />
            ))}
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Kommentarer fra andre brugere</Text>
          {park.comments.length ? (
            park.comments.map((comment) => (
              <Text
                key={`${comment.author}-${comment.text}`}
                style={styles.comment}
              >
                <Text style={styles.commentAuthor}>{comment.author}: </Text>
                {comment.text}
              </Text>
            ))
          ) : (
            <Text style={styles.commentEmpty}>
              Ingen kommentarer fra API endnu.
            </Text>
          )}
        </View>

        <View style={styles.actionStack}>
          <PrimaryButton label="Tjek ind" onPress={onCheckIn} />
          <PrimaryButton
            label="Tjek ud"
            onPress={onCheckOut}
            disabled={!hasCheckedIn}
            danger={hasCheckedIn}
          />
        </View>
      </ScrollView>
      <BottomNav active="home" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function CheckInBanner() {
  const { checkedIn, parks, kids, checkOutKid } = usePlaymaps();
  const activeCheckIn = useMemo(() => {
    const entry = Object.entries(checkedIn).find(([, kidIds]) => kidIds.length);
    if (!entry) {
      return null;
    }

    const [parkId, kidIds] = entry;
    const park = parks.find((item) => item.id === parkId);
    if (!park) {
      return null;
    }

    const checkedKids = kidIds
      .map((kidId) => kids.find((kid) => kid.id === kidId))
      .filter(Boolean);

    return { park, kidIds, checkedKids };
  }, [checkedIn, kids, parks]);
  const [showPrompt, setShowPrompt] = useState(false);

  if (!activeCheckIn) {
    return null;
  }

  const kidSummary =
    activeCheckIn.checkedKids.length === 1
      ? activeCheckIn.checkedKids[0]?.name
      : `${activeCheckIn.checkedKids.length} børn`;

  return (
    <>
      <Pressable
        style={styles.checkInBanner}
        onPress={() => setShowPrompt(true)}
      >
        <View style={styles.checkInBannerIcon}>
          <MaterialCommunityIcons name="account-check" size={18} color="#fff" />
        </View>
        <View style={styles.checkInBannerCopy}>
          <Text style={styles.checkInBannerTitle}>Checket ind</Text>
          <Text style={styles.checkInBannerText} numberOfLines={1}>
            {kidSummary} ved {activeCheckIn.park.name}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color="#5D8D68" />
      </Pressable>

      <Modal transparent visible={showPrompt} animationType="fade">
        <View style={styles.centerModalBackdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowPrompt(false)}
          />
          <View style={styles.centerModal}>
            <Text style={styles.modalTitle}>Tjek ud?</Text>
            <Text style={styles.infoText}>
              Vil du tjekke {kidSummary} ud fra {activeCheckIn.park.name}?
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setShowPrompt(false)}
              >
                <Text style={styles.cancelText}>Bliv her</Text>
              </Pressable>
              <Pressable
                style={styles.dangerButton}
                onPress={() => {
                  activeCheckIn.kidIds.forEach((kidId) =>
                    checkOutKid(activeCheckIn.park.id, kidId),
                  );
                  setShowPrompt(false);
                }}
              >
                <Text style={styles.saveText}>Tjek ud</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function ProfileScreen({
  onNavigate,
  onAddChild,
  onLogout,
}: {
  onNavigate: (route: Route) => void;
  onAddChild: () => void;
  onLogout: () => void;
}) {
  const { kids, favorites, lastCheck, checkedIn, session } = usePlaymaps();
  const isCheckedIn = Object.keys(checkedIn).length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <CheckInBanner />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.profileBody}
      >
        <Text style={styles.title}>Min profil</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(session?.email ?? "E").slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.profileName}>
          {(session?.email ?? "Bruger").split("@")[0]}
        </Text>
        <Text style={styles.profileEmail}>{session?.email ?? ""}</Text>

        <View style={styles.panel}>
          <Text style={styles.profileLine}>
            Sidste indtjekning:{" "}
            <Text style={styles.strong}>{lastCheck ?? "Ingen endnu"}</Text>
          </Text>
          <Text style={styles.profileLine}>
            Status:{" "}
            <Text style={styles.strong}>
              {isCheckedIn ? "Checket ind" : "Ikke checket ind"}
            </Text>
          </Text>
          <Text style={styles.profileLine}>
            Favoritter: <Text style={styles.strong}>{favorites.length}</Text>
          </Text>
          <Text style={styles.panelTitle}>Børn</Text>
          <View style={styles.childGrid}>
            {kids.map((kid) => (
              <ChildCard key={kid.id} kid={kid} onPress={() => undefined} />
            ))}
            <Pressable style={styles.addChildButton} onPress={onAddChild}>
              <MaterialCommunityIcons name="plus" size={28} color="#fff" />
            </Pressable>
          </View>
        </View>

        <MenuRow
          iconName="cog"
          label="Indstillinger"
          onClick={() => undefined}
        />
        <Pressable style={styles.logoutRow} onPress={onLogout}>
          <MaterialCommunityIcons name="logout" size={22} color="#fff" />
          <Text style={styles.logoutText}>Log ud</Text>
        </Pressable>
      </ScrollView>
      <BottomNav active="profile" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function MenuScreen({
  onNavigate,
  onOpenFavorites,
  onOpenAreaSearch,
  onOpenFacilitySearch,
  onOpenInfo,
}: {
  onNavigate: (route: Route) => void;
  onOpenFavorites: () => void;
  onOpenAreaSearch: () => void;
  onOpenFacilitySearch: () => void;
  onOpenInfo: (kind: InfoSheet) => void;
}) {
  const menuItems: [string, string, () => void][] = [
    ["star", "Se Favoritter", onOpenFavorites],
    ["help-circle", "FAQ", () => onOpenInfo("faq")],
    ["magnify", "Søg område", onOpenAreaSearch],
    ["cog", "Indstillinger", () => onOpenInfo("settings")],
    ["advertisements-off", "Reklamefri", () => onOpenInfo("adfree")],
    ["slide", "Søg efter faciliteter", onOpenFacilitySearch],
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <CheckInBanner />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.menuBody}
      >
        <Text style={styles.title}>Menu</Text>
        {menuItems.map(([iconName, label, action]) => (
          <MenuRow
            key={label}
            iconName={iconName}
            label={label}
            onClick={() => {
              action();
              if (
                label !== "FAQ" &&
                label !== "Indstillinger" &&
                label !== "Reklamefri"
              ) {
                onNavigate("home");
              }
            }}
          />
        ))}
      </ScrollView>
      <BottomNav active="menu" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function AreaSearchModal({
  visible,
  value,
  onChange,
  onClose,
  onApply,
}: {
  visible: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onApply: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.centerModalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.centerModal}>
          <Text style={styles.modalTitle}>Soeg omraade</Text>
          <Field
            label="Navn eller omraade"
            value={value}
            onChange={onChange}
            placeholder="f.eks. Oerstedsparken"
          />
          <View style={styles.modalActions}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Annuller</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={onApply}>
              <Text style={styles.saveText}>Vis paa kort</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function FacilitySearchModal({
  visible,
  selectedFacilities,
  onToggle,
  onClose,
  onReset,
  onApply,
}: {
  visible: boolean;
  selectedFacilities: Facility[];
  onToggle: (facility: Facility) => void;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.centerModalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.centerModalLarge}>
          <Text style={styles.modalTitle}>Soeg efter faciliteter</Text>
          <ScrollView
            style={styles.facilityModalScroll}
            contentContainerStyle={styles.facilityModalContent}
            showsVerticalScrollIndicator={false}
          >
            {ALL_FACILITIES.map((facility) => {
              const active = selectedFacilities.includes(facility);
              return (
                <Pressable
                  key={facility}
                  onPress={() => onToggle(facility)}
                  style={[
                    styles.facilityChoice,
                    active && styles.facilityChoiceActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.facilityChoiceText,
                      active && styles.facilityChoiceTextActive,
                    ]}
                  >
                    {facility}
                  </Text>
                  <MaterialCommunityIcons
                    name={active ? "check-circle" : "circle-outline"}
                    size={20}
                    color={active ? "#78B97A" : "#6D767C"}
                  />
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={styles.modalActions}>
            <Pressable style={styles.cancelButton} onPress={onReset}>
              <Text style={styles.cancelText}>Nulstil</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={onApply}>
              <Text style={styles.saveText}>Anvend</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function InfoModal({
  kind,
  onClose,
}: {
  kind: InfoSheet;
  onClose: () => void;
}) {
  if (!kind) {
    return null;
  }

  const copy = {
    faq: {
      title: "FAQ",
      body: "Brug menuen eller soegningen for at filtrere legepladser. Tryk paa en pin paa kortet for detaljer, og brug check ind for hurtigt at markere besoeg.",
    },
    settings: {
      title: "Indstillinger",
      body: "Indstillinger er ikke koblet til backend endnu, men menuen er nu aktiv og klar til flere personlige valg senere.",
    },
    adfree: {
      title: "Reklamefri",
      body: "Denne version viser ingen reklamer lige nu. Hvis I senere vil tilbyde premium, kan vi knytte denne menu til et abonnementsflow.",
    },
  }[kind];

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.centerModalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.centerModal}>
          <Text style={styles.modalTitle}>{copy.title}</Text>
          <Text style={styles.infoText}>{copy.body}</Text>
          <Pressable style={styles.saveButtonFull} onPress={onClose}>
            <Text style={styles.saveText}>Luk</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function AddChildModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { addKid, flashToast } = usePlaymaps();
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");

  const save = () => {
    addKid({ name, birthday, gender });
    flashToast(`${name} tilføjet`);
    setName("");
    setBirthday("");
    setGender("");
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.centerModalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.centerModal}>
          <Text style={styles.modalTitle}>Tilføj barn</Text>
          <Field label="Navn:" value={name} onChange={setName} />
          <Field
            label="Fødselsdag:"
            value={birthday}
            onChange={setBirthday}
            placeholder="DD/MM/AAAA"
          />
          <SelectField
            label="Køn:"
            value={gender}
            onChange={setGender}
            options={["Dreng", "Pige", "Andet"]}
          />
          <View style={styles.modalActions}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Annuller</Text>
            </Pressable>
            <Pressable
              disabled={!name.trim()}
              style={[styles.saveButton, !name.trim() && styles.saveDisabled]}
              onPress={save}
            >
              <Text style={styles.saveText}>Gem</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loginContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 48,
    paddingBottom: 70,
  },
  brandTitle: {
    marginTop: 28,
    textAlign: "center",
    fontSize: 40,
    fontWeight: "900",
    color: "#1f2a18",
  },
  brandSubtitle: {
    marginTop: 8,
    marginBottom: 42,
    textAlign: "center",
    fontSize: 15,
    color: "#3a3526",
  },
  loginFields: {
    gap: 14,
    marginBottom: 28,
  },
  loginInput: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EEF3F6",
    paddingHorizontal: 20,
    textAlign: "center",
    color: "#384248",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E7E1D6",
  },
  loginError: {
    marginBottom: 12,
    textAlign: "center",
    color: "#b42318",
    fontSize: 14,
    fontWeight: "700",
  },
  loginHint: {
    marginTop: 18,
    textAlign: "center",
    color: "rgba(15,26,46,0.68)",
    fontSize: 13,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  brandLockup: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  brandWordmark: {
    fontSize: 18,
    fontWeight: "900",
    color: "#6FA57A",
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "900",
    color: "#1f2a18",
  },
  subtitle: {
    marginTop: 2,
    textAlign: "center",
    fontSize: 13,
    color: "#6D767C",
  },
  checkInBanner: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 10,
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: "#D8E8D4",
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 2,
  },
  checkInBannerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#78B97A",
    marginRight: 10,
  },
  checkInBannerCopy: {
    flex: 1,
    minWidth: 0,
  },
  checkInBannerTitle: {
    color: "#5D8D68",
    fontSize: 12,
    fontWeight: "900",
  },
  checkInBannerText: {
    marginTop: 2,
    color: "#384248",
    fontSize: 14,
    fontWeight: "700",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  searchInputWrap: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: "#E7E1D6",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#384248",
    fontSize: 15,
  },
  content: {
    flex: 1,
  },
  contentBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  filterSummary: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: "#EAF3E8",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  filterChipText: {
    color: "#5D8D68",
    fontSize: 12,
    fontWeight: "700",
  },
  filterChipAlt: {
    backgroundColor: "#EEF3F6",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  filterChipAltText: {
    color: "#384248",
    fontSize: 12,
    fontWeight: "700",
  },
  clearFiltersButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  clearFiltersText: {
    color: "#6D767C",
    fontSize: 12,
    fontWeight: "700",
  },
  mapWrap: {
    position: "relative",
  },
  favoriteFloat: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  locationFloat: {
    position: "absolute",
    right: 12,
    top: 62,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#6D767C",
  },
  actionText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#5D8D68",
  },
  detailTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 8,
  },
  detailBody: {
    paddingHorizontal: 19,
    paddingBottom: 26,
  },
  panel: {
    backgroundColor: "#FFFDF8",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E7E1D6",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#384248",
    marginBottom: 12,
  },
  facilityList: {
    gap: 10,
  },
  comment: {
    fontSize: 14,
    lineHeight: 21,
    color: "#384248",
    marginBottom: 8,
  },
  commentAuthor: {
    fontWeight: "800",
  },
  commentEmpty: {
    fontSize: 14,
    color: "#6D767C",
  },
  actionStack: {
    gap: 12,
    marginTop: 6,
  },
  emptyStateCard: {
    backgroundColor: "#FFFDF8",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E7E1D6",
    alignItems: "center",
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#384248",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6D767C",
    textAlign: "center",
  },
  profileBody: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    alignItems: "stretch",
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#78B97A",
    marginTop: 22,
  },
  avatarText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
  },
  profileName: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: "#384248",
  },
  profileEmail: {
    textAlign: "center",
    fontSize: 13,
    color: "#6D767C",
    marginBottom: 24,
  },
  profileLine: {
    fontSize: 15,
    lineHeight: 24,
    color: "#384248",
  },
  strong: {
    fontWeight: "800",
  },
  childGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  addChildButton: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#78B97A",
    marginTop: 6,
  },
  logoutRow: {
    borderRadius: 14,
    backgroundColor: "#5D8D68",
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    marginLeft: 14,
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
  menuBody: {
    paddingHorizontal: 23,
    paddingBottom: 24,
  },
  sheetList: {
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#6D767C",
    fontSize: 14,
  },
  centerModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  centerModal: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    backgroundColor: "#FFFDF8",
    padding: 22,
    borderWidth: 1,
    borderColor: "#E7E1D6",
  },
  centerModalLarge: {
    width: "100%",
    maxWidth: 360,
    maxHeight: "72%",
    borderRadius: 24,
    backgroundColor: "#FFFDF8",
    padding: 22,
    borderWidth: 1,
    borderColor: "#E7E1D6",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    color: "#384248",
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  facilityModalScroll: {
    maxHeight: 320,
  },
  facilityModalContent: {
    paddingBottom: 8,
  },
  facilityChoice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    backgroundColor: "#F5F1E8",
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 10,
  },
  facilityChoiceActive: {
    backgroundColor: "#EAF3E8",
  },
  facilityChoiceText: {
    color: "#384248",
    fontSize: 15,
    fontWeight: "600",
  },
  facilityChoiceTextActive: {
    color: "#5D8D68",
    fontWeight: "800",
  },
  infoText: {
    color: "#6D767C",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
    textAlign: "center",
  },
  cancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F3EFE6",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontWeight: "800",
    color: "#384248",
  },
  saveButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#78B97A",
    alignItems: "center",
    justifyContent: "center",
  },
  dangerButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#C65E5E",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonFull: {
    height: 46,
    borderRadius: 14,
    backgroundColor: "#78B97A",
    alignItems: "center",
    justifyContent: "center",
  },
  saveDisabled: {
    opacity: 0.45,
  },
  saveText: {
    fontWeight: "900",
    color: "#FFFDF8",
  },
});
