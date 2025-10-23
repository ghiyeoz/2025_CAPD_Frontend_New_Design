// app/graph.tsx
import React, { useEffect, useMemo, useState } from "react";
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

/***** 🔗 FASTAPI 연동 준비 (백엔드 연결 시 주석 해제)
import { getDailyTemperature } from "../src/api/metrics"; // 예: /metrics/daily
*****/

// 📱 화면 크기 (그래프 너비 계산용)
const screenWidth = Dimensions.get("window").width;

export default function GraphPage() {
  const router = useRouter();

  // 🧩 폰트 로드 (다른 페이지들과 일관)
  const [fontsLoaded] = useFonts({
    "GowunDodum-Regular": require("../assets/fonts/GowunDodum-Regular.ttf"),
  });
  if (!fontsLoaded) return null;

  // 📊 그래프 라벨/데이터를 상태로 관리 (백엔드 값 주입 대비)
  const [labels, setLabels] = useState<string[]>(["09/27", "09/28", "09/29", "09/30", "09/31"]);
  const [series, setSeries] = useState<number[]>([0, 100, 50, 75, 25]);

  // 🌡️ 현재 대화 온도(마지막 값 기준)
  const temperature = useMemo(() => {
    const last = series[series.length - 1] ?? 0;
    return Math.max(0, Math.min(100, Math.round(last)));
  }, [series]);

  // 💬 대화 분위기 코멘트
  const [comment, setComment] = useState("좋은 분위기지만 답장이 늦어졌어요");

  // 🧠 온도에 따라 코멘트 자동 변경
  useEffect(() => {
    if (temperature > 70) setComment("요즘 대화 분위기가 아주 좋아요!");
    else if (temperature > 40) setComment("좋은 분위기지만 답장이 조금 늦어요");
    else setComment("대화 온도가 낮아요. 조금 더 노력해봐요!");
  }, [temperature]);

  /***** ⚙️ FASTAPI: 실제 데이터 불러오기 (백엔드 연결 후 사용)
  useEffect(() => {
    // 예시 응답: { labels: ["09/27", ...], values: [0, 100, ...] }
    (async () => {
      try {
        const resp = await getDailyTemperature(); // GET /metrics/daily
        setLabels(resp.labels);
        setSeries(resp.values);
      } catch {
        // 네트워크 오류 시에도 UI는 mock 데이터로 안전하게 동작
      }
    })();
  }, []);
  *****/

  // LineChart가 기대하는 형태로 변환
  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: series,
          color: () => "#000000ff", // 선 색상 (디자인 유지)
          strokeWidth: 1,
        },
      ],
    }),
    [labels, series]
  );

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

          {/* 📈 라인 차트 */}
          <LineChart
            data={chartData}
            width={screenWidth * 0.85}
            height={360}
            chartConfig={{
              backgroundGradientFrom: "#ffffffff",
              backgroundGradientTo: "#ffffffff",
              color: () => "#dedbdbff",
              labelColor: () => "#000",
              strokeWidth: 4,
              propsForDots: {
                r: "2",
                strokeWidth: "2",
                stroke: "#010101ff",
                fill: "#000",
              },
              propsForLabels: {
                fontSize: 10,
              },
            }}
            bezier
            style={styles.chart}
            withVerticalLines
            withHorizontalLines
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ⚠️ 스타일은 기존 디자인을 그대로 유지 */
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