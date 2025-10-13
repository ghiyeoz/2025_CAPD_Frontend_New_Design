import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SettingsPage() {
  const router = useRouter();

  // ⚙️ 프로필 수정 상태 관리
  const [editing, setEditing] = useState(false);

  // 👤 기본 프로필 정보
  const [name, setName] = useState("Egamov Giyos");
  const [email, setEmail] = useState("giyos@cbnu.ac.kr");

  // 💾 저장 버튼 클릭 시
  const handleSave = () => {
    setEditing(false);
    Alert.alert("Saved", "Your profile information has been updated!");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔙 상단 헤더 (뒤로가기) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* 👤 프로필 영역 */}
      <View style={styles.profileBox}>
        {/* 사용자 아이콘 */}
        <Ionicons name="person-circle-outline" size={85} color="#000" style={{ marginRight: 15 }} />
        <View style={{ flex: 1 }}>
          {editing ? (
            // ✏️ 수정 모드일 때 (입력창)
            <>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor="#888"
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#888"
              />
            </>
          ) : (
            // 👁️ 보기 모드일 때 (텍스트)
            <>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.profileEmail}>{email}</Text>
            </>
          )}
        </View>
      </View>

      {/* ✏️ EDIT / SAVE 버튼 */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => (editing ? handleSave() : setEditing(true))}
      >
        <Ionicons name={editing ? "checkmark-outline" : "create-outline"} size={20} color="#fff" />
        <Text style={styles.editText}>{editing ? "SAVE" : "EDIT PROFILE"}</Text>
      </TouchableOpacity>

      {/* 🚪 LOGOUT 버튼 */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => router.push("/")}>
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>

      {/* ℹ️ 앱 정보 (하단) */}
      <View style={styles.aboutBox}>
        <Text style={styles.aboutTitle}>About App</Text>
        <Text style={styles.aboutText}>마음Talk helps you analyze emotions and conversations.</Text>
        <Text style={styles.aboutVersion}>Version 1.0.3</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 📱 전체 컨테이너
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", paddingTop: 60 },

  // 🔝 헤더 영역
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 10,
    color: "#212121",
    fontFamily: "GowunDodum-Regular",
  },

  // 👤 프로필 박스
  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    borderWidth: 1,
    borderColor: "#212121",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 17,
    color: "#000",
    fontFamily: "GowunDodum-Regular",
  },
  profileEmail: {
    fontSize: 14,
    color: "#555",
    fontFamily: "GowunDodum-Regular",
  },

  // ✏️ 수정 입력창
  input: {
    borderWidth: 1,
    borderColor: "#212121",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#000",
    fontSize: 14,
    marginBottom: 8,
    fontFamily: "GowunDodum-Regular",
  },

  // ✅ EDIT / SAVE 버튼 스타일
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 8,
    width: "85%",
    height: 45,
    marginBottom: 20,
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
    fontFamily: "GowunDodum-Regular",
  },

  // 🚪 LOGOUT 버튼 스타일
  logoutButton: {
    width: "85%",
    height: 45,
    borderWidth: 2,
    borderColor: "#212121",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    marginBottom: 40,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    fontFamily: "GowunDodum-Regular",
  },

  // ℹ️ 앱 정보 박스
  aboutBox: {
    position: "absolute",
    bottom: 30,
    width: "85%",
    alignItems: "flex-start",
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
    fontFamily: "GowunDodum-Regular",
  },
  aboutText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
    fontFamily: "GowunDodum-Regular",
  },
  aboutVersion: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    fontFamily: "GowunDodum-Regular",
  },
});