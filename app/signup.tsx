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
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";

export default function SignupPage() {
  const router = useRouter();

  // 🧠 상태 관리 (입력값 저장)
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // ✅ 폰트 로드
  const [fontsLoaded] = useFonts({
    "GowunDodum-Regular": require("../assets/fonts/GowunDodum-Regular.ttf"),
  });
  if (!fontsLoaded) return null;

  // ✅ 유효성 검사
  const isEmailValid = email.includes("@"); // 이메일 형식
  const isAgeValid = Number(age) >= 16 && Number(age) <= 100; // 나이 범위
  const isPasswordValid = password.length >= 6; // 비밀번호 길이
  const isConfirmMatch = password === confirm; // 비밀번호 일치 여부

  const isFormValid =
    isEmailValid && name && isAgeValid && gender && isPasswordValid && isConfirmMatch;

  // 🚀 회원가입 버튼 클릭 시 동작
  const handleSignup = () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please fill all fields correctly!");
      return;
    }
    Alert.alert("Success", "Account created successfully!");
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
        {/* 🖐️ 빈 화면 터치 시 키보드 닫기 */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                />
              </View>

              {/* 🚻 성별 선택 */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderRow}>
                  <Pressable
                    style={[
                      styles.genderBtn,
                      gender === "man" && styles.genderBtnActive,
                    ]}
                    onPress={() => setGender("man")}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        gender === "man" && styles.genderTextActive,
                      ]}
                    >
                      MAN
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.genderBtn,
                      gender === "woman" && styles.genderBtnActive,
                    ]}
                    onPress={() => setGender("woman")}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        gender === "woman" && styles.genderTextActive,
                      ]}
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
                />
              </View>

              {/* ✅ 하단 여백 */}
              <View style={{ height: Platform.OS === "ios" ? 200 : 120 }} />
            </ScrollView>

            {/* ⬇️ 하단 버튼 영역 */}
            <View style={styles.bottomContainer}>
              {/* 회원가입 버튼 */}
              <Pressable
                style={[styles.loginBtn, !isFormValid && styles.disabledBtn]}
                onPress={handleSignup}
                disabled={!isFormValid}
              >
                <Text style={styles.loginText}>SIGN UP</Text>
              </Pressable>

              {/* 로그인으로 돌아가기 버튼 */}
              <Pressable style={styles.signupBtn} onPress={() => router.push("/login")}>
                <Text style={styles.signupText}>BACK TO LOGIN</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 🧱 전체 컨테이너
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
    paddingTop: 50,
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
    borderColor: "#FF4B4B", // ❌ 유효하지 않은 입력 시 빨간색 테두리
  },

  // 🚻 성별 버튼
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