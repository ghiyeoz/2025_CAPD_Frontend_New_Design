import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  Keyboard,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import { useFonts } from "expo-font";

export default function ChatPage() {
  const router = useRouter();

  // 💬 채팅 메시지 상태 관리
  const [messages, setMessages] = useState<
    { id: number; text?: string; image?: string; caption?: string; sender: "user" | "bot" }[]
  >([
    { id: 1, text: "요즘 좋아하는 사람이 있는데 고백할까 말까 ! 너무 고민돼요.", sender: "user" },
    { id: 2, text: "진심을 전하는 건 쉽지 않지만 용기를 내면 후회 없을 거예요 😊", sender: "bot" },
  ]);

  // ✍️ 입력 관련 상태
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // 🖼️ 이미지 관련 상태
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState("");

  // 🔄 스크롤과 키보드 움직임 제어
  const scrollRef = useRef<ScrollView>(null);
  const inputY = useRef(new Animated.Value(0)).current;

  // 🧩 폰트 로드
  const [fontsLoaded] = useFonts({
    "GowunDodum-Regular": require("../assets/fonts/GowunDodum-Regular.ttf"),
  });
  if (!fontsLoaded) return null;

  // ⌨️ 키보드가 올라올 때 입력창 위치 조정 (iOS 전용)
  useEffect(() => {
    const keyboardShow = Keyboard.addListener("keyboardWillShow", (e) => {
      Animated.timing(inputY, {
        toValue: e.endCoordinates.height - (Platform.OS === "ios" ? 20 : 0),
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
    const keyboardHide = Keyboard.addListener("keyboardWillHide", () => {
      Animated.timing(inputY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

  // 🗨️ 새 메시지를 추가하는 함수
  const addMessage = (msg: {
    text?: string;
    image?: string;
    caption?: string;
    sender: "user" | "bot";
  }) => {
    setMessages((prev) => [...prev, { id: Date.now(), ...msg }]);
    scrollRef.current?.scrollToEnd({ animated: true });
    Keyboard.dismiss();

    // 👩‍💻 유저가 보낸 메시지에 대해 봇의 응답 시뮬레이션
    if (msg.sender === "user" && !msg.image) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: "그건 정말 흥미로운 고민이에요. 더 이야기해볼까요?",
            sender: "bot",
          },
        ]);
        setIsTyping(false);
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 1000);
    }
  };

  // 📩 텍스트 메시지 전송
  const handleSend = () => {
    if (!message.trim()) return;
    addMessage({ text: message, sender: "user" });
    setMessage("");
  };

  // 🖼️ 이미지 선택
  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("사진 접근 권한이 필요합니다!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setImageModalVisible(true); // 📸 선택 후 모달 열기
    }
  };

  // 🖼️ 이미지 + 캡션 전송
  const handleImageSend = () => {
    if (!selectedImage) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", image: selectedImage, caption: imageCaption },
    ]);
    setSelectedImage(null);
    setImageCaption("");
    setImageModalVisible(false);

    // 🤖 봇 응답 시뮬레이션
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "사진을 잘 봤어요! 정말 멋지네요 📸",
          sender: "bot",
        },
      ]);
      setIsTyping(false);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔝 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </Pressable>
      </View>

      {/* 💬 채팅 영역 */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatContainer}
        contentContainerStyle={{ paddingBottom: 180 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      >
        {/* 🗨️ 메시지 출력 */}
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.bubble,
              msg.sender === "user" ? styles.userBubble : styles.botBubble,
            ]}
          >
            {msg.image ? (
              <>
                <Image source={{ uri: msg.image }} style={styles.imageMsg} />
                {msg.caption && (
                  <Text style={[styles.text, { marginTop: 8 }]}>{msg.caption}</Text>
                )}
              </>
            ) : (
              <Text style={styles.text}>{msg.text}</Text>
            )}
          </View>
        ))}

        {/* 🤖 봇 타이핑 중 (로딩 느낌) */}
        {isTyping && (
          <View style={[styles.bubble, styles.botBubble]}>
            <Text style={styles.typingDots}>...</Text>
          </View>
        )}
      </ScrollView>

      {/* ✍️ 입력창 */}
      <Animated.View style={[styles.inputBox, { bottom: inputY }]}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요..."
          placeholderTextColor="#666"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        {/* 📷 이미지 첨부 */}
        <Pressable onPress={handleImagePick}>
          <Ionicons name="image-outline" size={25} color="#000" style={{ marginHorizontal: 8 }} />
        </Pressable>
        {/* 📨 전송 버튼 */}
        <Pressable onPress={handleSend}>
          <Ionicons name="send" size={22} color="#000" />
        </Pressable>
      </Animated.View>

      {/* 🖼️ 이미지 캡션 입력 모달 */}
      <Modal
        isVisible={imageModalVisible}
        onBackdropPress={() => setImageModalVisible(false)}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <View style={styles.modalBox}>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.modalImage} />}
          <TextInput
            style={styles.captionInput}
            placeholder="사진에 설명을 추가하세요..."
            placeholderTextColor="#000000ff"
            value={imageCaption}
            onChangeText={setImageCaption}
          />
          <Pressable style={styles.sendBtn} onPress={handleImageSend}>
            <Text style={styles.sendBtnText}>SEND</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 📱 전체 컨테이너
  container: { flex: 1, backgroundColor: "#fff" },

  // 🔝 상단 헤더
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 10,
  },
  headerIcon: { padding: 5 },

  // 💬 채팅 리스트 영역
  chatContainer: { flex: 1, paddingHorizontal: 20 },

  // 💭 말풍선 (공통)
  bubble: {
    maxWidth: "80%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
  },
  userBubble: { alignSelf: "flex-end" }, // 사용자가 보낸 메시지 (오른쪽)
  botBubble: { alignSelf: "flex-start" }, // 봇 메시지 (왼쪽)

  text: {
    fontSize: 15,
    color: "#000",
    lineHeight: 22,
    fontFamily: "GowunDodum-Regular",
  },

  // 🖼️ 이미지 메시지
  imageMsg: { width: 180, height: 180, borderRadius: 10 },

  // ⌛ 봇 타이핑 효과
  typingDots: { fontSize: 18, color: "#000", letterSpacing: 2, fontFamily: "GowunDodum-Regular" },

  // ✍️ 입력창 영역
  inputBox: {
    position: "absolute",
    left: 20,
    right: 20,
    height: 50,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    fontFamily: "GowunDodum-Regular",
  },

  // 🖼️ 이미지 모달 스타일
  modalBox: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    bottom: 150,
  },
  modalImage: { width: 240, height: 240, borderRadius: 10, marginBottom: 10 },

  // 🗨️ 이미지 설명 입력창
  captionInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    padding: 8,
    color: "#000",
    fontSize: 14,
    marginBottom: 12,
    fontFamily: "GowunDodum-Regular",
  },

  // 📨 전송 버튼
  sendBtn: {
    backgroundColor: "#000",
    borderRadius: 15,
    width: "100%",
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "GowunDodum-Regular",
    letterSpacing: 0.5,
  },
});