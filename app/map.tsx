// app/map.tsx
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

/***** 🔗 FASTAPI 연동 준비 (백엔드 연결 시 주석 해제)
import { searchPlaces } from "../src/api/places"; // GET /places?lat=&lng=&radius=&category=&q=
*****/

const screen = Dimensions.get("window");

export default function MapPage() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  // ✅ 상태 관리
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [radius, setRadius] = useState("");
  const [keyword, setKeyword] = useState("");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

  // ✅ 폰트 로드 (다른 페이지와 일관)
  const [fontsLoaded] = useFonts({
    "GowunDodum-Regular": require("../assets/fonts/GowunDodum-Regular.ttf"),
  });
  if (!fontsLoaded) return null;

  // 📍 현재 위치 가져오기
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

      // 지도 중심을 현재 위치로 이동
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch {
      alert("현재 위치를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 💡 카테고리 리스트
  const categoryOptions = ["식당", "가페", "데이트 코스"];

  // 🔍 장소 검색 (mock → 백엔드 스위치 가능)
  const handleSearch = async () => {
    if (!selectedCategory && !keyword.trim()) {
      alert("카테고리 또는 키워드를 입력하세요!");
      return;
    }
    setLoading(true);

    // 🎯 mock 데이터 (백엔드가 없을 때 표시용)
    const fakeData = {
      식당: [
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
      ],
      가페: [
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
      ],
      "데이트 코스": [
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

    // 🧪 기본은 mock으로 표기
    let selected = fakeData[selectedCategory || "식당"] || [];

    /***** ⚙️ FASTAPI 실제 호출 (백엔드 연결 후 사용)
    try {
      // 위치가 없으면 먼저 위치 요청
      if (!userLocation) {
        await getCurrentLocation();
      }
      const { latitude, longitude } = userLocation || { latitude: 36.6424, longitude: 127.489 };
      const r = Number(radius) || 500; // m
      const resp = await searchPlaces({
        lat: latitude,
        lng: longitude,
        radius: r,
        category: selectedCategory || "",
        q: keyword.trim(),
      }); // ← 배열 [{ name, lat, lng, rating, open_now, distance_km, address, photo_url }]
      selected = resp;
    } catch (e) {
      // 실패해도 mock 데이터로 UI는 동작
    }
    *****/

    setPlaces(selected);
    setDropdownVisible(false);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* 🗺️ 전체 지도 */}
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
        showsUserLocation
        onMapReady={getCurrentLocation}
      >
        {places.map((place, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: place.lat, longitude: place.lng }}
            title={place.name}
            description={place.address}
            onPress={() => setSelectedPlace(place)}
            pinColor={
              selectedCategory === "가페"
                ? "brown"
                : selectedCategory === "데이트 코스"
                ? "#1976D2"
                : "red"
            }
          />
        ))}
      </MapView>

      {/* 🔙 뒤로가기 버튼 */}
      <View style={styles.backBtn}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 📍 내 위치 버튼 */}
      <View style={styles.locationBtn}>
        <TouchableOpacity onPress={getCurrentLocation}>
          <Ionicons name="locate-outline" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 🔽 메인 검색 드롭다운 */}
      <View style={styles.searchBox}>
        <TouchableOpacity
          style={[
            styles.searchToggle,
            dropdownVisible && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
          ]}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <Text style={[styles.searchText]}>
            {selectedCategory ? `${selectedCategory}` : "search....."}
          </Text>
          <Ionicons
            name={dropdownVisible ? "chevron-up" : "chevron-down"}
            size={18}
            color="#000"
          />
        </TouchableOpacity>

        {dropdownVisible && (
          <View style={styles.optionBox}>
            {/* ✅ 1️⃣ Category 선택 박스 */}
            <TouchableOpacity
              style={styles.categoryToggle}
              onPress={() => setCategoryDropdownVisible(!categoryDropdownVisible)}
            >
              <Text style={styles.optionText}>
                {selectedCategory ? selectedCategory : "카테고리 선택"}
              </Text>
              <Ionicons
                name={categoryDropdownVisible ? "chevron-up" : "chevron-down"}
                size={18}
                color="#000"
              />
            </TouchableOpacity>

            {categoryDropdownVisible && (
              <View style={styles.subDropdown}>
                {categoryOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedCategory(option);
                      setCategoryDropdownVisible(false);
                    }}
                    style={[
                      styles.optionItem,
                      selectedCategory === option && styles.optionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedCategory === option && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* 📏 2️⃣ 거리 입력 */}
            <TextInput
              style={styles.input}
              placeholder="거리 (m)"
              placeholderTextColor="#000"
              value={radius}
              onChangeText={setRadius}
              keyboardType="numeric"
            />

            {/* 🔎 3️⃣ 키워드 입력 */}
            <TextInput
              style={styles.input}
              placeholder="키워드 입력"
              placeholderTextColor="#000"
              value={keyword}
              onChangeText={setKeyword}
            />

            {/* 🔍 검색 버튼 */}
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
              <Text style={styles.searchBtnText}>검색</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ⏳ 로딩 표시 */}
      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10, fontFamily: "GowunDodum-Regular" }}>검색 중...</Text>
        </View>
      )}

      {/* 🧾 장소 상세 정보 모달 */}
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
            🕒 {selectedPlace?.open_now ? "영업 중" : "영업 종료"}
          </Text>
          <Text style={styles.modalText}>📍 {selectedPlace?.distance_km} km</Text>
          <Text style={[styles.modalText, { marginTop: 5 }]}>{selectedPlace?.address}</Text>

          {/* 닫기 버튼 */}
          <TouchableOpacity onPress={() => setSelectedPlace(null)} style={{ marginTop: 10 }}>
            <Text style={{ color: "#000", textDecorationLine: "underline" }}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

/* ⚠️ 스타일은 기존 디자인 그대로 유지 */
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#000",
    borderRadius: 100,
    padding: 3,
    zIndex: 999,
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
    justifyContent: "space-between",
  },
  searchText: {
    fontFamily: "GowunDodum-Regular",
    color: "#000",
    fontSize: 15,
  },
  optionBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderTopWidth: 1,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    padding: 10,
    marginTop: 5,
  },
  categoryToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 8,
    backgroundColor: "#f9f9f9",
  },
  subDropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    marginTop: 5,
    padding: 5,
  },
  optionItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  optionText: {
    fontSize: 15,
    color: "#000",
    fontFamily: "GowunDodum-Regular",
  },
  optionSelected: {
    backgroundColor: "#000",
    borderRadius: 10,
  },
  optionTextSelected: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 8,
    fontFamily: "GowunDodum-Regular",
    color: "#000",
    fontSize: 14,
    marginTop: 10,
  },
  searchBtn: {
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 10,
    alignItems: "center",
  },
  searchBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "GowunDodum-Regular",
  },
  loadingBox: {
    position: "absolute",
    top: "45%",
    alignSelf: "center",
    alignItems: "center",
  },
  modalBox: {
    borderWidth: 1,
    borderColor: "#000",
    width: 340,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
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