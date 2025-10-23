// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

// ✅ Expo 프로젝트의 기본 Metro 설정을 불러옴
const config = getDefaultConfig(__dirname);

// 🧩 SVG 파일을 React 컴포넌트로 사용할 수 있도록 설정
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

// 🧹 기본 asset 확장자 목록에서 svg 제거
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== "svg");

// 📦 source 확장자 목록에 svg 추가
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

// 🚀 설정을 내보내기
module.exports = config;