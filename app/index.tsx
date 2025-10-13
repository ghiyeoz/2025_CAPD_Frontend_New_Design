import React from "react";
import { SafeAreaView, StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import MainLeft from "../assets/images/main_img.svg";

export default function StartPage() {
  const router = useRouter();

  // ✅ 폰트 로드 (Mulish 폰트 불러오기)
  const [fontsLoaded] = useFonts({
    MulishExtraBold: require("../assets/fonts/Mulish/static/Mulish-ExtraBold.ttf"),
    MulishRegular: require("../assets/fonts/Mulish/static/Mulish-Regular.ttf"),
  });

  // ⏳ 폰트가 아직 로드되지 않았을 때 null 반환
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* 👥 일러스트 이미지 (SVG 파일) */}
        <View style={styles.illustrationBox}>
          <View style={{ position: "relative", right: 0 }}>
            <MainLeft width={300} height={200} />
          </View>
        </View>

        {/* 💬 메인 타이틀 */}
        <Text style={styles.title}>
          마음<Text style={styles.bold}>TALK</Text>
        </Text>

        {/* ✨ 서브 타이틀 */}
        <Text style={styles.subtitle}>Where there is love, there is life</Text>
      </View>

      {/* 🚀 시작 버튼 */}
      <Pressable style={styles.button} onPress={() => router.push("/login")}>
        <Text style={styles.buttonText}>LET’S START</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 📱 전체 컨테이너
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 40,
    justifyContent: "center", // ⬆️ 수직 가운데 정렬
    alignItems: "center",
    paddingHorizontal: 20,
  },

  // 🧩 메인 콘텐츠 영역 (이미지 + 텍스트)
  inner: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 80, // 👇 버튼 공간 확보
  },

  // 🖼️ 일러스트 (SVG)
  illustrationBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -12,
    marginTop: 20,
  },

  // 📝 타이틀 텍스트
  title: {
    fontSize: 35,
    color: "#212121",
    fontFamily: "GowunDodum-Regular",
    textAlign: "center",
    marginBottom: 0,
  },
  bold: {
    fontFamily: "GowunDodum-Regular",
  },

  // 💭 서브 타이틀 텍스트
  subtitle: {
    fontSize: 15,
    color: "#222",
    fontFamily: "GowunDodum-Regular",
    letterSpacing: 0,
    textAlign: "center",
  },

  // 🚀 시작 버튼
  button: {
    position: "absolute",
    bottom: 100, // 🔼 버튼 위치
    backgroundColor: "#000",
    paddingHorizontal: 80,
    paddingVertical: 14,
    borderRadius: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "GowunDodum-Regular",
    letterSpacing: 0,
  },
});