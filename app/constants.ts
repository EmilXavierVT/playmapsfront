export type Facility =
  | 'Gynger'
  | 'Rutsjebane'
  | 'Fodboldbane'
  | 'Sandkasse'
  | 'Klatrestativ'
  | 'Vippe'
  | 'Legehus'
  | 'Karrusel'
  | 'Basketball'
  | 'Picnic'
  | 'Belysning'
  | 'Bænke'
  | 'Vandpost'
  | 'Tilgængelighed'
  | 'Førstehjælp'
  | 'Hundegård'
  | 'Toilet';

export type Park = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  x: number;
  y: number;
  km: number;
  count: number;
  facilities: Facility[];
  facilityCount: number;
  comments: {
    author: string;
    text: string;
  }[];
};

export type AuthSession = {
  token: string;
  email: string;
};

export type ApiPlayground = {
  capacity: number | null;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
};

export type ApiFacility = {
  sandbox: boolean;
  slide: boolean;
  climbingWall: boolean;
  seesaw: boolean;
  playHouse: boolean;
  merryGoRound: boolean;
  basketballCourt: boolean;
  soccerField: boolean;
  picnicArea: boolean;
  lighting: boolean;
  benches: boolean;
  drinkingFountain: boolean;
  accessibilityFeatures: boolean;
  firstAidStation: boolean;
  dogPark: boolean;
  miscellaneous: string | null;
  playgroundId: number | null;
  id: number;
  toilet: boolean;
  swings: boolean;
};

export type Kid = {
  id: number;
  name: string;
  birthday?: string;
  gender?: string;
};

export const ALL_FACILITIES: Facility[] = [
  'Gynger',
  'Rutsjebane',
  'Fodboldbane',
  'Sandkasse',
  'Klatrestativ',
  'Vippe',
  'Legehus',
  'Karrusel',
  'Basketball',
  'Picnic',
  'Belysning',
  'Bænke',
  'Vandpost',
  'Tilgængelighed',
  'Førstehjælp',
  'Hundegård',
  'Toilet',
];

export const INITIAL_KIDS: Kid[] = [
  { id: 1, name: 'Michel' },
  { id: 2, name: 'Andrea' },
];

export const PARKS: Park[] = [
  {
    id: 'banana',
    name: 'Banana Park',
    address: 'Bananvej 12',
    latitude: 55.6703,
    longitude: 12.5538,
    x: 32,
    y: 36,
    km: 0.6,
    count: 8,
    facilities: ['Gynger', 'Rutsjebane', 'Fodboldbane'],
    facilityCount: 3,
    comments: [
      { author: 'Niels', text: 'Ny gynge installeret i sidste uge. Meget populær.' },
      { author: 'Mette', text: 'God skygge under træerne om eftermiddagen.' },
    ],
  },
  {
    id: 'lyngby',
    name: 'Lyngby Parken',
    address: 'Park Alle 4',
    latitude: 55.6746,
    longitude: 12.5694,
    x: 64,
    y: 28,
    km: 1.4,
    count: 3,
    facilities: ['Gynger', 'Sandkasse'],
    facilityCount: 2,
    comments: [{ author: 'Rasmus', text: 'Rolig plads med fin sandkasse til mindre børn.' }],
  },
  {
    id: 'eg',
    name: 'Egeparken',
    address: 'Egestien 8',
    latitude: 55.6857,
    longitude: 12.5807,
    x: 22,
    y: 60,
    km: 0.9,
    count: 0,
    facilities: ['Gynger', 'Klatrestativ'],
    facilityCount: 2,
    comments: [{ author: 'Sara', text: 'Klatrestativet er bedst til lidt større børn.' }],
  },
  {
    id: 'aaby',
    name: 'Aaby Plads',
    address: 'Aaby Torv 2',
    latitude: 55.6825,
    longitude: 12.5666,
    x: 78,
    y: 58,
    km: 2.1,
    count: 5,
    facilities: ['Rutsjebane', 'Fodboldbane'],
    facilityCount: 2,
    comments: [{ author: 'Jonas', text: 'Fodboldbanen er lille, men fungerer fint.' }],
  },
  {
    id: 'soby',
    name: 'Soby Have',
    address: 'Havevej 19',
    latitude: 55.6806,
    longitude: 12.5648,
    x: 50,
    y: 72,
    km: 1.1,
    count: 2,
    facilities: ['Gynger', 'Sandkasse', 'Klatrestativ'],
    facilityCount: 3,
    comments: [{ author: 'Line', text: 'Hyggelig haveplads med god plads til picnic.' }],
  },
  {
    id: 'nord',
    name: 'Nordskoven',
    address: 'Skovkanten 3',
    latitude: 55.6903,
    longitude: 12.5786,
    x: 14,
    y: 22,
    km: 3.4,
    count: 1,
    facilities: ['Klatrestativ'],
    facilityCount: 1,
    comments: [{ author: 'Ali', text: 'Meget naturpræget legeplads tæt på stierne.' }],
  },
  {
    id: 'kirke',
    name: 'Kirkeengen',
    address: 'Engvej 6',
    latitude: 55.6788,
    longitude: 12.5821,
    x: 86,
    y: 40,
    km: 2.7,
    count: 4,
    facilities: ['Gynger', 'Rutsjebane'],
    facilityCount: 2,
    comments: [{ author: 'Emma', text: 'Nem at finde og god til en hurtig pause.' }],
  },
];

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_PLAYMAPS_API_URL ?? 'https://findenlegeplads.team-ice.dk/api';

export const DEFAULT_LOGIN_EMAIL = 'admin@test.com';
export const DEFAULT_LOGIN_PASSWORD = '1234';
