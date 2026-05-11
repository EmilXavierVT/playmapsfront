import { Park } from "../app/constants";

export declare function PlaymapsMapSurface(props: {
  parks: Park[];
  focusedId: string;
  currentLocation?: { latitude: number; longitude: number } | null;
  onSelect: (parkId: string) => void;
}): JSX.Element;
