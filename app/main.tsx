import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font"; 

import MainLeft from "../assets/images/main_left.svg";
import MainRight from "../assets/images/main_right.svg";

export default function MainPage() {
  const router = useRouter();

  // 📌 드롭다운 상태 관리
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // ✅ 폰트 로드
  const [fontsLoaded] = useFonts({
    "GowunDodum-Regular": require("../assets/fonts/GowunDodum-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  // 💬 대화 옵션 리스트
  const options = [
    "친한 친구 같이 편안한 대화", // 친근한 대화
    "이성적이고 솔직한 대화설문조사", // 솔직한 토론 스타일
    "현실을 직시하는 대화", // 현실적 조언 스타일
  ];

  // 🎯 옵션 선택 시 처리
  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setDropdownVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ⚙️ 상단 설정 아이콘 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons name="settings-sharp" size={26} color="#212121" />
        </TouchableOpacity>
      </View>

      {/* 🖼️ 메인 일러스트 */}
      <View style={styles.illustrationBox}>
        <View style={{ position: "relative", right: -50 }}>
          <MainLeft width={200} height={200} />
        </View>
        <View style={{ position: "relative", left: -40 }}>
          <MainRight width={200} height={250} />
        </View>
      </View>

      {/* 📊 그래프 & 지도 버튼 */}
      <View style={styles.buttonRow}>
        {/* 통계 페이지 이동 */}
        <TouchableOpacity style={styles.card} onPress={() => router.push("/graph")}>
          <Ionicons name="stats-chart-outline" size={50} color="#ff0000ff" />
        </TouchableOpacity>

        {/* 지도 페이지 이동 */}
        <TouchableOpacity style={styles.card} onPress={() => router.push("/map")}>
          <Ionicons name="trail-sign-outline" size={50} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 💬 채팅 시작 버튼 */}
      <TouchableOpacity style={styles.chatBox} onPress={() => router.push("/chat")}>
        <Text style={styles.chatText}>저와 이야기하며, 함께 방법을 찾아봐요</Text>
        <Ionicons name="arrow-forward" size={18} color="#000" />
      </TouchableOpacity>

      {/* ▼ 대화 선택 드롭다운 */}
      <TouchableOpacity
        style={[
          styles.chatBox,
          dropdownVisible && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
        ]}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Text
          style={[
            styles.chatText,
            selectedOption && { color: "#000", fontWeight: "600" },
          ]}
        >
          {selectedOption ? selectedOption : "어떤 대화를 원하시나요?"}
        </Text>
        <Ionicons
          name={dropdownVisible ? "chevron-up" : "chevron-down"}
          size={18}
          color="#000"
        />
      </TouchableOpacity>

      {/* 🧩 드롭다운 옵션 목록 */}
      {dropdownVisible && (
        <View style={styles.optionBox}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelect(option)}
              style={[
                styles.optionItem,
                selectedOption === option && styles.optionSelected,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption === option && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 🧱 전체 컨테이너
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 50,
  },

  // 🔝 헤더 (설정 아이콘 영역)
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    paddingRight: 25,
    marginTop: 20,
  },

  // 🖼️ 메인 일러스트 박스
  illustrationBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },

  // 📊 그래프 & 지도 버튼 정렬
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "84%",
    marginBottom: 25,
  },

  // 🪧 개별 카드 버튼
  card: {
    width: 155,
    height: 90,
    borderWidth: 1,
    borderColor: "#212121",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },

  // 💬 채팅 박스
  chatBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
    height: 50,
    borderWidth: 1,
    borderColor: "#212121",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 22,
    backgroundColor: "#fff",
  },
  chatText: {
    fontSize: 16,
    color: "#212121",
    fontFamily: "GowunDodum-Regular",
  },

  // ▼ 드롭다운 옵션 박스
  optionBox: {
    width: "85%",
    borderWidth: 1,
    borderColor: "#212121",
    borderTopWidth: 1,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: "#fff",
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: 16,
    color: "#212121",
    fontFamily: "GowunDodum-Regular",
  },

  // ✅ 선택된 옵션 스타일
  optionSelected: {
    backgroundColor: "#000000ff",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  optionTextSelected: {
    color: "#fff",
    fontFamily: "GowunDodum-Regular",
  },
});