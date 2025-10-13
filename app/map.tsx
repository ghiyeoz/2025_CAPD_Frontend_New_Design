import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"; // ✅ Google 지도 provider
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import MainLeft from "../assets/images/main_left.svg";
import MainRight from "../assets/images/main_right.svg";

export default function MapPage() {
  const router = useRouter();

  // 📍 선택된 장소 타입 (식당, 카페, 포토존)
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // 🗺️ 임시(더미) 위치 데이터
  const locations = {
    restaurant: [
      { id: 1, name: "Kiwa Restaurant", lat: 36.6425, lng: 127.4893 },
      { id: 2, name: "Chang Sim Kwan", lat: 36.6418, lng: 127.4901 },
    ],
    cafe: [
      { id: 3, name: "Coffee Bean", lat: 36.6421, lng: 127.4885 },
      { id: 4, name: "A Twosome Place", lat: 36.6416, lng: 127.4879 },
    ],
    photo: [
      { id: 5, name: "CBNU Park", lat: 36.6423, lng: 127.4897 },
      { id: 6, name: "Art Zone", lat: 36.6431, lng: 127.4903 },
    ],
  };

  // 📌 선택된 타입에 따른 마커 리스트 반환
  const getMarkers = () => {
    if (selectedType === "restaurant") return locations.restaurant;
    if (selectedType === "cafe") return locations.cafe;
    if (selectedType === "photo") return locations.photo;
    return [];
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔝 헤더 (뒤로가기 버튼) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 👥 일러스트 (메인 그래픽) */}
      <View style={styles.illustrationBox}>
        <View style={{ position: "relative", right: -50 }}>
          <MainLeft width={200} height={200} />
        </View>
        <View style={{ position: "relative", left: -40 }}>
          <MainRight width={200} height={250} />
        </View>
      </View>

      {/* 🍽️ 옵션 선택 버튼 (식당 / 포토존 / 카페) */}
      <View style={styles.optionBox}>
        {/* 🍴 식당 찾기 */}
        <TouchableOpacity
          style={[
            styles.optionItem,
            selectedType === "restaurant" && styles.optionActive,
          ]}
          onPress={() => setSelectedType("restaurant")}
        >
          <MaterialCommunityIcons name="silverware-fork-knife" size={22} color="#000" />
          <Text style={styles.optionText}>식당 찾기</Text>
        </TouchableOpacity>

        {/* 📸 포토존 찾기 */}
        <TouchableOpacity
          style={[
            styles.optionItem,
            selectedType === "photo" && styles.optionActive,
          ]}
          onPress={() => setSelectedType("photo")}
        >
          <Ionicons name="camera-outline" size={22} color="#000" />
          <Text style={styles.optionText}>photo zone 찾기</Text>
        </TouchableOpacity>

        {/* ☕ 카페 찾기 */}
        <TouchableOpacity
          style={[
            styles.optionItem,
            selectedType === "cafe" && styles.optionActive,
          ]}
          onPress={() => setSelectedType("cafe")}
        >
          <FontAwesome5 name="coffee" size={20} color="#000" />
          <Text style={styles.optionText}>카페 찾기</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Google 지도 표시 영역 */}
      <View style={styles.mapBox}>
        <MapView
          provider={PROVIDER_GOOGLE} // ✅ Google Map 강제 설정 (iOS/Android 모두 작동)
          style={styles.map}
          initialRegion={{
            latitude: 36.6424, // 중심 위도
            longitude: 127.4890, // 중심 경도
            latitudeDelta: 0.01, // 확대 정도
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true} // 📍 내 위치 표시
          showsMyLocationButton={true} // 📍 내 위치 버튼 표시
          loadingEnabled={true} // 로딩 중 인디케이터 표시
        >
          {/* 🧩 마커 표시 (선택된 타입에 따라 표시 다름) */}
          {getMarkers().map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{ latitude: marker.lat, longitude: marker.lng }}
              title={marker.name}
              description={
                selectedType === "restaurant"
                  ? "Restaurant"
                  : selectedType === "cafe"
                  ? "Cafe"
                  : "Photo Zone"
              }
              pinColor={
                selectedType === "restaurant"
                  ? "red"
                  : selectedType === "cafe"
                  ? "brown"
                  : "#1976D2"
              }
            />
          ))}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 📱 전체 컨테이너
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 20,
  },

  // 🔝 헤더 (뒤로가기 버튼 영역)
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  headerIcon: { padding: 5 },

  // 👥 상단 일러스트
  illustrationBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 35,
    marginTop: 10,
  },

  // 🍽️ 옵션 선택 영역
  optionBox: {
    width: 370,
    borderWidth: 1,
    borderColor: "#000000ff",
    borderRadius: 15,
    paddingVertical: 0,
    marginTop: -25,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 25,
  },
  optionText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "500",
    fontFamily: "GowunDodum-Regular",
  },
  // ✅ 선택된 옵션 강조 스타일
  optionActive: { backgroundColor: "#f0f0f0", borderRadius: 15 },

  // 🗺️ 지도 스타일
  mapBox: {
    width: 370,
    height: 220,
    borderWidth: 1,
    borderColor: "#000000ff",
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 10,
  },
  map: { width: "100%", height: "100%" },
});