window.STUDY_CURRICULUM = [
  {
    "title": "임베디드 Firmware 개요",
    "pages": "3–10",
    "body": "<p><strong>이번 강의의 목표는 MCU 보드에서 주변장치를 제어하는 펌웨어를 만드는 것</strong>이에요. Day 1은 LED → 버튼 → UART 순서로 입력·출력·통신을 경험합니다.</p><p>임베디드 시스템은 특정 장치의 기능을 수행하도록 만든 컴퓨터 시스템이에요. 펌웨어는 그 안에서 하드웨어 동작을 제어하는 소프트웨어입니다. 이번에는 STM32로 시작하고, 이후 강의에서 타이머·인터럽트·센서 통신과 다른 제조사 보드로 범위를 넓혀요.</p><div class=\"flow\"><span>LED · 출력</span>→<span>버튼 · 입력</span>→<span>UART · PC와 통신</span></div><aside class=\"supplement-note\"><b>보충 · 용어를 정확하게</b><p>펌웨어는 운영체제 없이 동작할 수도 있고 RTOS와 함께 실행할 수도 있어요. 펌웨어 자체가 반드시 ‘작은 운영체제’라는 뜻은 아닙니다. 개발보드의 종류만으로 프로젝트의 수준이 결정되는 것도 아니에요.</p></aside>",
    "q": "Day 1의 학습 흐름은?",
    "opts": [
      "LED 출력 → 버튼 입력 → UART 통신",
      "센서 통신 → RTOS → 웹 서버",
      "운영체제 설치만 진행"
    ],
    "correct": 0,
    "why": "강의는 LED 출력부터 시작해 버튼을 읽고 UART로 PC와 데이터를 주고받습니다.",
    "starter": "펌웨어와 운영체제는 같은 뜻인가요?",
    "kind": "lecture",
    "tag": "강의 기반"
  },
  {
    "title": "STM32 개발환경 · MCU와 ST-LINK",
    "pages": "11–30",
    "body": "<p><strong>NUCLEO-F103RB는 개발보드 이름</strong>, STM32F103RB는 보드에 실린 MCU 이름, Arm Cortex-M3는 CPU 코어 이름이에요. 칩은 연산·메모리·주변장치를 담고, 보드는 전원·연결 단자·디버거 등 실험에 필요한 환경을 제공합니다.</p><p>STM32CubeIDE는 코드 작성, 초기 설정과 코드 생성, 빌드, 다운로드, 디버깅을 돕는 개발 도구입니다. 빌드는 C 코드를 MCU가 실행할 수 있는 프로그램으로 만드는 과정이에요.</p><p><strong>ST-LINK/V2-1</strong>은 이 보드에 포함된 디버깅 장치예요. Mac에서 빌드한 펌웨어를 MCU에 전송하고, 브레이크포인트·한 단계 실행·변수 확인을 도와줍니다. 보드가 있다면 별도 ST-LINK를 먼저 살 필요는 없어요.</p><ol><li>CubeIDE를 설치하고 데이터 통신 가능한 Mini-USB 케이블로 보드를 연결해요.</li><li>필요할 때 ST-LINK 펌웨어 버전을 확인하고 공식 업데이트 도구를 사용해요.</li><li>프로젝트 빌드와 보드 인식을 각각 확인해요. IDE 실행 성공만으로 보드 연결까지 완료된 것은 아닙니다.</li></ol><aside class=\"supplement-note\"><b>Mac 보충</b><p>강의의 Windows 실행 파일(.exe)과 드라이버 설치 화면은 Mac에서 그대로 따라 하지 않아요. 아래 Mac 설치 안내를 먼저 확인하세요. 디버거의 단계 실행과 명령 추적 기능은 구분하며, 지원 기능은 장비와 MCU에 따라 달라요.</p></aside>",
    "q": "코드 다운로드와 MCU 디버깅을 돕는 장치는?",
    "opts": [
      "사용자 버튼 B1",
      "ST-LINK",
      "LED LD2"
    ],
    "correct": 1,
    "why": "ST-LINK가 개발 PC와 MCU를 연결해 펌웨어 전송과 디버깅을 돕습니다.",
    "starter": "보드·MCU·CPU 코어의 차이를 설명해주세요.",
    "kind": "lecture",
    "tag": "강의 기반"
  },
  {
    "title": "초기 설정 ① · 디지털 신호와 Clock",
    "pages": "31–41",
    "body": "<p>디지털 신호는 전압 상태를 HIGH 또는 LOW라는 논리값으로 표현해요. 실제 HIGH·LOW 판정 범위는 칩의 데이터시트를 확인해야 합니다.</p><p><strong>클럭(Clock)은 회로 동작의 기준이 되는 반복 신호</strong>예요. 발진기(Oscillator)가 클럭을 만들며 MCU 내부 발진기 또는 외부 클럭원을 사용할 수 있어요. 정밀도와 시스템 요구사항에 따라 선택합니다.</p><div class=\"flow\"><span>내부/외부 클럭원</span>→<span>분주기 등 클럭 회로</span>→<span>CPU · 주변장치</span></div><p>8 MHz를 4로 나누면 2 MHz가 됩니다. 이처럼 <strong>분주기(Prescaler)</strong>로 장치에 필요한 속도를 만들 수 있어요. Rising edge는 LOW→HIGH로 바뀌는 순간, Falling edge는 HIGH→LOW로 바뀌는 순간입니다.</p><p>CubeIDE의 Clock Configuration은 클럭 경로와 주파수를 확인하고 초기화 코드를 생성하도록 도와줍니다. 지금은 모든 세부 설정을 암기하기보다 ‘클럭원이 있고, 나누거나 조합해 CPU와 주변장치에 전달한다’는 흐름을 이해하세요.</p><aside class=\"supplement-note\"><b>보충 · 자주 헷갈리는 부분</b><p>클럭 주파수와 C 코드의 반복 횟수는 같지 않아요. 한 명령의 실행 시간, 주변장치 설정과 지연 함수 등이 실제 동작 속도에 영향을 줍니다.</p></aside>",
    "q": "8 MHz 클럭을 4로 분주하면?",
    "opts": [
      "32 MHz",
      "2 MHz",
      "4 MHz"
    ],
    "correct": 1,
    "why": "분주 결과는 8 ÷ 4 = 2 MHz예요.",
    "starter": "클럭과 HAL_Delay의 차이가 뭔가요?",
    "kind": "lecture",
    "tag": "강의 기반"
  },
  {
    "title": "초기 설정 ② · PIN 역할과 Startup",
    "pages": "42–46",
    "body": "<p>MCU의 핀은 전원이나 디버깅에 쓰이기도 하고, GPIO 입력·출력 또는 통신 기능으로 설정해서 사용하기도 해요. <strong>연결만 해두면 원하는 기능이 자동으로 정해지는 것은 아니에요.</strong></p><ul><li>GPIO Input: 버튼 등 외부 상태 읽기</li><li>GPIO Output: LED 등 외부로 신호 출력</li><li>UART·SPI·I2C: 주변장치와 통신하기 위한 핀 기능</li></ul><p>이 선택은 핀 제어 레지스터 설정으로 이어집니다. 정확한 핀 기능은 데이터시트와 레퍼런스 매뉴얼에서 확인해요.</p><p>전원이 켜진 MCU는 바로 우리가 작성한 main 함수부터 실행하는 것이 아니에요. Startup 코드가 실행 환경을 준비하고, 데이터 초기화와 시스템 준비를 거쳐 main에 진입합니다. 세부 순서는 생성된 Startup·시스템 코드에서 확인할 수 있어요.</p><aside class=\"supplement-note\"><b>보충 · Memory-mapped I/O와 연결</b><p>GPIO 설정·데이터 레지스터도 CPU의 주소 공간에 배치됩니다. 자세한 포인터·비트·MMIO 설명은 강의 흐름 뒤의 ‘보충 학습’에서 볼 수 있어요.</p></aside>",
    "q": "버튼의 상태를 읽기 위한 핀 설정은?",
    "opts": [
      "GPIO Output",
      "GPIO Input",
      "항상 UART"
    ],
    "correct": 1,
    "why": "버튼처럼 외부 상태를 읽는 핀은 입력으로 설정해요.",
    "starter": "핀 설정은 왜 필요한가요?",
    "kind": "lecture",
    "tag": "강의 기반"
  },
  {
    "title": "CubeIDE로 프로젝트 생성하기",
    "pages": "47–52",
    "body": "<p>강의의 개발 순서는 <strong>보드 선택 → 핀 확인 → 클럭 확인 → 프로젝트 설정 → 코드 생성</strong>입니다.</p><ol><li>새 STM32 프로젝트에서 Board Selector를 열고 NUCLEO-F103RB를 검색해요.</li><li>보드의 기본 주변장치 초기화 여부를 확인하고 진행해요.</li><li>Pinout 화면에서 필요한 핀이 어떤 기능으로 설정돼 있는지 확인해요.</li><li>Clock Configuration에서 클럭 구성을 확인해요.</li><li>프로젝트 이름과 저장 위치를 지정하고 코드를 생성해요.</li></ol><p>처음에는 <strong>영문 경로</strong>에 프로젝트를 만들어 경로 관련 문제를 줄여요. 도구 버전에 따라 화면이나 메뉴 위치가 다를 수 있으므로 같은 버튼 위치보다 설정의 의미를 따라가세요.</p><p>보드 선택은 보드에 맞는 기본 설정을 활용하는 방법이고, MCU 선택은 실제 칩을 기준으로 필요한 핀·클럭·디버깅 구성을 직접 설정하는 방법입니다.</p>",
    "q": "보드 선택 다음에 확인해야 할 것은?",
    "opts": [
      "핀·클럭 등 프로젝트 설정",
      "블로그 발행 여부",
      "보드와 무관한 다른 MCU 선택"
    ],
    "correct": 0,
    "why": "자동 설정값도 사용하려는 핀·클럭과 맞는지 확인한 뒤 코드를 생성합니다.",
    "starter": "Board Selector와 MCU Selector는 어떻게 다른가요?",
    "kind": "lecture",
    "tag": "강의 기반"
  },
  {
    "title": "GPIO LED · 첫 출력과 코드 따라가기",
    "pages": "53–99",
    "body": "<p>목표는 <strong>LD2를 켜고 끄면서 핀 설정·생성 코드·HAL 함수의 연결을 이해하는 것</strong>이에요. 먼저 LED 동작을 확인하고, 두 번째 프로젝트에서는 회로도와 설정을 자세히 읽는 흐름입니다.</p><p>회로도(Schematic)는 전기적 연결을 나타내는 지도예요. LD2에서 신호선을 따라 <strong>PA5</strong>를 찾습니다. 보드의 솔더 브리지 구성에 따라 실제 연결이 달라질 수 있으므로 그림의 이름만 보고 다른 핀을 사용하지 않아요.</p><ol><li>NUCLEO-F103RB 프로젝트에서 PA5의 GPIO Output 설정과 LD2 라벨을 확인해요.</li><li>필요하면 주변장치별 .c/.h 파일 생성 옵션을 선택해요.</li><li>생성된 gpio.c와 main.h에서 초기화 코드·핀 라벨을 찾아봐요.</li><li>main.c의 적절한 USER CODE BEGIN/END 영역에 코드를 넣어요.</li><li>빌드·다운로드 후 디버거를 실행 재개해 LD2를 관찰해요.</li></ol><pre><code>// 초기화 이후 while (1) 안에 넣는 학습용 예시\nHAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);\nHAL_Delay(500);\nHAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_RESET);\nHAL_Delay(500);</code></pre><p>WritePin의 인자는 포트·핀 마스크·출력 상태예요. HAL_Delay의 단위는 ms입니다. 위 예시는 약 0.5초 켜짐과 0.5초 꺼짐이 반복되므로 한 주기는 약 1초예요.</p><p>HAL 함수 정의로 이동해 Drivers의 GPIO 구현을 읽어보세요. 자동 생성 영역 밖에 작성한 코드는 재생성 시 사라질 수 있으므로 USER CODE 영역을 사용합니다.</p><aside class=\"supplement-note\"><b>보충 · 예제 코드</b><p>위 코드는 강의의 학습 목표를 설명하기 위해 새로 쓴 예시입니다. 강의 링크의 원본 코드와 동일하다는 의미는 아니며 실제 보드에서 동작 검증하지 않았어요.</p></aside>",
    "q": "HAL_Delay(500)의 500은 어떤 단위인가요?",
    "opts": [
      "초",
      "밀리초(ms)",
      "클럭 개수"
    ],
    "correct": 1,
    "why": "500 ms는 0.5초입니다. 켜짐·꺼짐 각각 500 ms라면 한 주기는 약 1초예요.",
    "starter": "USER CODE 영역에 코드를 작성하는 이유는?",
    "kind": "lecture",
    "tag": "강의 기반"
  },
  {
    "title": "Switch Polling · 버튼으로 LED 제어",
    "pages": "100–118",
    "body": "<p>이번에는 MCU Selector에서 <strong>STM32F103RBT6</strong>를 선택해 핀과 디버그 설정을 직접 구성합니다. 사용자 버튼 B1은 PC13, LED는 PA5에 연결돼요. Reset 버튼과 User 버튼은 역할이 다릅니다.</p><ol><li>PC13을 GPIO Input, PA5를 GPIO Output으로 설정해요.</li><li>PC13의 풀업 설정과 사용자 라벨을 확인해요. 강의에서는 BTN1·LED1 같은 라벨을 지정합니다.</li><li>SYS에서 Serial Wire 디버깅 설정을 확인해요.</li><li>코드를 생성하고 HAL_GPIO_ReadPin으로 입력을 읽어요.</li></ol><p>풀업은 입력의 기본 상태를 HIGH로 잡아줍니다. 이 보드는 버튼을 누르면 LOW가 되는 <strong>active-low</strong> 입력입니다. 버튼을 눌렀다고 항상 1이 나오는 것은 아니에요.</p><pre><code>// 반복해서 버튼을 확인하는 폴링 학습 예시\nif (HAL_GPIO_ReadPin(GPIOC, GPIO_PIN_13) == GPIO_PIN_RESET) {\n  HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);\n  HAL_Delay(200);\n}</code></pre><p>이 예시는 누르고 있는 동안 LED가 반복해서 바뀝니다. ‘누를 때마다 정확히 한 번 토글’과는 다른 동작이에요. HAL은 이런 하드웨어 제어를 함수로 다루도록 돕는 추상화 계층입니다.</p><aside class=\"supplement-note\"><b>보충 · 실습 결과를 해석하기</b><p>한 번 누를 때 한 번만 바꾸려면 이전 상태와 현재 상태의 차이를 확인해야 해요. 접점 떨림(바운스)과 HAL_Delay 동안 입력 확인이 멈추는 문제도 생각해보세요.</p></aside>",
    "q": "풀업된 B1을 눌렀을 때의 입력 상태는?",
    "opts": [
      "LOW",
      "항상 HIGH",
      "무조건 읽기 오류"
    ],
    "correct": 0,
    "why": "B1은 눌렀을 때 LOW인 active-low 입력입니다.",
    "starter": "폴링과 한 번 눌림 감지는 어떻게 다른가요?",
    "kind": "lecture",
    "tag": "강의 기반"
  },
  {
    "title": "UART · 보드와 PC가 데이터 주고받기",
    "pages": "119–136",
    "body": "<p><strong>UART는 비동기 직렬 통신</strong>입니다. 공통 클럭선을 따로 보내지 않고, 미리 약속한 통신 속도와 프레임 형식에 맞춰 TX로 보내고 RX로 받습니다. UART에도 각 장치 내부의 타이밍 기준은 필요해요.</p><p>강의에서는 USART2를 Asynchronous 모드로 사용합니다. 보드의 PA2(TX)·PA3(RX)가 ST-LINK의 가상 시리얼 연결로 이어져 PC와 통신할 수 있어요. USART 주변장치는 동기·비동기 모드를 지원하므로 ‘USART라는 이름이면 항상 동기 통신’인 것은 아닙니다.</p><ol><li>USART2 → Asynchronous, Baud Rate 115200으로 설정해요.</li><li>Serial Wire와 핀 설정을 확인하고 코드를 생성해요.</li><li>생성된 UART 초기화 함수와 huart2 핸들을 확인해요.</li><li>PC 시리얼 터미널에서 보드 포트를 고르고 같은 속도·프레임 설정으로 접속해요.</li></ol><pre><code>// UART 초기화 이후 사용하는 보충 예제\nuint8_t message[] = \"hello\\r\\n\";\nHAL_UART_Transmit(&amp;huart2, message, sizeof(message) - 1, 100);\nuint8_t received;\nif (HAL_UART_Receive(&amp;huart2, &amp;received, 1, 100) == HAL_OK) {\n  HAL_UART_Transmit(&amp;huart2, &amp;received, 1, 100);\n}</code></pre><p>인자는 핸들 주소·데이터 버퍼·바이트 수·타임아웃(ms)입니다. 수신 성공 여부를 확인하고 데이터를 사용해요. huart2는 UART2 설정과 상태를 담는 핸들입니다.</p><aside class=\"supplement-note\"><b>Mac·통신 속도 보충</b><p>강의의 MobaXterm은 Windows 화면입니다. Mac에서는 시리얼 터미널을 사용하고 /dev/cu.* 장치 중 보드에 해당하는 포트를 확인해요. 일반적인 8N1은 데이터 8비트에 시작·정지 비트가 붙어 한 바이트당 10비트가 필요하므로 115200 baud에서 이론적인 데이터 전송량은 약 11,520 byte/s입니다. 실제량은 더 적을 수 있어요.</p></aside>",
    "q": "PC와 보드의 UART 설정이 다르면?",
    "opts": [
      "항상 정상 통신",
      "문자 깨짐이나 수신 실패 가능",
      "자동으로 같은 속도로 변경"
    ],
    "correct": 1,
    "why": "통신 속도와 데이터 비트·패리티·정지 비트 등 양쪽 설정을 맞춰야 합니다.",
    "starter": "UART와 USART, TX와 RX를 쉽게 설명해주세요.",
    "kind": "lecture",
    "tag": "강의 기반"
  },
  {
    "title": "printf · scanf를 UART에 연결하기",
    "pages": "137–140",
    "body": "<p>일반 PC 프로그램처럼 printf를 호출해도, 펌웨어에는 ‘어디로 문자를 보낼지’ 연결이 필요합니다. 강의에서는 C 라이브러리의 입출력 경로를 UART로 연결해요.</p><div class=\"flow\"><span>printf</span>→<span>_write</span>→<span>HAL UART 전송</span>→<span>PC 터미널</span></div><div class=\"flow\"><span>PC 입력</span>→<span>HAL UART 수신</span>→<span>_read</span>→<span>scanf</span></div><p>생성된 syscalls.c의 _write·_read와 weak 선언을 확인하세요. weak 구현은 프로젝트에서 강한 정의로 대체할 수 있어요. 중복된 강한 정의를 만들면 링커 오류가 발생할 수 있습니다.</p><p>_write는 출력 버퍼를 UART로 보내고 실제 처리한 길이를 반환하도록 구성합니다. _read는 UART에서 읽은 문자를 입력 버퍼에 저장하고 처리한 길이를 반환합니다. 정확한 시그니처는 생성된 프로젝트와 C 라이브러리를 확인해요.</p><ol><li>먼저 HAL_UART_Transmit/Receive만으로 통신이 되는지 확인해요.</li><li>UART 초기화 이후 _write 경로로 printf 문자열을 출력해요.</li><li>_read 경로를 연결한 후 숫자·문자 입력을 시험해요.</li><li>엔터 처리·에코·블로킹·버퍼링 때문에 보이는 동작이 다른지 기록해요.</li></ol><aside class=\"supplement-note\"><b>보충 · C 라이브러리와 OS 구분</b><p>이 연결 함수가 있다는 이유로 펌웨어가 운영체제가 되는 것은 아닙니다. printf의 화면 출력과 scanf의 입력이 아무 하드웨어에서나 자동으로 준비되는 것도 아니에요. 문자열 scanf에는 버퍼 크기에 맞는 입력 폭 제한이 필요합니다.</p></aside>",
    "q": "printf를 UART로 연결할 때 출력 경로는?",
    "opts": [
      "printf → _write → UART 전송",
      "printf → 버튼 입력",
      "printf → GPIO 풀업"
    ],
    "correct": 0,
    "why": "표준 출력의 하위 연결 함수를 UART 전송으로 구현해 PC 터미널에서 문자를 확인합니다.",
    "starter": "HAL UART 출력은 되는데 printf는 안 나오는 이유는?",
    "kind": "lecture",
    "tag": "강의 기반"
  },
  {
    "title": "도전 과제 · 외부 LED·PWM·버튼·UART",
    "pages": "141–149",
    "body": "<p>강의의 마지막 단계는 앞서 배운 출력·입력·통신을 조합하는 실습입니다. 아래 목표를 먼저 자기 말로 설명한 뒤 설계해보세요.</p><ol><li><strong>외부 LED 3개:</strong> 함께 켜고 끄기, LED를 하나씩 순서대로 켜기(p.144).</li><li><strong>밝기 변화:</strong> HIGH/LOW 반복에서 켜져 있는 시간 비율을 바꾸기(p.145).</li><li><strong>외부 버튼 2개:</strong> LED 전체 켜짐 상태나 순회 방향을 버튼으로 변경하기(p.146).</li><li><strong>UART 숫자 입력:</strong> 받은 숫자만큼 LED 3개를 깜빡이기(p.147).</li></ol><p>보드의 Arduino 호환 헤더와 Morpho 헤더에서 핀 위치를 찾고, 사용 가능한 GPIO인지 확인해요. LED마다 직렬 저항이 필요하며 강의는 220 Ω을 제시합니다. 핀·LED 전압과 허용 전류를 확인하고 연결도를 그린 뒤 전원을 연결하세요.</p><aside class=\"supplement-note\"><b>보충 · PWM 예시를 해석할 때</b><p>켜짐 비율(Duty cycle)은 켜짐 시간 ÷ 전체 주기예요. 50 ms 켜짐 + 50 ms 꺼짐은 주파수 10 Hz라 눈에 깜빡임이 보일 수 있습니다. 부드러운 밝기 제어를 위해서는 충분히 짧은 주기가 필요하고, 이후 타이머 PWM으로 확장할 수 있어요. HAL_Delay의 ms 단위만으로 정밀한 PWM을 만들기는 어렵습니다.</p></aside><h4>제출·관찰 체크</h4><p>p.149의 제출 안내는 p.99·115·140·144·145·146·147에 대응하는 코드와 동영상 7개입니다. 먼저 기본 LED, 버튼, printf/scanf 실습을 확인한 뒤 도전 4개를 진행해요. 코드와 내 보드 동작 영상을 남기고 ‘예상과 달랐던 점’을 설명할 수 있도록 정리하세요.</p>",
    "q": "주기 100 ms에서 50 ms 켜지고 50 ms 꺼진다면?",
    "opts": [
      "듀티 50%, 주파수 10 Hz",
      "듀티 100%, 주파수 100 Hz",
      "듀티 10%, 주파수 50 Hz"
    ],
    "correct": 0,
    "why": "듀티는 50/100=50%, 주파수는 1/0.1초=10 Hz입니다.",
    "starter": "LED 밝기 제어와 단순 깜빡임은 어떻게 다른가요?",
    "kind": "lecture",
    "tag": "강의 기반"
  },
  {
    "title": "보충 · C 포인터와 비트 연산",
    "pages": "강의 외 보충",
    "body": "<p><strong>주소</strong>는 데이터나 장치를 찾아가는 번호예요. <code>0x</code>는 16진수 표기입니다. 16진수 한 자리는 4비트라 비트 묶음을 읽기 편해요.</p><pre><code>uint32_t value = 0;\nuint32_t *p = &amp;value; // &amp;: value의 주소\n*p = 32;              // *: 그 주소에 있는 값에 접근</code></pre><p><code>uint32_t</code>는 32비트 부호 없는 정수입니다. 32비트 안의 각 자리는 0 또는 1이에요. 비트 번호는 오른쪽부터 <strong>0번</strong>으로 셉니다.</p><pre><code>1u &lt;&lt; 5        // 0000 0000 ... 0010 0000 = 32 = 0x20\nvalue |= 1u &lt;&lt; 5;    // 5번 비트를 1로, 나머지는 유지\nvalue &amp;= ~(1u &lt;&lt; 5); // 5번 비트를 0으로, 나머지는 유지\nvalue ^= 1u &lt;&lt; 5;    // 5번 비트 반전</code></pre><p><code>|</code>는 OR, <code>&amp;</code>는 AND, <code>~</code>는 반전, <code>^</code>는 XOR예요. <code>u</code>는 unsigned 상수라는 뜻입니다. 일반 변수로 먼저 연습하세요. 모든 장치 레지스터에 이 패턴을 그대로 적용할 수 있는 것은 아니에요.</p>",
    "q": "1u << 5의 값은?",
    "opts": [
      "5",
      "32 (0x20)",
      "모든 비트가 1"
    ],
    "correct": 1,
    "why": "0부터 세는 5번 비트만 1이므로 값은 32입니다.",
    "starter": "1u << 5와 GPIO_PIN_5는 어떤 관계인가요?",
    "kind": "supplement",
    "tag": "보충 학습"
  },
  {
    "title": "보충 · MMIO와 GPIO 레지스터",
    "pages": "강의 외 보충",
    "body": "<p>CPU가 접근하는 주소 공간에는 RAM뿐 아니라 <strong>주변장치의 제어·상태 레지스터</strong>도 배치돼요. CPU는 해당 주소에 값을 읽고 쓰는 방식으로 장치를 제어합니다. 이것이 <strong>Memory-mapped I/O(MMIO)</strong>예요.</p><p>여기서 레지스터는 주변장치의 설정·상태를 나타내는 작은 칸입니다. CPU 내부 연산용 레지스터와 구분하세요. RAM에 1을 쓰면 데이터를 저장하지만, GPIO 출력 레지스터에 쓰면 핀의 출력 상태가 달라질 수 있어요.</p><div class=\"flow\"><span>C의 주소 접근</span>→<span>CPU와 버스</span>→<span>GPIO 레지스터</span>→<span>PA5 출력</span></div><p>STM32F103의 GPIOA 시작 주소는 <code>0x40010800</code>, ODR의 오프셋은 <code>0x0C</code>이므로 ODR 주소는 <code>0x4001080C</code>입니다.</p><pre><code>// 의미를 읽어보는 예시: GPIOA 클럭/PA5 출력 설정 완료 가정\nvolatile uint32_t *odr = (volatile uint32_t *)0x4001080Cu;\n*odr |= (1u &lt;&lt; 5);</code></pre><p><code>volatile</code>은 컴파일러가 해당 접근을 일반 변수처럼 생략·재사용하지 않도록 하는 데 필요해요. 원자성이나 동기화까지 보장하지는 않습니다. 위 주소는 <strong>STM32F103 대상</strong>이며 Mac에서 이 코드를 실행하면 GPIO를 제어할 수 없어요.</p><p>GPIO 동작은 크게 <strong>클럭 공급 → 핀 모드 설정 → 출력 쓰기/입력 읽기</strong> 순서로 준비해요. RCC는 주변장치에 클럭을 공급하도록 설정하는 블록입니다. 클럭이 꺼져 있으면 GPIO 설정부터 확인해야 해요.</p><ul><li><code>RCC_APB2ENR</code>: GPIO 포트 클럭 허용</li><li><code>GPIOx_CRL / CRH</code>: STM32F1의 핀별 동작 모드 설정. 0~7번은 CRL, 8~15번은 CRH</li><li><code>IDR</code>: 핀의 입력 상태 읽기</li><li><code>ODR</code>: 출력 래치 값</li><li><code>BSRR</code>: 하위 16비트에 1을 쓰면 해당 출력 SET, 상위 16비트에 1을 쓰면 RESET</li></ul><pre><code>// STM32F103: PA5, 범용 Push-Pull 출력, 최대 속도 2 MHz\nRCC-&gt;APB2ENR |= (1u &lt;&lt; 2);  // GPIOA 클럭\n(void)RCC-&gt;APB2ENR;           // 클럭 설정 후 읽기\nGPIOA-&gt;BSRR = (1u &lt;&lt; 21);   // 초기 출력 LOW\nGPIOA-&gt;CRL = (GPIOA-&gt;CRL &amp; ~(0xFu &lt;&lt; 20))\n           | (0x2u &lt;&lt; 20);\nGPIOA-&gt;BSRR = (1u &lt;&lt; 5);    // PA5 HIGH</code></pre><p>PA5의 설정 필드는 4 × 5 = 20번 비트부터 시작해요. <code>0xF</code> 마스크로 네 비트를 지운 뒤 MODE=10, CNF=00을 넣습니다. 2 MHz는 출력 속도 설정이며 LED가 초당 200만 번 깜빡인다는 뜻은 아니에요.</p><p>ODR의 <code>|=</code>는 읽기-수정-쓰기입니다. BSRR은 한 번의 쓰기로 지정 핀을 바꿔 다른 핀을 건드리지 않게 해요. STM32F4 등의 MODER 예제를 F1에 그대로 적용하면 안 됩니다.</p>",
    "q": "PA5를 LOW로 만드는 BSRR 쓰기는?",
    "opts": [
      "BSRR = 0",
      "BSRR = (1u << 5)",
      "BSRR = (1u << 21)"
    ],
    "correct": 2,
    "why": "BSRR 상위 절반은 RESET용입니다. 16+5=21번 비트에 1을 씁니다.",
    "starter": "MMIO를 HAL GPIO 함수와 연결해 설명해주세요.",
    "kind": "supplement",
    "tag": "보충 학습"
  }
];
