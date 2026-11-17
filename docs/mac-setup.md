# Mac M1 · STM32CubeIDE 1.19.0 설치 안내

확인일: 2026-11-17. 로컬 환경: arm64, macOS 26.4.1. 사용자 요청에 따라 안내만 제공하며 다운로드·설치는 완료하지 않았습니다.

## 호환성 판단

- ST 설치 가이드는 M1에서 Rosetta를 통한 설치 경로를 안내합니다.
- 1.19.0에 대한 ST 담당자의 공식 커뮤니티 지원 OS 안내는 macOS 14 Sonoma와 15 Sequoia입니다.
- 따라서 M1이라는 이유만으로 불가능하다고 볼 수는 없지만, 현재 macOS 26.4.1에서 1.19.0 정상 실행·빌드·디버깅은 미검증입니다. 최신 가이드의 macOS 26 지원을 1.19.0 지원으로 해석하면 안 됩니다.

## 다운로드·설치 순서

1. https://www.st.com/en/development-tools/stm32cubeide.html 의 Get Software로 이동합니다.
2. 운영체제 macOS (Intel), 버전 1.19.0을 선택합니다. 공식 페이지에서 이 조합을 확인했습니다.
3. 라이선스를 확인하고 ST 로그인 또는 등록·이메일 인증을 진행합니다.
4. 다운로드한 설치 파일을 열고 안내를 따릅니다. M1에서 Rosetta 설치 요청이 나오면 Apple 설치 안내를 따릅니다.
5. ST Link Server를 설치하고 CubeIDE를 Applications로 옮깁니다.
6. 영문 workspace 경로를 사용합니다. 예: ~/embedded-workspace/day1.
7. NUCLEO-F103RB 프로젝트를 생성하고 STM32CubeF1 패키지를 받습니다.
8. 실행 → 코드 생성 → 빌드 → ST-LINK 인식 → 다운로드 → 디버그 실행 순으로 확인합니다.

## 문제 발생 시 남길 정보

IDE 버전, OS 버전, 오류 전문, ST-LINK 인식 여부, 어느 단계에서 실패했는지.

1.19.0이 현재 OS에서 실행되지 않는다면 스터디 진행자에게 최신 Apple Silicon 버전 사용 가능 여부를 확인합니다. 버전 변경 전 프로젝트를 백업하고 별도 workspace에서 열어봅니다.

## 출처

- https://www.st.com/en/development-tools/stm32cubeide.html
- https://www.st.com/resource/en/user_manual/dm00603964-stm32cubeide-installation-guide-stmicroelectronics.pdf (현재 최신판이므로 1.19 지원표와 구분)
- https://community.st.com/stm32cubeide-mcus-28/installing-new-operating-system-cubeide-fails-libncurses5-linux-problem-158032 (ST Technical Moderator의 RN0114 Rev 35 / 1.19.0 지원 OS 안내)
