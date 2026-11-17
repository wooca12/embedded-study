# Day 01 · MMIO와 GPIO

## 목표

- RAM과 주변장치 레지스터의 차이를 설명한다.
- 포인터, volatile, 비트 마스크를 읽는다.
- GPIO 클럭 → 모드 → 데이터 순서와 HAL의 연결을 이해한다.
- NUCLEO-F103RB의 PA5 LD2를 제어하고 PC13 B1을 읽는다.

## 준비

NUCLEO-F103RB, 데이터 통신 가능한 Mini-USB 케이블, CubeIDE와 STM32CubeF1 패키지.

`src/led-register.c`는 STM32CubeF1 프로젝트에 넣는 보충 예제입니다. 독립 빌드 프로젝트가 아니며 보드 검증 전입니다. HAL_Init, SystemClock_Config 이후 study_pa5_init을 한 번 호출하고 반복문에서 study_led_cycle을 호출합니다. HAL_Delay를 위한 SysTick이 정상 동작해야 합니다. Cube 생성 코드를 직접 편집할 때는 해당 USER CODE 영역을 사용하세요.

보드 실습 상세 절차, HAL 예제, 버튼 실습은 학습 웹의 실습 탭에 있습니다.

## 기록할 항목

- 보드·MCU·IDE·OS 버전
- 실행 전 예상과 실제 결과
- 배선 사진(직접 촬영한 내 보드), 내가 쓴 코드
- 오류 메시지, 원인, 해결
- 내 말로 설명하지 못한 부분

## 블로그

웹에서 직접 초안을 작성해 내려받고 이 폴더에 blog.md로 보관하세요. Velog에 발행한 뒤 아래 링크를 추가합니다.

- GitHub 코드 링크: 아직 미등록
- Velog 글 링크: 아직 미발행
