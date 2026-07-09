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

export type StateCode = "WA" | "OR" | "CA";

export const STATES: { code: StateCode; name: string; blurb: string }[] = [
  {
    code: "WA",
    name: "Washington",
    blurb:
      "Volcanoes, old-growth rainforest and the North Cascades — the wildest corner of the lower 48.",
  },
  {
    code: "OR",
    name: "Oregon",
    blurb:
      "Waterfalls stacked in the Columbia Gorge, a crater lake so blue it looks fake, and quiet Cascade peaks.",
  },
  {
    code: "CA",
    name: "California",
    blurb:
      "From Yosemite granite to the Sierra crest — the heavyweight class of American hiking.",
  },
];

export const HIKE_TYPES: HikeType[] = [
  "Peak",
  "Lake",
  "Waterfall",
  "Ridge",
  "Viewpoint",
  "Valley",
  "Glacier",
];

export const DIFFICULTIES: Difficulty[] = ["Easy", "Moderate", "Hard", "Expert"];

export const kmToMi = (km: number) => Math.round(km * 0.621371 * 10) / 10;
export const mToFt = (m: number) => Math.round(m * 3.28084);

export interface InstagramClip {
  url: string;
  caption?: string;
}

export interface Hike {
  id: string;
  name: string;
  region: string;
  state: StateCode;
  tagline: string;
  difficulty: Difficulty;
  type: HikeType;
  distanceKm: number;
  elevationM: number;
  lat: number;
  lng: number;
  description: string;
  images: string[];
  instagram?: InstagramClip[];
}

export const HIKES: Hike[] = [
  // California
  {
    id: "half-dome",
    name: "Half Dome",
    region: "Yosemite, California",
    state: "CA",
    tagline: "Peak",
    difficulty: "Expert",
    type: "Peak",
    distanceKm: 22.5,
    elevationM: 1460,
    lat: 37.7459,
    lng: -119.5332,
    description:
      "Iconic granite dome ascent with the infamous cable route on the final stretch. Long day, big exposure, unforgettable summit.",
    images: [halfdome1, halfdome2],
  },
  {
    id: "yosemite-falls",
    name: "Upper Yosemite Falls",
    region: "Yosemite, California",
    state: "CA",
    tagline: "Waterfall",
    difficulty: "Hard",
    type: "Waterfall",
    distanceKm: 12.2,
    elevationM: 823,
    lat: 37.756,
    lng: -119.5966,
    description:
      "Switchbacks up the north wall to the brink of the tallest waterfall in North America. Best in late spring when it's roaring.",
    images: [alps2, alps1],
  },
  {
    id: "mist-trail",
    name: "Mist Trail to Nevada Fall",
    region: "Yosemite, California",
    state: "CA",
    tagline: "Waterfall",
    difficulty: "Moderate",
    type: "Waterfall",
    distanceKm: 9.8,
    elevationM: 610,
    lat: 37.7267,
    lng: -119.5432,
    description:
      "Wet granite steps and rainbows in the spray from Vernal and Nevada Falls. Short, iconic, soaking.",
    images: [alps1, halfdome2],
  },
  {
    id: "mount-whitney",
    name: "Mount Whitney",
    region: "Eastern Sierra, California",
    state: "CA",
    tagline: "Peak",
    difficulty: "Expert",
    type: "Peak",
    distanceKm: 35.4,
    elevationM: 1996,
    lat: 36.5785,
    lng: -118.2923,
    description:
      "Highest summit in the lower 48. Ninety-nine switchbacks, thin air, and a permit that's harder to get than the climb.",
    images: [torres1, halfdome1],
  },

  // Oregon
  {
    id: "crater-lake-rim",
    name: "Garfield Peak, Crater Lake",
    region: "Crater Lake NP, Oregon",
    state: "OR",
    tagline: "Viewpoint",
    difficulty: "Moderate",
    type: "Viewpoint",
    distanceKm: 5.3,
    elevationM: 305,
    lat: 42.9111,
    lng: -122.144,
    description:
      "Short push above the rim with the cleanest angle on the deepest, bluest lake in the country.",
    images: [alps1, alps2],
  },
  {
    id: "multnomah-falls",
    name: "Multnomah - Wahkeena Loop",
    region: "Columbia Gorge, Oregon",
    state: "OR",
    tagline: "Waterfall",
    difficulty: "Moderate",
    type: "Waterfall",
    distanceKm: 8.5,
    elevationM: 490,
    lat: 45.5762,
    lng: -122.1158,
    description:
      "A loop stringing together five waterfalls including 620-ft Multnomah. Mossy, misty, close to Portland.",
    images: [alps2, alps1],
  },
  {
    id: "south-sister",
    name: "South Sister Summit",
    region: "Three Sisters, Oregon",
    state: "OR",
    tagline: "Peak",
    difficulty: "Hard",
    type: "Peak",
    distanceKm: 19.3,
    elevationM: 1554,
    lat: 44.1035,
    lng: -121.7692,
    description:
      "Long grind up loose scoria to Oregon's third-highest summit. Crater lake at the top, Cascades in every direction.",
    images: [torres2, halfdome1],
  },
  {
    id: "eagle-creek",
    name: "Eagle Creek to Punchbowl",
    region: "Columbia Gorge, Oregon",
    state: "OR",
    tagline: "Valley",
    difficulty: "Easy",
    type: "Valley",
    distanceKm: 6.4,
    elevationM: 180,
    lat: 45.6371,
    lng: -121.919,
    description:
      "Cliffside trail cut into basalt with cable handrails and a plunge pool waterfall at the turnaround.",
    images: [torres1, alps2],
  },

  // Washington
  {
    id: "skyline-rainier",
    name: "Skyline Trail, Paradise",
    region: "Mt Rainier NP, Washington",
    state: "WA",
    tagline: "Glacier",
    difficulty: "Moderate",
    type: "Glacier",
    distanceKm: 9.3,
    elevationM: 520,
    lat: 46.7867,
    lng: -121.7361,
    description:
      "Wildflower meadows below the Nisqually Glacier with Rainier looming the whole way. The classic Paradise loop.",
    images: [alps1, torres2],
  },
  {
    id: "enchantments",
    name: "The Enchantments Traverse",
    region: "Alpine Lakes, Washington",
    state: "WA",
    tagline: "Lake",
    difficulty: "Expert",
    type: "Lake",
    distanceKm: 29.8,
    elevationM: 1478,
    lat: 47.4808,
    lng: -120.8083,
    description:
      "One-day thru-hike past a chain of granite tarns, mountain goats, and Aasgard Pass. Permit lottery is brutal.",
    images: [alps1, alps2],
  },
  {
    id: "mt-si",
    name: "Mount Si",
    region: "North Bend, Washington",
    state: "WA",
    tagline: "Peak",
    difficulty: "Hard",
    type: "Peak",
    distanceKm: 12.9,
    elevationM: 1067,
    lat: 47.4886,
    lng: -121.7231,
    description:
      "Seattle's stair-master. Steep and relentless to a rock haystack with a view straight down to the valley.",
    images: [halfdome1, torres1],
  },
  {
    id: "chain-lakes",
    name: "Chain Lakes Loop",
    region: "Mt Baker, Washington",
    state: "WA",
    tagline: "Lake",
    difficulty: "Moderate",
    type: "Lake",
    distanceKm: 11.0,
    elevationM: 550,
    lat: 48.847,
    lng: -121.6923,
    description:
      "Four alpine lakes strung under Mt Baker's white flanks. Autumn here turns the blueberry meadows crimson.",
    images: [alps2, alps1],
  },
  {
    id: "hoh-rainforest",
    name: "Hoh River Trail",
    region: "Olympic NP, Washington",
    state: "WA",
    tagline: "Valley",
    difficulty: "Easy",
    type: "Valley",
    distanceKm: 8.0,
    elevationM: 90,
    lat: 47.8606,
    lng: -123.9348,
    description:
      "Flat river walk under moss-hung Sitka spruce in one of the last true temperate rainforests on the continent.",
    images: [torres2, alps1],
  },
];
