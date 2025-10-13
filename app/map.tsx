import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { useFonts } from "expo-font";

const screen = Dimensions.get("window");

export default function MapPage() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [radius, setRadius] = useState("");
  const [keyword, setKeyword] = useState("");
  const [limit, setLimit] = useState("");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

  const [fontsLoaded] = useFonts({
    "GowunDodum-Regular": require("../assets/fonts/GowunDodum-Regular.ttf"),
  });
  if (!fontsLoaded) return null;

  // 📍 현재 위치
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("위치 권한이 필요합니다!");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      // 🔥 Map’ni shu joyga animatsiya qilamiz
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (err) {
      alert("현재 위치를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 검색 (Mock data)
  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert("키워드를 입력하세요!");
      return;
    }
    setLoading(true);

    const fakeData = {
      restaurant: [
        {
          name: "Kiwamaruaji",
          lat: 36.6429,
          lng: 127.4892,
          rating: 4.7,
          open_now: true,
          distance_km: 0.3,
          address: "Cheongju, Seowon-gu",
          photo_url: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
        },
        {
          name: "Yunam Gopchang",
          lat: 36.6418,
          lng: 127.4894,
          rating: 4.2,
          open_now: true,
          distance_km: 0.5,
          address: "Seowon-gu, Chungbuk",
          photo_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
        },
      ],
      cafe: [
        {
          name: "Morning Brew Cafe",
          lat: 36.6432,
          lng: 127.4898,
          rating: 4.6,
          open_now: true,
          distance_km: 0.2,
          address: "Cheongju Downtown",
          photo_url: "https://images.unsplash.com/photo-1511920170033-f8396924c348",
        },
        {
          name: "Cafe Blossom",
          lat: 36.642,
          lng: 127.4875,
          rating: 4.4,
          open_now: false,
          distance_km: 0.6,
          address: "Seowon-gu, Cheongju",
          photo_url: "https://images.unsplash.com/photo-1523942839745-7848d4b1b9d6",
        },
      ],
      photo: [
        {
          name: "Central Park Viewpoint",
          lat: 36.6435,
          lng: 127.4902,
          rating: 4.8,
          open_now: true,
          distance_km: 0.3,
          address: "Central Park, Cheongju",
          photo_url: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
        },
      ],
    };

    const selected = fakeData[keyword.toLowerCase()] || [];
    const limited = selected.slice(0, parseInt(limit) || selected.length);
    setPlaces(limited);

    setDropdownVisible(false);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* 🗺️ Full-screen Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || 36.6424,
          longitude: userLocation?.longitude || 127.489,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        onMapReady={getCurrentLocation}
      >
        {places.map((place, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: place.lat, longitude: place.lng }}
            title={place.name}
            description={place.address}
            onPress={() => setSelectedPlace(place)}
            pinColor={keyword === "cafe" ? "brown" : keyword === "photo" ? "#1976D2" : "red"}
          />
        ))}
      </MapView>

      {/* 🔙 Back Button */}
        <View style={styles.backBtn}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" /> {/* oq strelka */}
        </TouchableOpacity>
      </View>

      {/* 📍 My Location Button */}
      <View style={styles.locationBtn}>
        <TouchableOpacity onPress={getCurrentLocation}>
          <Ionicons name="locate-outline" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 🔍 Floating Search */}
      <View style={styles.searchBox}>
        {!dropdownVisible ? (
          <TouchableOpacity style={styles.searchToggle} onPress={() => setDropdownVisible(true)}>
            <Ionicons name="search-outline" size={20} color="#000" />
            <Text style={styles.searchText}>Search places...</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.formBox}>
            <TextInput
              style={styles.input}
              placeholder="Category (restaurant / cafe / photo)"
              placeholderTextColor="#000"
              value={keyword}
              onChangeText={setKeyword}
            />
            <TextInput
              style={styles.input}
              placeholder="Radius (meter)"
              placeholderTextColor="#000"
              value={radius}
              onChangeText={setRadius}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Result limit"
              placeholderTextColor="#000"
              value={limit}
              onChangeText={setLimit}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
              <Text style={styles.searchBtnText}>Search</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {loading && <ActivityIndicator size="large" color="#000" style={styles.loading} />}

      {/* ⚪ Centered Modal */}
      <Modal
        isVisible={!!selectedPlace}
        onBackdropPress={() => setSelectedPlace(null)}
        style={{ justifyContent: "center", alignItems: "center", margin: 0 }}
      >
        <View style={styles.modalBox}>
          {selectedPlace?.photo_url && (
            <Image source={{ uri: selectedPlace.photo_url }} style={styles.modalImage} />
          )}
          <Text style={styles.modalTitle}>{selectedPlace?.name}</Text>
          <Text style={styles.modalText}>⭐ {selectedPlace?.rating} / 5.0</Text>
          <Text style={styles.modalText}>
            🕒 {selectedPlace?.open_now ? "Open Now" : "Closed"}
          </Text>
          <Text style={styles.modalText}>📍 {selectedPlace?.distance_km} km away</Text>
          <Text style={[styles.modalText, { marginTop: 5 }]}>{selectedPlace?.address}</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },

 backBtn: {
  position: "absolute",
  top: 50,
  left: 20,
  backgroundColor: "#000", // 🔥 qora dumaloq orqa fon
  borderRadius: 100,
  padding: 3, // biroz kattaroq joy
  zIndex: 999,
  shadowColor: "#000", // chiroyli yumshoq soya
  shadowOpacity: 0.25,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 5, // Android uchun soya
},

  locationBtn: {
    position: "absolute",
    bottom: 120,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 10,
    zIndex: 999,
  },

  searchBox: {
    position: "absolute",
    top: 110,
    alignSelf: "center",
    width: "90%",
    zIndex: 999,
  },
  searchToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 45,
  },
  searchText: {
    fontFamily: "GowunDodum-Regular",
    color: "#000",
    marginLeft: 8,
    fontSize: 15,
  },
  formBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 8,
    fontFamily: "GowunDodum-Regular",
    color: "#000",
    fontSize: 14,
    marginBottom: 8,
  },
  searchBtn: {
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  searchBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "GowunDodum-Regular",
  },
  loading: { position: "absolute", top: "45%", left: "45%", zIndex: 1000 },

  modalBox: {
    borderWidth: 1,
    borderColor: "#000",
    width: 340,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  modalImage: {
    borderWidth: 1,
    borderColor: "#000",
    width: 300,
    height: 180,
    borderRadius: 15,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
    marginBottom: 5,
    fontFamily: "GowunDodum-Regular",
  },
  modalText: {
    fontSize: 15,
    color: "#000",
    fontFamily: "GowunDodum-Regular",
    marginBottom: 4,
    textAlign: "center",
  },
});