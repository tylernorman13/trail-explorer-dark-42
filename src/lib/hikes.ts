import halfdome1 from "@/assets/halfdome-1.jpg";
import halfdome2 from "@/assets/halfdome-2.jpg";
import angels1 from "@/assets/angels-1.jpg";
import angels2 from "@/assets/angels-2.jpg";
import alps1 from "@/assets/alps-1.jpg";
import alps2 from "@/assets/alps-2.jpg";
import torres1 from "@/assets/torres-1.jpg";
import torres2 from "@/assets/torres-2.jpg";

export type Difficulty = "Easy" | "Moderate" | "Hard" | "Expert";
export type HikeType =
  | "Lake"
  | "Glacier"
  | "Waterfall"
  | "Peak"
  | "Ridge"
  | "Valley"
  | "Viewpoint";

export const HIKE_TYPES: HikeType[] = [
  "Lake",
  "Glacier",
  "Waterfall",
  "Peak",
  "Ridge",
  "Valley",
  "Viewpoint",
];

export const DIFFICULTIES: Difficulty[] = ["Easy", "Moderate", "Hard", "Expert"];

export interface Hike {
  id: string;
  name: string;
  region: string;
  tagline: string;
  difficulty: Difficulty;
  type: HikeType;
  distanceKm: number;
  elevationM: number;
  lat: number;
  lng: number;
  description: string;
  images: string[];
}

export const HIKES: Hike[] = [
  {
    id: "half-dome",
    name: "Half Dome",
    region: "Yosemite, California",
    tagline: "Cables, granite, and the summit of a legend",
    difficulty: "Expert",
    distanceKm: 22.5,
    elevationM: 1460,
    lat: 37.7459,
    lng: -119.5332,
    description:
      "Iconic granite dome ascent with the infamous cable route on the final stretch. Long day, big exposure, unforgettable summit.",
    images: [halfdome1, halfdome2],
  },
  {
    id: "angels-landing",
    name: "Angels Landing",
    region: "Zion, Utah",
    tagline: "A knife-edge ridge above the red canyon",
    difficulty: "Hard",
    distanceKm: 8.7,
    elevationM: 453,
    lat: 37.2694,
    lng: -112.9481,
    description:
      "A knife-edge ridge above Zion Canyon with chain-assisted scrambling. Dizzying drops and a payoff view over the red walls.",
    images: [angels1, angels2],
  },
  {
    id: "swiss-alps",
    name: "Oeschinensee Loop",
    region: "Bernese Alps, Switzerland",
    tagline: "Turquoise alpine lake under 3000m peaks",
    difficulty: "Moderate",
    distanceKm: 12.0,
    elevationM: 620,
    lat: 46.4986,
    lng: 7.7286,
    description:
      "Turquoise alpine lake framed by 3000m peaks. Meadows, mist, and cowbells — classic Swiss high country.",
    images: [alps1, alps2],
  },
  {
    id: "torres-del-paine",
    name: "Base Torres",
    region: "Patagonia, Chile",
    tagline: "The signature trek to the three granite towers",
    difficulty: "Hard",
    distanceKm: 19.0,
    elevationM: 750,
    lat: -50.9423,
    lng: -72.9853,
    description:
      "Wind, glacial rubble, and a mirrored lagoon at the finish, with the three granite towers standing over it all.",
    images: [torres1, torres2],
  },
];
