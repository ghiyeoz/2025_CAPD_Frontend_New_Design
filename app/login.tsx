// app/login.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons"; // 👁️ 비밀번호 보기용 아이콘

/***** 🔗 FASTAPI 연결 (백엔드 연결 후 활성화)
import * as SecureStore from "expo-secure-store";                  // 토큰 저장
import { login } from "../src/api/auth";                           // FastAPI 로그인 요청 함수
*****/

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ 비밀번호 표시 상태
  const [submitting, setSubmitting] = useState(false);     // 중복 클릭 방지용

  // ✅ 폰트 로드
  const [fontsLoaded] = useFonts({
    "GowunDodum-Regular": require("../assets/fonts/GowunDodum-Regular.ttf"),
  });
  if (!fontsLoaded) return null;

  // ✅ 이메일 유효성 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  /***** ⚙️ FASTAPI 실제 로그인 로직 (백엔드 연결 후 주석 해제)
  const handleLogin = async () => {
    if (!isFormValid || submitting) {
      if (!isFormValid) Alert.alert("Error", "Please enter valid email and password!");
      return;
    }
    try {
      setSubmitting(true);
      // 1️⃣ FastAPI 로그인 요청
      const res = await login({ email, password }); // POST /auth/login → { access_token, user }
      // 2️⃣ 액세스 토큰 저장
      await SecureStore.setItemAsync("access_token", res.access_token);
      // 3️⃣ 메인 화면으로 이동
      router.replace("/main");
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        "로그인 실패. 이메일 또는 비밀번호를 확인해주세요.";
      Alert.alert("Login failed", msg);
    } finally {
      setSubmitting(false);
    }
  };
  *****/

  // 🧪 현재는 MOCK (백엔드 없이 UI 테스트용)
  const handleLogin = () => {
    if (!isFormValid || submitting) {
      if (!isFormValid) Alert.alert("Error", "Please enter valid email and password!");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      Alert.alert("Success", "Logged in successfully!");
      router.push("/main");
      setSubmitting(false);
    }, 400);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* 📱 키보드 피하기 설정 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        {/* 📱 빈 화면 터치 시 키보드 닫기 */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            {/* 🧭 상단 타이틀 */}
            <View style={styles.header}>
              <Text style={styles.title}>Login</Text>
            </View>

            {/* ✏️ 입력 필드 (이메일 + 비밀번호) */}
            <ScrollView
              contentContainerStyle={styles.scroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* 📧 이메일 입력 */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    !isEmailValid && email && styles.errorBorder,
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor="#88879C"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  inputMode="email"
                  returnKeyType="next"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* 🔒 비밀번호 입력 + 👁️ 보기 버튼 */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      !isPasswordValid && password && styles.errorBorder,
                    ]}
                    placeholder="Enter your password"
                    placeholderTextColor="#88879C"
                    secureTextEntry={!showPassword} // 👁️ 보기 토글
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                    returnKeyType="go"
                    value={password}
                    onChangeText={setPassword}
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={22}
                      color="#555"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* ✅ 스크롤 여유 공간 */}
              <View style={{ height: Platform.OS === "ios" ? 200 : 120 }} />
            </ScrollView>

            {/* 🔘 하단 버튼 */}
            <View style={styles.bottomContainer}>
              {/* 로그인 버튼 */}
              <Pressable
                style={[styles.loginBtn, (!isFormValid || submitting) && styles.disabledBtn]}
                onPress={handleLogin}
                disabled={!isFormValid || submitting}
                accessibilityRole="button"
                accessibilityLabel="로그인"
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                android_ripple={Platform.OS === "android" ? { color: "rgba(255,255,255,0.1)" } : undefined}
              >
                <Text style={styles.loginText}>{submitting ? "..." : "LOGIN"}</Text>
              </Pressable>

              {/* 회원가입 버튼 */}
              <Pressable
                style={styles.signupBtn}
                onPress={() => router.push("/signup")}
                accessibilityRole="button"
                accessibilityLabel="회원가입 페이지로 이동"
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Text style={styles.signupText}>SIGN UP</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 🧱 전체 레이아웃
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? 35 : 0,
  },

  // 🔝 헤더
  header: {
    paddingVertical: 25,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#000",
    marginBottom: Platform.OS === "android" ? 5 : 0,
    fontFamily: "GowunDodum-Regular",
  },

  // 📜 스크롤 영역
  scroll: {
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  // ✏️ 입력 그룹
  fieldGroup: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 9,
    color: "#88879C",
    marginBottom: 6,
    fontFamily: "GowunDodum-Regular",
  },

  // 🔣 인풋 스타일
  input: {
    borderWidth: 1,
    borderColor: "#212121",
    borderRadius: 14,
    height: Platform.OS === "android" ? 50 : 48,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#000",
    backgroundColor: "#FAFAFA",
    fontFamily: "GowunDodum-Regular",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#212121",
    borderRadius: 14,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 0,
    paddingHorizontal: 4,
    backgroundColor: "transparent",
  },
  errorBorder: {
    borderColor: "#FF4B4B",
  },

  // ⬇️ 하단 버튼
  bottomContainer: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 10 : 0,
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loginBtn: {
    width: 340,
    height: 48,
    backgroundColor: "#000",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledBtn: {
    backgroundColor: "#999",
  },
  loginText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "GowunDodum-Regular",
  },

  // 🧩 회원가입 버튼
  signupBtn: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    width: 340,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  signupText: {
    color: "#000",
    fontSize: 15,
    fontFamily: "GowunDodum-Regular",
  },
});
