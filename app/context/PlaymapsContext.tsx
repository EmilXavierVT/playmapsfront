import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as Location from "expo-location";
import { fetchParks, login as loginRequest } from "../api";
import { Toast } from "../components/PlaymapsUI";
import {
  AuthSession,
  DEFAULT_LOGIN_EMAIL,
  DEFAULT_LOGIN_PASSWORD,
  INITIAL_KIDS,
  PARKS,
  Park,
  Kid,
} from "../constants";

type CheckedIn = Record<string, number[]>;
type ClientLocation = {
  latitude: number;
  longitude: number;
};

type PlaymapsContextType = {
  session: AuthSession | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginPending: boolean;
  loginError: string | null;
  defaultEmail: string;
  defaultPassword: string;
  currentLocation: ClientLocation | null;
  locationPending: boolean;
  requestCurrentLocation: () => Promise<void>;
  parks: Park[];
  loadingParks: boolean;
  refreshParks: () => Promise<void>;
  favorites: string[];
  toggleFavorite: (parkId: string) => void;
  focusedParkId: string;
  setFocusedParkId: (parkId: string) => void;
  selectedParkId: string;
  setSelectedParkId: (parkId: string) => void;
  kids: Kid[];
  addKid: (kid: Omit<Kid, "id">) => void;
  checkedIn: CheckedIn;
  checkInKid: (parkId: string, kidId: number) => void;
  checkOutKid: (parkId: string, kidId: number) => void;
  lastCheck: string | null;
  flashToast: (message: string) => void;
  toast: string | null;
};

const PlaymapsContext = createContext<PlaymapsContextType | undefined>(
  undefined,
);

function nextKidId(kids: Kid[]) {
  return kids.reduce((max, kid) => Math.max(max, kid.id), 0) + 1;
}

function distanceBetween(
  first: ClientLocation,
  second: { latitude: number; longitude: number },
) {
  const kilometersPerLatDegree = 111.32;
  const kilometersPerLonDegree =
    111.32 * Math.cos((first.latitude * Math.PI) / 180);
  const latKm =
    Math.abs(first.latitude - second.latitude) * kilometersPerLatDegree;
  const lonKm =
    Math.abs(first.longitude - second.longitude) * kilometersPerLonDegree;

  return Math.sqrt(latKm ** 2 + lonKm ** 2);
}

export function PlaymapsProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loginPending, setLoginPending] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<ClientLocation | null>(
    null,
  );
  const [locationPending, setLocationPending] = useState(false);
  const [parks, setParks] = useState<Park[]>(PARKS);
  const [loadingParks, setLoadingParks] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(["banana"]);
  const [focusedParkId, setFocusedParkId] = useState<string>("banana");
  const [selectedParkId, setSelectedParkId] = useState<string>("banana");
  const [kids, setKids] = useState<Kid[]>(INITIAL_KIDS);
  const [checkedIn, setCheckedIn] = useState<CheckedIn>({});
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flashToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1800);
  }, []);

  const refreshParks = useCallback(async () => {
    setLoadingParks(true);
    try {
      const data = await fetchParks(session?.token);
      setParks(data.length ? data : PARKS);
    } catch {
      setParks(PARKS);
      flashToast("Kunne ikke hente legepladser. Viser demo-data.");
    } finally {
      setLoadingParks(false);
    }
  }, [flashToast, session?.token]);

  const requestCurrentLocation = useCallback(async () => {
    setLocationPending(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        flashToast("Lokation blev ikke givet");
        return;
      }

      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const nextLocation = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      };

      setCurrentLocation(nextLocation);

      if (parks.length) {
        const nearestPark = parks.reduce((nearest, park) => {
          if (!nearest) {
            return park;
          }

          return distanceBetween(nextLocation, park) <
            distanceBetween(nextLocation, nearest)
            ? park
            : nearest;
        }, parks[0]);

        setFocusedParkId(nearestPark.id);
      }
    } catch {
      flashToast("Kunne ikke hente din lokation");
    } finally {
      setLocationPending(false);
    }
  }, [flashToast, parks]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoginPending(true);
      setLoginError(null);
      try {
        const nextSession = await loginRequest(email, password);
        setSession(nextSession);
        flashToast(`Logget ind som ${nextSession.email}`);
        setTimeout(() => {
          requestCurrentLocation();
        }, 0);
      } catch {
        setLoginError("Login mislykkedes. Tjek email og kodeord.");
        throw new Error("Login failed");
      } finally {
        setLoginPending(false);
      }
    },
    [flashToast, requestCurrentLocation],
  );

  const logout = useCallback(() => {
    setSession(null);
    setLoginError(null);
    setCurrentLocation(null);
    setParks(PARKS);
    flashToast("Du er logget ud");
  }, [flashToast]);

  useEffect(() => {
    if (session) {
      refreshParks();
    }
  }, [refreshParks, session]);

  useEffect(() => {
    if (!currentLocation || !parks.length) {
      return;
    }

    const nearestPark = parks.reduce((nearest, park) =>
      distanceBetween(currentLocation, park) <
      distanceBetween(currentLocation, nearest)
        ? park
        : nearest,
    );

    setFocusedParkId(nearestPark.id);
  }, [currentLocation, parks]);

  const toggleFavorite = (parkId: string) => {
    setFavorites((current) =>
      current.includes(parkId)
        ? current.filter((id) => id !== parkId)
        : [...current, parkId],
    );
  };

  const addKid = (kid: Omit<Kid, "id">) => {
    setKids((current) => [...current, { id: nextKidId(current), ...kid }]);
  };

  const checkInKid = (parkId: string, kidId: number) => {
    setCheckedIn((current) => {
      const existing = current[parkId] ?? [];
      if (existing.includes(kidId)) {
        return current;
      }
      return { ...current, [parkId]: [...existing, kidId] };
    });
    const park = parks.find((item) => item.id === parkId);
    if (park) {
      setLastCheck(`${park.name} · i dag`);
      flashToast(`Barnet er tjekket ind på ${park.name}`);
    }
  };

  const checkOutKid = (parkId: string, kidId: number) => {
    setCheckedIn((current) => {
      const existing = current[parkId] ?? [];
      const next = existing.filter((id) => id !== kidId);
      const nextState = { ...current, [parkId]: next };
      if (next.length === 0) {
        delete nextState[parkId];
      }
      return nextState;
    });
    const kid = kids.find((item) => item.id === kidId);
    if (kid) {
      flashToast(`${kid.name} er tjekket ud`);
    }
  };

  const value = {
    parks,
    session,
    login,
    logout,
    loginPending,
    loginError,
    defaultEmail: DEFAULT_LOGIN_EMAIL,
    defaultPassword: DEFAULT_LOGIN_PASSWORD,
    currentLocation,
    locationPending,
    requestCurrentLocation,
    loadingParks,
    refreshParks,
    favorites,
    toggleFavorite,
    focusedParkId,
    setFocusedParkId,
    selectedParkId,
    setSelectedParkId,
    kids,
    addKid,
    checkedIn,
    checkInKid,
    checkOutKid,
    lastCheck,
    flashToast,
    toast,
  };

  return (
    <PlaymapsContext.Provider value={value}>
      {children}
      {toast ? <Toast message={toast} /> : null}
    </PlaymapsContext.Provider>
  );
}

export function usePlaymaps() {
  const context = useContext(PlaymapsContext);
  if (!context) {
    throw new Error("usePlaymaps must be used within a PlaymapsProvider");
  }
  return context;
}
