export const ramenCategories = [
  "Shoyu",
  "Tonkotsu",
  "Miso",
  "Tsukemen",
] as const;

export type RamenCategory = (typeof ramenCategories)[number];

export type RamenPlace = {
  id: string;
  name: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
  category: RamenCategory;
  shortNote: string;
  priceLevel: "$" | "$$" | "$$$";
  recommendedDish: string;
};

export const tokyoRamenPlaces: RamenPlace[] = [
  {
    id: "yotsuya-shoyu-lab",
    name: "Yotsuya Shoyu Lab",
    area: "Yotsuya",
    address: "3 Yotsuya, Shinjuku City, Tokyo",
    latitude: 35.6865,
    longitude: 139.7295,
    category: "Shoyu",
    shortNote: "A focused counter-style stop with a clear soy-based broth profile.",
    priceLevel: "$$",
    recommendedDish: "Classic shoyu ramen",
  },
  {
    id: "nakano-tonkotsu-works",
    name: "Nakano Tonkotsu Works",
    area: "Nakano",
    address: "5 Nakano, Nakano City, Tokyo",
    latitude: 35.7058,
    longitude: 139.6658,
    category: "Tonkotsu",
    shortNote: "Rich pork broth with a compact menu and late-evening atmosphere.",
    priceLevel: "$$",
    recommendedDish: "Tonkotsu ramen with egg",
  },
  {
    id: "meguro-miso-kitchen",
    name: "Meguro Miso Kitchen",
    area: "Meguro",
    address: "1 Shimomeguro, Meguro City, Tokyo",
    latitude: 35.634,
    longitude: 139.7158,
    category: "Miso",
    shortNote: "A warming bowl built around toasted miso and seasonal vegetables.",
    priceLevel: "$$",
    recommendedDish: "Spicy miso ramen",
  },
  {
    id: "kanda-tsukemen-stand",
    name: "Kanda Tsukemen Stand",
    area: "Kanda",
    address: "2 Kanda Sudacho, Chiyoda City, Tokyo",
    latitude: 35.6918,
    longitude: 139.7709,
    category: "Tsukemen",
    shortNote: "Thick noodles and a concentrated dipping broth near Kanda Station.",
    priceLevel: "$",
    recommendedDish: "House tsukemen",
  },
  {
    id: "asakusa-shoyu-counter",
    name: "Asakusa Shoyu Counter",
    area: "Asakusa",
    address: "2 Asakusa, Taito City, Tokyo",
    latitude: 35.7136,
    longitude: 139.7967,
    category: "Shoyu",
    shortNote: "A lighter bowl that fits easily into an Asakusa walking route.",
    priceLevel: "$",
    recommendedDish: "Chicken shoyu ramen",
  },
  {
    id: "ikebukuro-tonkotsu-room",
    name: "Ikebukuro Tonkotsu Room",
    area: "Ikebukuro",
    address: "1 Nishiikebukuro, Toshima City, Tokyo",
    latitude: 35.7295,
    longitude: 139.7109,
    category: "Tonkotsu",
    shortNote: "Creamy broth, firm noodles, and a quick station-side service style.",
    priceLevel: "$$",
    recommendedDish: "Black garlic tonkotsu",
  },
  {
    id: "koenji-miso-club",
    name: "Koenji Miso Club",
    area: "Koenji",
    address: "4 Koenjikita, Suginami City, Tokyo",
    latitude: 35.7049,
    longitude: 139.6499,
    category: "Miso",
    shortNote: "Bold Hokkaido-style miso flavors in a casual neighborhood setting.",
    priceLevel: "$$",
    recommendedDish: "Butter corn miso ramen",
  },
  {
    id: "ebisu-dipping-noodles",
    name: "Ebisu Dipping Noodles",
    area: "Ebisu",
    address: "1 Ebisu Minami, Shibuya City, Tokyo",
    latitude: 35.6467,
    longitude: 139.7101,
    category: "Tsukemen",
    shortNote: "A convenient dipping-noodle stop for an Ebisu or Daikanyama day.",
    priceLevel: "$$",
    recommendedDish: "Yuzu seafood tsukemen",
  },
];
