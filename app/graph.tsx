import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import { useFonts } from "expo-font";

// 📱 화면 크기 가져오기 (그래프 너비에 사용)
const screenWidth = Dimensions.get("window").width;

export default function GraphPage() {
  const router = useRouter();

  // 🌡️ 현재 대화 온도 상태
  const [temperature, setTemperature] = useState(40);

  // 💬 대화 분위기 코멘트
  const [comment, setComment] = useState("좋은 분위기지만 답장이 늦어졌어요");

  // 📊 그래프 데이터 (샘플 데이터)
  const data = {
    labels: ["09/27", "09/28", "09/29", "09/30", "09/31"],
    datasets: [
      {
        data: [0, 100, 50, 75, 25],
        color: () => "#000000ff", // 선 색상
        strokeWidth: 1, // 선 두께
      },
    ],
  };

  // 🧠 온도에 따라 코멘트 자동 변경
  useEffect(() => {
    if (temperature > 70) setComment("요즘 대화 분위기가 아주 좋아요!"); // 🔥 매우 좋은 분위기
    else if (temperature > 40)
      setComment("좋은 분위기지만 답장이 조금 늦어요"); // 🙂 괜찮은 편
    else setComment("대화 온도가 낮아요. 조금 더 노력해봐요!"); // ❄️ 낮은 분위기
  }, [temperature]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔝 헤더 (뒤로가기 버튼) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 📊 메인 프레임 */}
      <View style={styles.frame}>
        <View style={styles.innerContent}>
          {/* 💬 텍스트 박스: 현재 온도 + 코멘트 */}
          <View style={styles.textBox}>
            <Text style={styles.text}>
              지금 썸 온도: {temperature}도{"\n"}
              {comment}
            </Text>
          </View>

          {/* 📈 라인 차트 (대화 온도 변화 시각화) */}
          <LineChart
            data={data}
            width={screenWidth * 0.85} // 화면 비율 기반
            height={360}
            chartConfig={{
              backgroundGradientFrom: "#ffffffff", // 배경 색상 시작
              backgroundGradientTo: "#ffffffff", // 배경 색상 끝
              color: () => "#dedbdbff", // 선 색
              labelColor: () => "#000", // 라벨 색
              strokeWidth: 4, // 선 굵기
              propsForDots: {
                r: "2", // 점 크기
                strokeWidth: "2",
                stroke: "#010101ff",
                fill: "#000",
              },
              propsForLabels: {
                fontSize: 10, // 라벨 폰트 크기
              },
            }}
            bezier // 부드러운 곡선
            style={styles.chart}
            withVerticalLines={true} // 세로선 표시
            withHorizontalLines={true} // 가로선 표시
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 🧱 기본 컨테이너
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // 🔝 헤더
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 25,
    paddingTop: 15,
    marginBottom: 20,
  },
  headerIcon: {
    padding: 5,
  },

  // 📊 프레임 (그래프 전체를 감싸는 영역)
  frame: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 120,
    borderWidth: 1,
    borderColor: "#000000ff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },

  // 내부 컨텐츠 정렬
  innerContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  // 💬 텍스트 박스 스타일
  textBox: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#000000ff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 25,
    bottom: 20,
  },

  // 텍스트 스타일
  text: {
    textAlign: "center",
    fontSize: 15,
    color: "#000",
    lineHeight: 24,
    fontFamily: "GowunDodum-Regular",
  },

  // 📈 차트 스타일
  chart: {
    borderRadius: 15,
    top: 30,
  },
});