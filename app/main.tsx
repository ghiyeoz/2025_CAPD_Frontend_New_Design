// app/main.tsx
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
        <TouchableOpacity
          onPress={() => router.push("/settings")}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
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
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/graph")}
          accessibilityRole="button"
          accessibilityLabel="Open statistics"
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Ionicons name="stats-chart-outline" size={50} color="#ff0000ff" />
        </TouchableOpacity>

        {/* 지도 페이지 이동 */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/map")}
          accessibilityRole="button"
          accessibilityLabel="Open map"
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Ionicons name="trail-sign-outline" size={50} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 💬 채팅 시작 버튼 */}
      <TouchableOpacity
        style={styles.chatBox}
        onPress={() => {
          // 🧭 선택된 대화 스타일을 chat 화면으로 전달 (UI 변화 없음)
          //    chat.tsx에서 useLocalSearchParams 로 수신 후 세션 생성 시 mode로 사용.
          router.push({
            pathname: "/chat",
            params: { mode: selectedOption ?? "" },
          });
        }}
        accessibilityRole="button"
        accessibilityLabel="Start chat"
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
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
        accessibilityRole="button"
        accessibilityLabel="Conversation style"
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
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
              accessibilityRole="button"
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
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

/* ⚠️ 스타일은 기존 그대로 — 절대 변경하지 않음 */
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
    marginTop: -15
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