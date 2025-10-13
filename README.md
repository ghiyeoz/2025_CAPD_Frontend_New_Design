##  설치 및 실행 / Installation & Run

###  Clone this repository

git clone https://github.com/<your-username>/MY-NEW-APP.git
cd MY-NEW-APP


# Install dependencies
npm install

# Start Expo development server
npx expo start

You can choose to run:
	•	a → Android emulator
	•	i → iOS simulator
	•	w → Web browser




MY-NEW-APP/
│
├── app/                    # 모든 주요 페이지 (index, login, signup, main, chat 등)
│   ├── _layout.tsx         # Expo Router 레이아웃 설정
│   ├── chat.tsx            # 채팅 화면
│   ├── graph.tsx           # 그래프 화면
│   ├── index.tsx           # 시작 화면 (Let’s Start)
│   ├── login.tsx           # 로그인 페이지
│   ├── signup.tsx          # 회원가입 페이지
│   ├── main.tsx            # 메인 대시보드
│   ├── map.tsx             # 지도 페이지
│   └── settings.tsx        # 설정 화면 (프로필 수정)
│
├── assets/                 # 정적 리소스 (폰트, 이미지 등)
│   ├── fonts/              # Custom Fonts
│   │   ├── Mulish/
│   │   ├── Gowun_Dodum/
│   │   └── Black_Han_Sans/
│   └── images/             # SVG 및 일러스트
│
├── components/             # 재사용 가능한 UI 컴포넌트
├── constants/              # 색상, 테마, 상수
├── hooks/                  # 커스텀 훅 (테마, 색상)
├── scripts/                # 개발용 스크립트
│
├── .expo/                  # Expo 설정 파일
├── app.json                # Expo 프로젝트 설정
├── package.json            # 의존성 관리
├── tsconfig.json           # TypeScript 설정
└── README.md               # 프로젝트 설명 파일
