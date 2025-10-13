import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    // 📱 Stack Navigator 설정
    // 👉 Expo Router에서 화면 간 이동(네비게이션)을 담당하는 구조
    <Stack screenOptions={{ headerShown: false }}>
      {/* 🏠 시작 화면 (첫 페이지) */}
      <Stack.Screen name="index" />

      {/* 🔐 로그인 페이지 */}
      <Stack.Screen name="login" />

      {/* 🌟 메인 화면 
          gestureEnabled: false → 스와이프 뒤로가기 제스처 비활성화 (iOS 기본 기능 끔)
          메인화면에서 실수로 뒤로가기 방지 목적 */}
      <Stack.Screen
        name="main"
        options={{
          gestureEnabled: false,
        }}
      />

      {/* 💬 채팅 페이지 */}
      <Stack.Screen name="chat" />

      {/* 📈 그래프 페이지 */}
      <Stack.Screen name="graph" />

      {/* ⚙️ 설정 페이지 */}
      <Stack.Screen name="settings" />

      {/* 🗺️ 지도 페이지 */}
      <Stack.Screen name="map" />
    </Stack>
  );
}