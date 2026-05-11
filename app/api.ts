import {
  API_BASE_URL,
  ApiFacility,
  ApiPlayground,
  AuthSession,
  Facility,
  Park,
} from './constants';

const FACILITY_LABELS: [keyof ApiFacility, Facility][] = [
  ['swings', 'Gynger'],
  ['slide', 'Rutsjebane'],
  ['soccerField', 'Fodboldbane'],
  ['sandbox', 'Sandkasse'],
  ['climbingWall', 'Klatrestativ'],
  ['seesaw', 'Vippe'],
  ['playHouse', 'Legehus'],
  ['merryGoRound', 'Karrusel'],
  ['basketballCourt', 'Basketball'],
  ['picnicArea', 'Picnic'],
  ['lighting', 'Belysning'],
  ['benches', 'Bænke'],
  ['drinkingFountain', 'Vandpost'],
  ['accessibilityFeatures', 'Tilgængelighed'],
  ['firstAidStation', 'Førstehjælp'],
  ['dogPark', 'Hundegård'],
  ['toilet', 'Toilet'],
];

function authHeaders(token?: string): Record<string, string> {
  if (!token) {
    return {};
  }

  return { Authorization: `Bearer ${token}` };
}

async function apiRequest<T>(path: string, options?: RequestInit, token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeaders(token),
    ...(options?.headers as Record<string, string> | undefined),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `API request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function login(email: string, password: string) {
  return apiRequest<AuthSession>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  );
}

async function getPlaygrounds(token?: string) {
  return apiRequest<ApiPlayground[]>('/playgrounds/', undefined, token);
}

async function getFacility(playgroundId: number, token?: string) {
  return apiRequest<ApiFacility>(`/playgrounds/${playgroundId}/facility`, undefined, token);
}

async function getCheckins(playgroundId: number, token?: string) {
  return apiRequest<unknown[]>(`/playgrounds/${playgroundId}/checkins`, undefined, token);
}

function normalizeCoordinate(value: number, min: number, max: number, start: number, span: number) {
  if (min === max) {
    return start + span / 2;
  }

  const normalized = (value - min) / (max - min);
  return Math.round((start + normalized * span) * 10) / 10;
}

function distanceFromCenter(latitude: number, longitude: number, centerLat: number, centerLon: number) {
  const kilometersPerLatDegree = 111.32;
  const kilometersPerLonDegree = 111.32 * Math.cos((latitude * Math.PI) / 180);
  const latKm = Math.abs(latitude - centerLat) * kilometersPerLatDegree;
  const lonKm = Math.abs(longitude - centerLon) * kilometersPerLonDegree;

  return Math.round(Math.sqrt(latKm ** 2 + lonKm ** 2) * 10) / 10;
}

function mapFacilities(facility: ApiFacility) {
  return FACILITY_LABELS.filter(([key]) => facility[key] === true).map(([, label]) => label);
}

export async function fetchParks(token?: string) {
  const playgrounds = await getPlaygrounds(token);
  const latitudes = playgrounds.map((park) => park.latitude);
  const longitudes = playgrounds.map((park) => park.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);
  const centerLat = latitudes.reduce((sum, value) => sum + value, 0) / latitudes.length;
  const centerLon = longitudes.reduce((sum, value) => sum + value, 0) / longitudes.length;

  const details = await Promise.all(
    playgrounds.map(async (playground) => {
      const [facility, checkins] = await Promise.all([
        getFacility(playground.id, token),
        getCheckins(playground.id, token),
      ]);

      const facilities = mapFacilities(facility);

      const park: Park = {
        id: String(playground.id),
        name: playground.name,
        address: `${playground.latitude.toFixed(4)}, ${playground.longitude.toFixed(4)}`,
        latitude: playground.latitude,
        longitude: playground.longitude,
        x: normalizeCoordinate(playground.longitude, minLon, maxLon, 14, 72),
        y: normalizeCoordinate(playground.latitude, maxLat, minLat, 18, 56),
        km: distanceFromCenter(playground.latitude, playground.longitude, centerLat, centerLon),
        count: checkins.length,
        facilities,
        facilityCount: facilities.length,
        comments: facility.miscellaneous
          ? [{ author: 'API note', text: facility.miscellaneous }]
          : [],
      };

      return park;
    }),
  );

  return details;
}
