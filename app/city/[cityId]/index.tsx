// app/city/[cityId]/index.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

type Place = {
  id: string;
  name: string;
  coords: { latitude: number; longitude: number };
  desc?: string;
  img?: any; // local image via require()
};
type CityData = { name: string; country: string; places: Place[] };

// ✅ Bullet-proof fallback image (remote URL – no local path issues)
const PLACEHOLDER = { uri: "https://picsum.photos/640/360?cityhop" };

// ------------------- CITY DATA (add img: require("../../../assets/images/<file>.jpg") when available) -------------------
const CITY_DATA: Record<string, CityData> = {
  london: {
    name: "London",
    country: "United Kingdom",
    places: [
      {
        id: "buckingham",
        name: "Buckingham Palace",
        coords: { latitude: 51.5014, longitude: -0.1419 },
        desc: "The monarch’s official residence and iconic ceremonial site.",
         img: require("../../../assets/images/palace.jpeg"),
      },
      {
        id: "britishmuseum",
        name: "British Museum",
        coords: { latitude: 51.5194, longitude: -0.1269 },
        desc: "World-class collections of art and antiquities, free entry.",
         img: require("../../../assets/images/mus.webp"),
      },
      {
        id: "tower",
        name: "Tower of London",
        coords: { latitude: 51.5081, longitude: -0.0759 },
        desc: "Medieval fortress and home of the Crown Jewels.",
         img: require("../../../assets/images/tower.webp"),
      },
    ],
  },

  "new-york": {
    name: "New York",
    country: "USA",
    places: [
      {
        id: "liberty",
        name: "Statue of Liberty",
        coords: { latitude: 40.6892, longitude: -74.0445 },
        desc: "Symbol of freedom on Liberty Island; ferries from Battery Park.",
        img: require("../../../assets/images/lib.jpg"),
      },
      {
        id: "centralpark",
        name: "Central Park",
        coords: { latitude: 40.7829, longitude: -73.9654 },
        desc: "843-acre green escape with lakes, bridges, and trails.",
         img: require("../../../assets/images/park.jpg"),
      },
      {
        id: "times",
        name: "Times Square",
        coords: { latitude: 40.758, longitude: -73.9855 },
        desc: "Neon heart of Manhattan with massive billboards.",
         img: require("../../../assets/images/square.webp"),
      },
    ],
  },

  wellington: {
    name: "Wellington",
    country: "New Zealand",
    places: [
      {
        id: "tepapa",
        name: "Te Papa Museum",
        coords: { latitude: -41.2905, longitude: 174.7821 },
        desc: "National museum with interactive exhibits and Māori culture.",
        img: require("../../../assets/images/w1.jpeg"),
      },
      {
        id: "mtvictoria",
        name: "Mount Victoria Lookout",
        coords: { latitude: -41.2959, longitude: 174.7947 },
        desc: "Panoramic city + harbour views; great at sunset.",
         img: require("../../../assets/images/w2.jpg"),
      },
      {
        id: "cablecar",
        name: "Wellington Cable Car",
        coords: { latitude: -41.2907, longitude: 174.776 },
        desc: "Historic red cable car from Lambton Quay to Kelburn.",
         img: require("../../../assets/images/w3.jpg"),
      },
    ],
  },

  paris: {
    name: "Paris",
    country: "France",
    places: [
      {
        id: "eiffel",
        name: "Eiffel Tower",
        coords: { latitude: 48.8584, longitude: 2.2945 },
        desc: "Paris’ iron icon; best views from Trocadéro and Champ de Mars.",
         img: require("../../../assets/images/etower.jpeg"),
      },
      {
        id: "louvre",
        name: "Louvre Museum",
        coords: { latitude: 48.8606, longitude: 2.3376 },
        desc: "World’s largest art museum; home to the Mona Lisa.",
         img: require("../../../assets/images/mus2.webp"),
      },
      {
        id: "notredame",
        name: "Notre-Dame",
        coords: { latitude: 48.852968, longitude: 2.349902 },
        desc: "Gothic cathedral on Île de la Cité; restoration ongoing.",
        img: require("../../../assets/images/dam.jpeg"),
      },
    ],
  },

  jaipur: {
    name: "Jaipur",
    country: "India",
    places: [
      {
        id: "hawamahal",
        name: "Hawa Mahal",
        coords: { latitude: 26.9239, longitude: 75.8267 },
        desc: "‘Palace of Winds’ with honeycomb windows for royal women.",
         img: require("../../../assets/images/j1.jpeg"),
      },
      {
        id: "amberfort",
        name: "Amber (Amer) Fort",
        coords: { latitude: 26.9855, longitude: 75.8513 },
        desc: "Hilltop fort with ornate courtyards and mirror work.",
         img: require("../../../assets/images/j2.jpg"),
      },
      {
        id: "citypalace",
        name: "City Palace",
        coords: { latitude: 26.9258, longitude: 75.8246 },
        desc: "Royal residence showcasing Rajput and Mughal architecture.",
         img: require("../../../assets/images/j3.png"),
      },
    ],
  },

  cherrapunji: {
    name: "Cherrapunji (Sohra)",
    country: "India",
    places: [
      {
        id: "nohkalikai",
        name: "Nohkalikai Falls",
        coords: { latitude: 25.2828, longitude: 91.6964 },
        desc: "One of India’s tallest plunge waterfalls with emerald pool.",
         img: require("../../../assets/images/c1.jpg"),
      },
      {
        id: "rootbridge",
        name: "Double Decker Root Bridge (Nongriat)",
        coords: { latitude: 25.2421, longitude: 91.7215 },
        desc: "Living root bridge built over decades by Khasi locals.",
         img: require("../../../assets/images/c2.jpg"),
      },
      {
        id: "mawsmai",
        name: "Mawsmai Cave",
        coords: { latitude: 25.2718, longitude: 91.7306 },
        desc: "Limestone cave with easy walkways and formations.",
         img: require("../../../assets/images/c3.jpg"),
      },
    ],
  },

  tuscany: {
    name: "Tuscany",
    country: "Italy",
    places: [
      {
        id: "duomo",
        name: "Florence Cathedral (Duomo)",
        coords: { latitude: 43.7731, longitude: 11.2556 },
        desc: "Brunelleschi’s dome crowning Florence’s skyline.",
        img: require("../../../assets/images/tus1.webp"),
      },
      {
        id: "pisa",
        name: "Leaning Tower of Pisa",
        coords: { latitude: 43.7229, longitude: 10.3966 },
        desc: "Iconic tilted bell tower in Piazza dei Miracoli.",
         img: require("../../../assets/images/tus2.webp"),
      },
      {
        id: "siena",
        name: "Piazza del Campo, Siena",
        coords: { latitude: 43.3188, longitude: 11.3317 },
        desc: "Shell-shaped square hosting the Palio horse race.",
         img: require("../../../assets/images/tus3.webp"),
      },
    ],
  },

  zurich: {
    name: "Zurich",
    country: "Switzerland",
    places: [
      {
        id: "lakeprom",
        name: "Lake Zurich Promenade",
        coords: { latitude: 47.3663, longitude: 8.5417 },
        desc: "Scenic lakeside walk; boat piers and swans at Bürkliplatz.",
         img: require("../../../assets/images/zu1.jpeg"),
      },
      {
        id: "oldtown",
        name: "Old Town (Niederdorf)",
        coords: { latitude: 47.3725, longitude: 8.5436 },
        desc: "Cobbled lanes, cafes, and churches along the Limmat.",
         img: require("../../../assets/images/zu2.jpeg"),
      },
      {
        id: "uetliberg",
        name: "Uetliberg",
        coords: { latitude: 47.3515, longitude: 8.492 },
        desc: "City’s backyard mountain with panoramic trails.",
        img: require("../../../assets/images/zu3.webp"),
      },
    ],
  },

  himalayas: {
    name: "Himalayas",
    country: "Multiple countries",
    places: [
      {
        id: "rohtang",
        name: "Rohtang Pass (Himachal)",
        coords: { latitude: 32.3667, longitude: 77.2484 },
        desc: "High mountain pass near Manali; snow vistas in season.",
         img: require("../../../assets/images/h1.webp"),
      },
      {
        id: "pangong",
        name: "Pangong Lake (Ladakh)",
        coords: { latitude: 33.7499, longitude: 78.541 },
        desc: "High-altitude blue lake stretching into Tibet.",
        img: require("../../../assets/images/h2.jpeg"),
      },
      {
        id: "kedarnath",
        name: "Kedarnath Temple (Uttarakhand)",
        coords: { latitude: 30.7352, longitude: 79.0669 },
        desc: "Ancient Shiva shrine amid dramatic peaks.",
         img: require("../../../assets/images/h3.webp"),
      },
    ],
  },

  // ✅ Tokyo (was missing earlier)
  tokyo: {
    name: "Tokyo",
    country: "Japan",
    places: [
      {
        id: "skytree",
        name: "Tokyo Skytree",
        coords: { latitude: 35.7101, longitude: 139.8107 },
        desc: "634m broadcasting tower with observation decks.",
         img: require("../../../assets/images/tree.webp"),
      },
      {
        id: "sensoji",
        name: "Senso-ji Temple (Asakusa)",
        coords: { latitude: 35.7148, longitude: 139.7967 },
        desc: "Tokyo’s oldest temple; Nakamise shopping street nearby.",
         img: require("../../../assets/images/temple.jpeg"),
      },
      {
        id: "shibuya",
        name: "Shibuya Crossing",
        coords: { latitude: 35.6595, longitude: 139.7005 },
        desc: "Famous scramble crossing beside Shibuya Station.",
         img: require("../../../assets/images/corss.jpg"),
      },
    ],
  },
};
// --------------------------------------------------------------------------------------------------

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, "-");
}

export default function CityScreen() {
  const { cityId } = useLocalSearchParams<{ cityId: string }>();
  const router = useRouter();
  const raw = decodeURIComponent(String(cityId || ""));
  const slug = toSlug(raw);

  const city = useMemo(() => CITY_DATA[slug], [slug]);
  const places = city?.places ?? [];

  if (!city) {
    return (
      <View style={s.wrap}>
        <Text style={s.h1}>No data for “{raw}”</Text>
        <Text style={{ opacity: 0.7, marginTop: 6 }}>
          Try: London, New York, Wellington, Paris, Jaipur, Cherrapunji, Tuscany, Zurich, Himalayas, Tokyo
        </Text>
      </View>
    );
  }

  // Mini-map initial region (center on first place)
  const first = places[0];
  const initialRegion = first
    ? {
        latitude: first.coords.latitude,
        longitude: first.coords.longitude,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      }
    : undefined;

  return (
    <View style={s.wrap}>
      <Text style={s.h1}>{city.name}</Text>
      <Text style={s.sub}>Top attractions</Text>

      {initialRegion && (
        <MapView style={s.map} initialRegion={initialRegion}>
          {places.map((p) => (
            <Marker key={p.id} coordinate={p.coords} title={p.name} description={p.desc || ""} />
          ))}
        </MapView>
      )}

      <FlatList
        data={places}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: `/city/${slug}/place/${item.id}`,
                params: {
                  name: item.name,
                  lat: String(item.coords.latitude),
                  lon: String(item.coords.longitude),
                  cityName: city.name,
                  country: city.country,
                  desc: item.desc ?? "",
                },
              } as any)
            }
          >
            <Image source={item.img || PLACEHOLDER} style={s.thumb} resizeMode="cover" />
            <View style={{ flex: 1 }}>
              <Text style={s.title}>{item.name}</Text>
              {!!item.desc && <Text style={s.desc} numberOfLines={2}>{item.desc}</Text>}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16 },
  h1: { fontSize: 22, fontWeight: "700" },
  sub: { opacity: 0.7, marginBottom: 12 },
  map: { height: 180, borderRadius: 12, marginBottom: 12 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  thumb: { width: 72, height: 72, borderRadius: 10, backgroundColor: "#F2F2F2" },
  title: { fontWeight: "600", marginBottom: 4 },
  desc: { opacity: 0.6 },
});
