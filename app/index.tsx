import React from "react";
import { SafeAreaView, StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import MainLeft from "../assets/images/main_img.svg";

export default function StartPage() {
  const router = useRouter();

  // ✅ GowunDodum 폰트만 로드
  const [fontsLoaded] = useFonts({
    "GowunDodum-Regular": require("../assets/fonts/GowunDodum-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* 👥 일러스트 이미지 */}
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  // 🧩 메인 콘텐츠
  inner: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 80,
  },

  // 🖼️ 일러스트
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

  // 💭 서브 타이틀
  subtitle: {
    fontSize: 15,
    color: "#222",
    fontFamily: "GowunDodum-Regular",
    letterSpacing: 0,
    textAlign: "center",
  },

  // 🚀 버튼
  button: {
    position: "absolute",
    bottom: 100,
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