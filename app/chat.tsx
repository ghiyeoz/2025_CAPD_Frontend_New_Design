// app/chat.tsx
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
import { useRouter, useLocalSearchParams } from "expo-router"; // 🔎 main에서 넘어온 mode 수신
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import { useFonts } from "expo-font";

// 🔗 FASTAPI 연결 준비 (백엔드 연결 시 주석 해제하여 사용)
// import * as SecureStore from "expo-secure-store";
// import { startChat, sendMessage } from "../src/api/chat"; // /chat/start, /chat/send

export default function ChatPage() {
  const router = useRouter();

  // 💬 채팅 메시지 상태
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

  // 🔄 스크롤 & 키보드 제어
  const scrollRef = useRef<ScrollView>(null);
  const inputY = useRef(new Animated.Value(0)).current; // UI 모양 유지용
  const [kbHeight, setKbHeight] = useState(0); // 실제 키보드 높이(스크롤 여유 공간 계산)

  // 🔎 main.tsx 에서 전달된 대화 모드
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const modeMap: Record<string, "friendly" | "honest" | "realistic"> = {
    "친한 친구 같이 편안한 대화": "friendly",
    "이성적이고 솔직한 대화설문조사": "honest",
    "현실을 직시하는 대화": "realistic",
  };
  const currentMode = modeMap[String(mode || "")] || "friendly";

  // 🆔 백엔드 세션 ID (연결 시 사용)
  const [sessionId, setSessionId] = useState<string | null>(null);

  // 🧩 폰트 로드
  const [fontsLoaded] = useFonts({
    "GowunDodum-Regular": require("../assets/fonts/GowunDodum-Regular.ttf"),
  });
  if (!fontsLoaded) return null;

  // ⌨️ 키보드가 올라올 때 입력창 위치 조정 + 스크롤 여유 공간 확보
  useEffect(() => {
    const showEvt = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: any) => {
      const h = e?.endCoordinates?.height ?? 0;
      setKbHeight(h);
      Animated.timing(inputY, {
        toValue: h - (Platform.OS === "ios" ? 20 : 0),
        duration: Platform.OS === "ios" ? 250 : 0,
        useNativeDriver: false,
      }).start(() => {
        // 키보드가 뜨면 바로 맨 아래로 스크롤
        requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
      });
    };

    const onHide = () => {
      setKbHeight(0);
      Animated.timing(inputY, {
        toValue: 0,
        duration: Platform.OS === "ios" ? 250 : 0,
        useNativeDriver: false,
      }).start();
    };

    const subShow = Keyboard.addListener(showEvt, onShow);
    const subHide = Keyboard.addListener(hideEvt, onHide);
    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [inputY]);

  // 🗨️ 새 메시지 추가
  const addMessage = (msg: {
    text?: string;
    image?: string;
    caption?: string;
    sender: "user" | "bot";
  }) => {
    setMessages((prev) => [...prev, { id: Date.now(), ...msg }]);
    // 새 메시지 추가 시 하단으로 스크롤
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));

    // 👩‍💻 현재는 봇 응답 모의
    if (msg.sender === "user" && !msg.image) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: "그건 정말 흥미로운 고민이에요. 더 이야기해볼까요?", sender: "bot" },
        ]);
        setIsTyping(false);
        requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
      }, 1000);
    }
  };

  // 📩 텍스트 메시지 전송
  const handleSend = async () => {
    if (!message.trim()) return;

    // 🧪 현재는 로컬 추가(모의). 스타일 유지.
    addMessage({ text: message, sender: "user" });
    const toSend = message;
    setMessage("");

    // ⚙️ FASTAPI 실제 호출 (백엔드 연결 후 사용)
    // try {
    //   let sid = sessionId;
    //   if (!sid) {
    //     // const token = await SecureStore.getItemAsync("access_token"); // 필요 시
    //     const created = await startChat({ mode: currentMode }); // ← 블록 주석 사용 금지
    //     // 토큰을 쓸 경우:
    //     // const created = await startChat({ mode: currentMode, token });
    //     sid = created.session_id;
    //     setSessionId(sid);
    //   }
    //   const resp = await sendMessage({ session_id: sid, role: "user", text: toSend });
    //   addMessage({ text: resp.reply, sender: "bot" });
    // } catch (err) {
    //   addMessage({ text: "서버 통신 오류가 발생했어요. 잠시 후 다시 시도해주세요.", sender: "bot" });
    // }
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
  const handleImageSend = async () => {
    if (!selectedImage) return;

    // 🧪 현재는 로컬 추가(모의)
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", image: selectedImage, caption: imageCaption },
    ]);
    const img = selectedImage;
    const cap = imageCaption;
    setSelectedImage(null);
    setImageCaption("");
    setImageModalVisible(false);

    // 🧪 모의 봇 응답
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "사진을 잘 봤어요! 정말 멋지네요 📸", sender: "bot" },
      ]);
      setIsTyping(false);
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    }, 1200);

    // ⚙️ FASTAPI 실제 호출 (백엔드 연결 후 사용)
    // try {
    //   let sid = sessionId;
    //   if (!sid) {
    //     const created = await startChat({ mode: currentMode });
    //     sid = created.session_id;
    //     setSessionId(sid);
    //   }
    //   const resp = await sendMessage({
    //     session_id: sid,
    //     role: "user",
    //     text: cap || "",
    //     image_url: img, // 서버 스펙에 따라 base64/파일 업로드로 교체 가능
    //   });
    //   addMessage({ text: resp.reply, sender: "bot" });
    // } catch {
    //   addMessage({ text: "이미지 전송 중 오류가 발생했어요.", sender: "bot" });
    // }
  };

  // 🔽 스크롤 하단 여유(입력창 높이 + 키보드 높이)
  const bottomSpacer = 120 + kbHeight; // 기존 디자인 유지하면서 겹침 방지

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
        contentContainerStyle={{ paddingTop: 0, paddingBottom: bottomSpacer }} // ✅ 동적 패딩
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
                {!!msg.caption && <Text style={[styles.text, { marginTop: 8 }]}>{msg.caption}</Text>}
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

/* ⚠️ 스타일은 건드리지 않음 — 아래는 기존 코드 그대로 */
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