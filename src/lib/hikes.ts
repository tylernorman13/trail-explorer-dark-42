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
  alltrailsUrl?: string;

  access?: string;
  bestLight?: "Sunrise" | "Golden Hour" | "Midday" | "Sunset" | "Blue Hour" | "Night";
  notes?: string;
  photoTip?: string;
  viral?: boolean;
}


export const HIKES: Hike[] = [
  // Oregon
  {
    id: "multnomah-falls",
    name: "Multnomah Falls",
    region: "Columbia Gorge, Oregon",
    state: "OR",
    tagline: "Waterfall",
    difficulty: "Easy",
    type: "Waterfall",
    distanceKm: 0.6,
    elevationM: 30,
    lat: 45.5762,
    lng: -122.1158,
    description:
      "Easiest waterfall stop in Oregon — paved path to the bridge viewpoint below the 620-ft double drop.",
    images: [alps2, alps1],
    access:
      "Timed-entry permit required in summer ($2, recreation.gov) for the I-84 lot.",
    notes: "Permit rules change — confirm on recreation.gov before you drive out.",
  },
  {
    id: "trillium-lake",
    name: "Trillium Lake",
    region: "Mt Hood, Oregon",
    state: "OR",
    tagline: "Lake",
    difficulty: "Easy",
    type: "Lake",
    distanceKm: 3.2,
    elevationM: 20,
    lat: 45.2717,
    lng: -121.7361,
    description:
      "Small alpine lake with a picture-perfect reflection of Mt Hood. Flat loop around the shoreline.",
    images: [alps1, alps2],
    access: "Day-use parking at the lake — NW Forest Pass or ~$10 day fee.",
    photoTip:
      "Mt Hood reflection shot — calm mornings, shoot from the south end / dock.",
    bestLight: "Sunrise",
    instagram: [{ url: "https://www.instagram.com/p/DW4DbsXDr6t/" }],
  },
  {
    id: "crater-lake-rim",
    name: "Crater Lake Rim Drive",
    region: "Crater Lake NP, Oregon",
    state: "OR",
    tagline: "Viewpoint",
    difficulty: "Easy",
    type: "Viewpoint",
    distanceKm: 53,
    elevationM: 300,
    lat: 42.9446,
    lng: -122.109,
    description:
      "The deepest, bluest lake in the country from the rim road. A driving loop with pull-off viewpoints, not a hike.",
    images: [alps1, alps2],
    access: "$35 NPS entry — Rim Drive fully open roughly July–October only.",
    photoTip:
      "Drive Rim Drive clockwise; Cloudcap Overlook is the high point, Wizard Island anchors the shot.",
    instagram: [{ url: "https://www.instagram.com/reel/DX-KAPgyASc/" }],
  },
  {
    id: "boardman-secret-beach",
    name: "Secret Beach & Natural Bridges",
    region: "Oregon Coast — Samuel H. Boardman",
    state: "OR",
    tagline: "Viewpoint",
    difficulty: "Easy",
    type: "Viewpoint",
    distanceKm: 1.6,
    elevationM: 60,
    lat: 42.1097,
    lng: -124.3577,
    description:
      "Two roadside stops on the Samuel H. Boardman corridor. Natural Bridges is a 2-min walk from the pull-off; Secret Beach is a short, steep trail down to sea stacks and coves.",
    images: [torres1, alps2],
    access: "Free roadside pull-offs on Hwy 101, Samuel H. Boardman corridor.",
    photoTip: "Midday sun angle lights the water blue at Natural Bridges.",
    bestLight: "Midday",
    instagram: [{ url: "https://www.instagram.com/p/DYAtKyxSWLV/" }],
  },
  {
    id: "toketee-falls",
    name: "Toketee Falls",
    region: "North Umpqua, Oregon",
    state: "OR",
    tagline: "Waterfall",
    difficulty: "Easy",
    type: "Waterfall",
    distanceKm: 1.3,
    elevationM: 30,
    lat: 43.2647,
    lng: -122.4361,
    description:
      "Two-tier waterfall over columnar basalt — one of the most photogenic falls in Oregon. Easy 0.8mi round trip to the viewing platform.",
    images: [alps2, alps1],
    access: "Free trailhead lot off Hwy 138.",
    instagram: [{ url: "https://www.instagram.com/p/DY2zZiTOdvE/" }],
  },
  {
    id: "sahalie-koosah",
    name: "Sahalie Falls & Koosah Falls",
    region: "McKenzie River, Oregon",
    state: "OR",
    tagline: "Waterfall",
    difficulty: "Easy",
    type: "Waterfall",
    distanceKm: 4.2,
    elevationM: 60,
    lat: 44.3486,
    lng: -121.9989,
    description:
      "Two thundering McKenzie River waterfalls back to back. Drive-up, or walk the ~2.6mi loop that connects them.",
    images: [alps1, alps2],
    access:
      "Free lots at both falls off Hwy 126 — or walk the ~2.6mi loop connecting them.",
    photoTip: "Midday clear sky = rainbow in the Koosah mist.",
    bestLight: "Midday",
    instagram: [{ url: "https://www.instagram.com/p/DX2F913JS-m/" }],
  },
  {
    id: "black-butte",
    name: "Black Butte",
    region: "Central Cascades, Oregon",
    state: "OR",
    tagline: "Peak",
    difficulty: "Moderate",
    type: "Peak",
    distanceKm: 6.4,
    elevationM: 490,
    lat: 44.4053,
    lng: -121.6353,
    description:
      "~4mi round trip, steady climb to the summit lookout — sunset view straight across the Cascade peaks.",
    images: [torres1, halfdome1],
    access:
      "Forest road to the upper trailhead — rough gravel, high clearance helps.",
    bestLight: "Sunset",
    instagram: [{ url: "https://www.instagram.com/reel/DX7l0nuyGV3/" }],
  },

  // Washington
  {
    id: "panther-creek-falls",
    name: "Panther Creek Falls",
    region: "Gifford Pinchot NF, Washington",
    state: "WA",
    tagline: "Waterfall",
    difficulty: "Easy",
    type: "Waterfall",
    distanceKm: 0.5,
    elevationM: 30,
    lat: 45.8656,
    lng: -121.8236,
    description:
      "Tiered curtain waterfall hidden in mossy old growth. Very short walk from the road to the viewing platform.",
    images: [alps2, torres1],
    access: "Roadside parking on FR-65, short walk to the platform.",
    notes: "Getting popular — go early.",
    instagram: [{ url: "https://www.instagram.com/p/DYnOHpqOiSm/" }],
  },
  {
    id: "mt-st-helens",
    name: "Mt St Helens — Johnston Ridge",
    region: "Mt St Helens NVM, Washington",
    state: "WA",
    tagline: "Viewpoint",
    difficulty: "Easy",
    type: "Viewpoint",
    distanceKm: 1,
    elevationM: 30,
    lat: 46.2745,
    lng: -122.2158,
    description:
      "Blast-zone panorama straight into the crater from Johnston Ridge — the front-row seat on the 1980 eruption.",
    images: [torres2, alps1],
    access:
      "Johnston Ridge / Hwy 504 side — check road status, sections have had closures.",
    instagram: [{ url: "https://www.instagram.com/p/DXmwqvuj0Ng/" }],
  },
  {
    id: "dog-mountain",
    name: "Dog Mountain",
    region: "Columbia Gorge, Washington",
    state: "WA",
    tagline: "Peak",
    difficulty: "Hard",
    type: "Peak",
    distanceKm: 10.8,
    elevationM: 850,
    lat: 45.6997,
    lng: -121.7092,
    description:
      "Steep ~6–7mi round trip up to wildflower meadows over the Gorge. Honest note: view needs clear weather to be worth it.",
    images: [halfdome1, torres1],
    access:
      "Permit required on spring weekends (wildflower season), NW Forest Pass.",
    notes: "TikTok clip: https://www.tiktok.com/@peaktyler/video/7642065938262658318",
  },
  {
    id: "camp-muir",
    name: "Camp Muir",
    region: "Mt Rainier NP, Washington",
    state: "WA",
    tagline: "Glacier",
    difficulty: "Expert",
    type: "Glacier",
    distanceKm: 14.5,
    elevationM: 1432,
    lat: 46.8358,
    lng: -121.7311,
    description:
      "Very hard: ~9mi round trip, 4,700ft gain, snowfield travel above Pebble Creek — conditions-dependent.",
    images: [alps1, torres2],
    access:
      "Park at Paradise — $30 NPS entry; timed reservations in peak summer.",
    instagram: [{ url: "https://www.instagram.com/p/DYfiJFShFk8/" }],
  },
  {
    id: "mcclellan-falls",
    name: "McClellan Falls",
    region: "Washington Cascades",
    state: "WA",
    tagline: "Waterfall",
    difficulty: "Moderate",
    type: "Waterfall",
    distanceKm: 3,
    elevationM: 120,
    lat: 46.5,
    lng: -121.5,
    description:
      "Off-the-radar Cascade waterfall — obscure enough that first-hand beta is the whole point.",
    images: [alps2, alps1],
    notes: "Beta needed — add trailhead, access and route details before publishing.",
    instagram: [{ url: "https://www.instagram.com/p/DXez5kwjrNU/" }],
  },
  {
    id: "falls-creek-falls",
    name: "Falls Creek Falls",
    region: "Gifford Pinchot NF, Washington",
    state: "WA",
    tagline: "Waterfall",
    difficulty: "Moderate",
    type: "Waterfall",
    distanceKm: 5.5,
    elevationM: 220,
    lat: 45.9083,
    lng: -121.9436,
    description:
      "Moderate ~3.4mi round trip through mossy forest to a three-tier waterfall in a rock amphitheater.",
    images: [alps1, torres2],
    access: "Free trailhead lot, gravel forest road in.",
    instagram: [{ url: "https://www.instagram.com/reel/DYDfkYKhheP/" }],
  },

  // California
  {
    id: "fern-canyon",
    name: "Fern Canyon",
    region: "Prairie Creek Redwoods, California",
    state: "CA",
    tagline: "Valley",
    difficulty: "Easy",
    type: "Valley",
    distanceKm: 1.6,
    elevationM: 30,
    lat: 41.4003,
    lng: -124.0653,
    description:
      "Walk the canyon floor between 50-ft fern walls — the primeval slot in the redwoods.",
    images: [alps2, torres1],
    access:
      "Summer permit required (free but limited, recreation.gov) + day-use fee; rough road in, creek crossings.",
  },
  {
    id: "tunnel-view",
    name: "Tunnel View",
    region: "Yosemite NP, California",
    state: "CA",
    tagline: "Viewpoint",
    difficulty: "Easy",
    type: "Viewpoint",
    distanceKm: 0.1,
    elevationM: 0,
    lat: 37.7156,
    lng: -119.6771,
    description:
      "Roadside lot at the Wawona Tunnel exit — the classic Yosemite Valley panorama with El Capitan, Bridalveil and Half Dome. Best at sunrise or storm-clearing light.",
    images: [halfdome1, halfdome2],
    access:
      "Yosemite: $35 entry; timed reservations on peak days.",
    bestLight: "Sunrise",
  },
  {
    id: "mist-trail",
    name: "Mist Trail — Vernal Falls",
    region: "Yosemite NP, California",
    state: "CA",
    tagline: "Waterfall",
    difficulty: "Moderate",
    type: "Waterfall",
    distanceKm: 4.8,
    elevationM: 300,
    lat: 37.7267,
    lng: -119.5432,
    description:
      "Steep ~3mi round trip to the top of Vernal — you will get soaked in spring flow, rainbow in the mist.",
    images: [alps1, halfdome2],
    access: "Park at Happy Isles / valley shuttle.",
    instagram: [{ url: "https://www.instagram.com/p/DYM2jdMu84O/" }],
  },
  {
    id: "upper-yosemite-falls",
    name: "Upper Yosemite Falls Trail",
    region: "Yosemite NP, California",
    state: "CA",
    tagline: "Waterfall",
    difficulty: "Hard",
    type: "Waterfall",
    distanceKm: 12.2,
    elevationM: 823,
    lat: 37.756,
    lng: -119.5966,
    description:
      "Hard ~7.6mi round trip, 2,700ft of switchbacks up the north wall to the brink of North America's tallest waterfall.",
    images: [alps2, alps1],
    access: "Camp 4 area parking — fills very early.",
    instagram: [{ url: "https://www.instagram.com/reel/DYQyA1qO2tG/" }],
  },
  {
    id: "kings-canyon-mist-zumwalt",
    name: "Mist Falls & Zumwalt Meadows",
    region: "Kings Canyon NP, California",
    state: "CA",
    tagline: "Waterfall",
    difficulty: "Moderate",
    type: "Waterfall",
    distanceKm: 12.9,
    elevationM: 245,
    lat: 36.7947,
    lng: -118.5828,
    description:
      "Mist Falls ~8mi round trip, gentle river-canyon walk; Zumwalt Meadow easy 1.5mi loop under Kings Canyon's walls.",
    images: [torres2, alps1],
    access:
      "$35 entry; road to Roads End is seasonal (roughly late spring–fall).",
    instagram: [{ url: "https://www.instagram.com/reel/DYJHFSfOPY5/" }],
  },
  {
    id: "yosemite-falls-vantage",
    name: "Yosemite Falls Vantage Point",
    region: "Yosemite NP, California",
    state: "CA",
    tagline: "Viewpoint",
    difficulty: "Easy",
    type: "Viewpoint",
    distanceKm: 0.5,
    elevationM: 10,
    lat: 37.7419,
    lng: -119.5936,
    description:
      "Ground-level vantage on Yosemite Falls from the valley floor — the frame that gets the full upper + lower drop in one shot.",
    images: [alps1, halfdome1],
    notes:
      "Vantage TBD — decide whether to publish exact spot (Swinging Bridge / Cook's Meadow, or off-trail).",
    instagram: [{ url: "https://www.instagram.com/reel/DYLVLMyPPA_/" }],
  },
];
