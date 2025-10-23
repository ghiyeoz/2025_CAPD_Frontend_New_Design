// app/signup.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";

/***** 🔗 FASTAPI 연결 (백엔드 준비되면 주석 해제)
import * as SecureStore from "expo-secure-store";              // 필요 시: 회원가입 후 자동 로그인 토큰 저장
import { signup } from "../src/api/auth";                      // POST /auth/signup 요청 함수
*****/

export default function SignupPage() {
  const router = useRouter();

  // 🧠 입력값 상태
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // 🚫 중복 제출 방지
  const [submitting, setSubmitting] = useState(false);

  // ✅ 폰트 로드
  const [fontsLoaded] = useFonts({
    "GowunDodum-Regular": require("../assets/fonts/GowunDodum-Regular.ttf"),
  });
  if (!fontsLoaded) return null;

  // ✅ 유효성 검사(조금 더 엄격)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식
  const isEmailValid = emailRegex.test(email);
  const ageNum = Number(age);
  const isAgeValid = Number.isFinite(ageNum) && ageNum >= 16 && ageNum <= 100; // 나이 범위
  const isPasswordValid = password.length >= 6; // 비밀번호 길이
  const isConfirmMatch = password === confirm; // 비밀번호 일치
  const isFormValid =
    isEmailValid && !!name && isAgeValid && !!gender && isPasswordValid && isConfirmMatch;

  /***** ⚙️ FASTAPI 실제 회원가입 로직 (백엔드 연결 후 이 블록을 사용)
  const handleSignup = async () => {
    if (!isFormValid || submitting) {
      if (!isFormValid) Alert.alert("Error", "Please fill all fields correctly!");
      return;
    }
    try {
      setSubmitting(true);
      // 1️⃣ 회원가입 요청
      await signup({
        email,
        password,
        name,
        age: ageNum,
        gender: gender as "man" | "woman",
      });
      // 2️⃣ 가입 성공 → 로그인 화면으로 이동 (또는 토큰 있으면 바로 메인 이동)
      //    만약 서버가 access_token을 반환한다면 아래처럼 저장 후 메인으로:
      // const res = await signup(...); await SecureStore.setItemAsync("access_token", res.access_token); router.replace("/main");
      Alert.alert("Success", "Account created. Please log in.");
      router.replace("/login");
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        "Signup failed. Please check your inputs.";
      Alert.alert("Signup failed", msg);
    } finally {
      setSubmitting(false);
    }
  };
  *****/

  // 🧪 현재는 MOCK (백엔드 없이 UI 테스트용)
  const handleSignup = () => {
    if (!isFormValid || submitting) {
      if (!isFormValid) Alert.alert("Error", "Please fill all fields correctly!");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      Alert.alert("Success", "Account created successfully!");
      // 데모에선 메인으로, 실제에선 보통 로그인 화면으로 이동
      // router.replace("/login");
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
        {/* 🖐️ 빈 화면 터치 시 키보드 닫기 */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            {/* 🔝 상단 타이틀 */}
            <View style={styles.header}>
              <Text style={styles.title}>Sign Up</Text>
            </View>

            {/* 🧾 입력 폼 */}
            <ScrollView
              contentContainerStyle={styles.scroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* 📧 이메일 */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, !isEmailValid && email && styles.errorBorder]}
                  placeholder="Enter email"
                  placeholderTextColor="#88879C"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  inputMode="email"
                  returnKeyType="next"
                />
              </View>

              {/* 🧍 이름 */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter name"
                  placeholderTextColor="#88879C"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              {/* 🎂 나이 */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Age (16–100)</Text>
                <TextInput
                  style={[styles.input, !isAgeValid && age && styles.errorBorder]}
                  placeholder="Enter age"
                  placeholderTextColor="#88879C"
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                  inputMode="numeric"
                  returnKeyType="next"
                />
              </View>

              {/* 🚻 성별 선택 */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderRow}>
                  <Pressable
                    style={[styles.genderBtn, gender === "man" && styles.genderBtnActive]}
                    onPress={() => setGender("man")}
                    accessibilityRole="button"
                    accessibilityLabel="Select gender man"
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={[styles.genderText, gender === "man" && styles.genderTextActive]}>
                      MAN
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[styles.genderBtn, gender === "woman" && styles.genderBtnActive]}
                    onPress={() => setGender("woman")}
                    accessibilityRole="button"
                    accessibilityLabel="Select gender woman"
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text
                      style={[styles.genderText, gender === "woman" && styles.genderTextActive]}
                    >
                      WOMAN
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* 🔒 비밀번호 */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[styles.input, !isPasswordValid && password && styles.errorBorder]}
                  placeholder="Enter password"
                  placeholderTextColor="#88879C"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  returnKeyType="next"
                />
              </View>

              {/* 🔐 비밀번호 확인 */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={[styles.input, !isConfirmMatch && confirm && styles.errorBorder]}
                  placeholder="Re-enter password"
                  placeholderTextColor="#88879C"
                  secureTextEntry
                  value={confirm}
                  onChangeText={setConfirm}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={handleSignup}
                />
              </View>

              {/* ✅ 하단 여백 */}
              <View style={{ height: Platform.OS === "ios" ? 200 : 120 }} />
            </ScrollView>

            {/* ⬇️ 하단 버튼 영역 */}
            <View style={styles.bottomContainer}>
              {/* 회원가입 버튼 */}
              <Pressable
                style={[styles.loginBtn, (!isFormValid || submitting) && styles.disabledBtn]}
                onPress={handleSignup}
                disabled={!isFormValid || submitting}
                accessibilityRole="button"
                accessibilityLabel="Sign up"
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Text style={styles.loginText}>{submitting ? "..." : "SIGN UP"}</Text>
              </Pressable>

              {/* 로그인으로 돌아가기 버튼 */}
              <Pressable
                style={styles.signupBtn}
                onPress={() => router.push("/login")}
                accessibilityRole="button"
                accessibilityLabel="Back to login"
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Text style={styles.signupText}>BACK TO LOGIN</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ⚠️ 스타일은 건드리지 않음 — 아래는 기존 코드 그대로 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? 35 : 0,
  },
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
  scroll: {
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
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
  input: {
    borderWidth: 1,
    borderColor: "#212121",
    borderRadius: 15,
    height: Platform.OS === "android" ? 50 : 48,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#000",
    backgroundColor: "#FAFAFA",
    fontFamily: "GowunDodum-Regular",
  },
  errorBorder: {
    borderColor: "#FF4B4B",
  },
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  genderBtn: {
    width: "48%",
    height: 45,
    borderWidth: 1,
    borderColor: "#212121",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
  genderBtnActive: {
    backgroundColor: "#000",
  },
  genderText: {
    color: "#000",
    fontSize: 14,
    fontFamily: "GowunDodum-Regular",
    letterSpacing: 0,
  },
  genderTextActive: {
    color: "#fff",
    fontFamily: "GowunDodum-Regular",
  },
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