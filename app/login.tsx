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
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons"; // 👁️ 아이콘 추가 (비밀번호 보기용)

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ 비밀번호 보기 상태

  // ✅ 폰트 로드
  const [fontsLoaded] = useFonts({
    "GowunDodum-Regular": require("../assets/fonts/GowunDodum-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  // ✅ 유효성 검사
  const isEmailValid = email.includes("@");
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  // 🚪 로그인 버튼 클릭 시 동작
  const handleLogin = () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please enter valid email and password!");
      return;
    }
    Alert.alert("Success", "Logged in successfully!");
    router.push("/main");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 📱 키보드 피하기 설정 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        {/* 📱 아무 곳이나 터치 시 키보드 닫기 */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                    secureTextEntry={!showPassword} // 👁️ 비밀번호 보기 토글
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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
                style={[styles.loginBtn, !isFormValid && styles.disabledBtn]}
                onPress={handleLogin}
                disabled={!isFormValid}
              >
                <Text style={styles.loginText}>LOGIN</Text>
              </Pressable>

              {/* 회원가입 버튼 */}
              <Pressable
                style={styles.signupBtn}
                onPress={() => router.push("/signup")}
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