window.STUDY_CURRICULUM = [
  {
    "title": "코드에서 LED까지 · 오늘의 큰 그림",
    "goal": "코드가 실제 핀의 전압을 바꾸는 경로를 이해해요.",
    "body": "<p>오늘 풀 질문은 하나예요. <strong>“C 코드로 숫자를 쓰는데 어떻게 LED가 켜질까?”</strong> MCU 내부의 GPIO라는 장치가 핀을 구동하고, CPU는 그 장치의 레지스터를 읽고 써서 동작을 바꿉니다.</p><div class=\"flow\"><span>C 코드</span>→<span>CPU의 주소 접근</span>→<span>GPIO 레지스터</span>→<span>핀 전압</span>→<span>LED</span></div><p>실습 대상은 NUCLEO-F103RB 보드예요. 그 안의 STM32F103RB MCU에서 코드가 실행됩니다. 내 Mac은 코드를 작성하고 빌드하는 곳, ST-LINK는 그 프로그램을 보드로 보내고 디버깅을 돕는 장치예요.</p><p><strong>PA5는 포트 A의 5번 핀</strong>입니다. 이 보드의 사용자 LED LD2와 연결되어 있어요. 사용자 버튼 B1은 PC13에 연결됩니다. 오늘은 이 두 핀으로 출력과 입력을 실험해요.</p><p>끝나면 ‘클럭 켜기 → 핀 역할 설정 → 값 쓰기/읽기’를 설명하고, 같은 동작을 HAL과 레지스터 코드로 연결할 수 있으면 됩니다.</p><p class=\"muted\">추가 통합 노트 p.2의 Core·MCU·개발보드 구분을 참고했어요.</p>",
    "q": "LED를 제어하는 코드가 실행되는 곳은?",
    "opts": [
      "내 Mac의 브라우저",
      "보드의 STM32 MCU",
      "GitHub 서버"
    ],
    "correct": 1,
    "why": "Mac에서 개발하고, MCU에 내려받은 펌웨어가 핀을 제어합니다.",
    "pages": "17, 27, 76, 102",
    "kind": "topic"
  },
  {
    "title": "필요한 C 기초 · 주소·포인터·비트",
    "goal": "레지스터 접근 코드를 읽을 최소한의 C 문법을 연결해요.",
    "body": "<p><strong>주소</strong>는 데이터나 장치를 찾아가는 번호예요. <code>0x</code>는 16진수 표기입니다. 16진수 한 자리는 4비트라 비트 묶음을 읽기 편해요.</p><pre><code>uint32_t value = 0;\nuint32_t *p = &amp;value; // &amp;: value의 주소\n*p = 32;              // *: 그 주소에 있는 값에 접근</code></pre><p><code>uint32_t</code>는 32비트 부호 없는 정수입니다. 32비트 안의 각 자리는 0 또는 1이에요. 비트 번호는 오른쪽부터 <strong>0번</strong>으로 셉니다.</p><pre><code>1u &lt;&lt; 5        // 0000 0000 ... 0010 0000 = 32 = 0x20\nvalue |= 1u &lt;&lt; 5;    // 5번 비트를 1로, 나머지는 유지\nvalue &amp;= ~(1u &lt;&lt; 5); // 5번 비트를 0으로, 나머지는 유지\nvalue ^= 1u &lt;&lt; 5;    // 5번 비트 반전</code></pre><p><code>|</code>는 OR, <code>&amp;</code>는 AND, <code>~</code>는 반전, <code>^</code>는 XOR예요. <code>u</code>는 unsigned 상수라는 뜻입니다. 일반 변수로 먼저 연습하세요. 모든 장치 레지스터에 이 패턴을 그대로 적용할 수 있는 것은 아니에요.</p>",
    "q": "1u << 5가 만드는 값과 의미는?",
    "opts": [
      "5번 비트만 1인 32 (0x20)",
      "숫자 5",
      "전체 비트가 1"
    ],
    "correct": 0,
    "why": "비트 번호는 오른쪽 0번부터 셉니다. 5번 비트는 2의 5승인 32입니다.",
    "pages": "C 기초 보충",
    "kind": "topic"
  },
  {
    "title": "Memory-mapped I/O · 주소가 장치를 가리킨다",
    "goal": "RAM 접근과 주변장치 접근의 차이를 설명해요.",
    "body": "<p>CPU가 접근하는 주소 공간에는 RAM뿐 아니라 <strong>주변장치의 제어·상태 레지스터</strong>도 배치돼요. CPU는 해당 주소에 값을 읽고 쓰는 방식으로 장치를 제어합니다. 이것이 <strong>Memory-mapped I/O(MMIO)</strong>예요.</p><p>여기서 레지스터는 주변장치의 설정·상태를 나타내는 작은 칸입니다. CPU 내부 연산용 레지스터와 구분하세요. RAM에 1을 쓰면 데이터를 저장하지만, GPIO 출력 레지스터에 쓰면 핀의 출력 상태가 달라질 수 있어요.</p><div class=\"flow\"><span>C의 주소 접근</span>→<span>CPU와 버스</span>→<span>GPIO 레지스터</span>→<span>PA5 출력</span></div><p>STM32F103의 GPIOA 시작 주소는 <code>0x40010800</code>, ODR의 오프셋은 <code>0x0C</code>이므로 ODR 주소는 <code>0x4001080C</code>입니다.</p><pre><code>// 의미를 읽어보는 예시: GPIOA 클럭/PA5 출력 설정 완료 가정\nvolatile uint32_t *odr = (volatile uint32_t *)0x4001080Cu;\n*odr |= (1u &lt;&lt; 5);</code></pre><p><code>volatile</code>은 컴파일러가 해당 접근을 일반 변수처럼 생략·재사용하지 않도록 하는 데 필요해요. 원자성이나 동기화까지 보장하지는 않습니다. 위 주소는 <strong>STM32F103 대상</strong>이며 Mac에서 이 코드를 실행하면 GPIO를 제어할 수 없어요.</p><p><strong>주소를 외우는 것보다 주소가 무엇에 연결되는지 이해하는 것이 먼저</strong>예요. GPIOA의 ODR에 쓰는 것은 LED 자체의 주소에 쓰는 것이 아니라, 출력 상태를 결정하는 레지스터에 쓰는 것입니다.</p><p>모든 레지스터가 일반 변수처럼 동작하지는 않아요. 읽기 전용 상태 레지스터나, 1을 쓰면 특정 동작을 수행하는 레지스터도 있습니다. 레퍼런스 매뉴얼의 접근 속성과 비트 의미를 확인해야 해요.</p>",
    "q": "RAM 변수와 MMIO 레지스터 접근이 다른 이유는?",
    "opts": [
      "주소 접근이 연결되는 대상과 동작 의미가 다르다",
      "MMIO는 주소를 사용하지 않는다",
      "변수 이름만 바꾸면 장치가 된다"
    ],
    "correct": 0,
    "why": "RAM은 데이터를 저장하고, MMIO는 해당 주변장치의 설정·상태·출력 등과 연결됩니다.",
    "pages": "RM0008 · Memory map / GPIO",
    "kind": "topic"
  },
  {
    "title": "GPIO · 입력과 출력, 기본 전압",
    "goal": "핀의 역할과 풀업·풀다운을 구분해요.",
    "body": "<p><strong>GPIO는 범용 입력·출력 핀</strong>이에요. 출력은 MCU가 외부에 신호를 내보내는 것, 입력은 외부 신호를 MCU가 읽는 것입니다.</p><div class=\"flow\"><span>버튼</span>→<span>PC13 입력</span>→<span>MCU 판단</span>→<span>PA5 출력</span>→<span>LED</span></div><p>HIGH/LOW는 전압을 논리 상태로 해석한 값입니다. 정확한 전압 판정 범위는 데이터시트에서 정해요. 출력 값을 HIGH로 설정하는 것과 ‘항상 3.3V가 정확히 나온다’는 말은 구분해야 합니다.</p><p><strong>Push-Pull 출력</strong>은 HIGH와 LOW를 모두 구동합니다. 외부 LED에는 전류를 제한하는 직렬 저항이 필요해요. 이번 기본 실습은 이미 연결된 온보드 LD2를 사용합니다.</p><p>입력을 아무 데도 연결하지 않으면 값이 불안정할 수 있어요. 풀업은 기본 상태를 HIGH 쪽으로, 풀다운은 LOW 쪽으로 잡습니다. 풀업된 입력에 GND로 이어지는 버튼을 연결하면 누르지 않을 때 HIGH, 누르면 LOW예요.</p><p>같은 핀을 여러 기능으로 사용할 수 있어도 모든 핀이 모든 기능을 지원하지는 않습니다. 오늘은 PA5를 GPIO Output, PC13을 GPIO Input으로 사용해요.</p><details><summary>Push-Pull과 Open-Drain은 어떻게 다른가요?</summary><p>Push-Pull은 HIGH와 LOW를 모두 능동적으로 구동합니다. Open-Drain은 LOW로 당기거나 선을 놓는 방식이며, 놓았을 때 풀업이 HIGH로 복귀시킵니다. 입력의 Pull 설정과 출력 구동 방식은 서로 다른 설정이에요. 오늘 LED 실습은 Push-Pull로 진행합니다.</p><p class=\"muted\">추가 통합 노트 p.4·9 참고</p></details>",
    "q": "풀업 입력을 버튼으로 GND에 연결하면 누른 상태는?",
    "opts": [
      "HIGH",
      "LOW",
      "입력에서는 값을 읽을 수 없다"
    ],
    "correct": 1,
    "why": "풀업은 기본을 HIGH로 잡고, 버튼을 누르면 GND에 연결되어 LOW가 됩니다.",
    "pages": "44, 76, 102, 108",
    "kind": "topic"
  },
  {
    "title": "GPIO 준비 · 클럭 허용과 핀 모드",
    "goal": "출력 값을 쓰기 전에 필요한 설정을 알아요.",
    "body": "<p>GPIO를 쓰기 전에 <strong>클럭 허용 → 핀 모드 설정</strong>이 필요해요. 클럭 허용은 해당 주변장치가 동작할 수 있도록 설정하는 과정입니다. CPU가 동작 중이라고 모든 GPIO 포트가 자동으로 준비되는 것은 아니에요.</p><ul><li><code>RCC_APB2ENR</code>: STM32F103에서 GPIO 포트 클럭을 허용</li><li><code>GPIOx_CRL</code>: 0~7번 핀의 모드 설정</li><li><code>GPIOx_CRH</code>: 8~15번 핀의 모드 설정</li></ul><pre><code>// STM32F103RB 전용 예시: PA5, Push-Pull 출력, 속도 설정 2 MHz\nRCC-&gt;APB2ENR |= (1u &lt;&lt; 2); // GPIOA 클럭 허용\n(void)RCC-&gt;APB2ENR;\nGPIOA-&gt;BSRR = (1u &lt;&lt; 21);  // 초기 출력 LOW\nGPIOA-&gt;CRL = (GPIOA-&gt;CRL &amp; ~(0xFu &lt;&lt; 20))\n           | (0x2u &lt;&lt; 20);</code></pre><p>F1의 핀 하나는 4비트 설정 필드를 사용해요. PA5는 4×5=20번부터 시작하므로 기존 네 비트를 지운 뒤 새 설정을 넣습니다. 2 MHz는 출력 속도 설정이며 LED가 그 주파수로 깜빡인다는 뜻이 아니에요.</p><p>처음에는 CubeIDE로 GPIOA 초기화 코드를 생성하고, 그 안에서 클럭 허용과 PA5 모드 설정을 찾아보세요. 다른 STM32 계열의 MODER 예제를 F103에 그대로 적용하지 않도록 주의합니다.</p>",
    "q": "PA5를 출력으로 쓰기 위한 준비는?",
    "opts": [
      "GPIOA 클럭 허용과 PA5 출력 모드 설정",
      "LED 변수 선언만 하기",
      "보드에 운영체제를 반드시 설치하기"
    ],
    "correct": 0,
    "why": "포트 클럭과 핀 역할이 준비된 다음 출력 제어를 진행합니다.",
    "pages": "44, 84, 95 · RM0008 RCC/GPIO",
    "kind": "topic"
  },
  {
    "title": "출력 제어 · ODR·BSRR와 HAL",
    "goal": "한 비트의 변화가 LED 동작으로 이어지는 이유를 확인해요.",
    "body": "<p><code>ODR</code>은 출력 래치 값입니다. PA5의 출력 비트를 1로 만들면 이 보드의 LD2가 켜지고, 0이면 꺼집니다. <code>ODR = (1u &lt;&lt; 5)</code>로 전체 값을 쓰면 다른 출력 비트도 0으로 바뀔 수 있어요.</p><pre><code>GPIOA-&gt;ODR |= (1u &lt;&lt; 5);   // PA5를 1로, 다른 비트 유지\nGPIOA-&gt;ODR &amp;= ~(1u &lt;&lt; 5);  // PA5를 0으로, 다른 비트 유지</code></pre><p>위 연산은 읽기 → 수정 → 쓰기입니다. <strong>BSRR은 지정 핀을 한 번의 쓰기로 SET/RESET</strong>할 수 있어요. 하위 16비트는 SET, 상위 16비트는 RESET 요청입니다.</p><pre><code>GPIOA-&gt;BSRR = (1u &lt;&lt; 5);   // PA5 HIGH\nGPIOA-&gt;BSRR = (1u &lt;&lt; 21);  // PA5 LOW: 16 + 5\n// 같은 HIGH 동작을 HAL로 표현\nHAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);</code></pre><p>BSRR에 0을 쓰는 것은 핀을 LOW로 만들라는 뜻이 아니라 해당 비트에 동작을 요청하지 않는다는 뜻이에요. ODR과 BSRR의 비트 의미를 구분하세요.</p><p><code>GPIO_PIN_5</code>는 숫자 5가 아니라 비트 마스크 0x20입니다. HAL은 이 레지스터 조작을 함수로 다루게 도와줍니다. GPIO 초기화가 완료된 같은 조건에서 HAL 함수와 레지스터 코드를 비교해보세요.</p>",
    "q": "BSRR로 PA5를 끄는 쓰기는?",
    "opts": [
      "BSRR = 0",
      "BSRR = (1u << 5)",
      "BSRR = (1u << 21)"
    ],
    "correct": 2,
    "why": "RESET 요청은 16+핀 번호 위치입니다. PA5는 21번 비트예요.",
    "pages": "97, 99 · RM0008 GPIO",
    "kind": "topic"
  },
  {
    "title": "입력 읽기 · IDR와 버튼 폴링",
    "goal": "눌림과 논리값을 구분하고 입력을 조건으로 사용해요.",
    "body": "<p><code>IDR</code>은 핀 입력 상태를 읽는 레지스터입니다. PC13 상태를 마스크로 확인하면 원하는 비트가 HIGH인지 알 수 있어요.</p><pre><code>uint32_t input_high = GPIOC-&gt;IDR &amp; (1u &lt;&lt; 13);\n// 결과는 HIGH일 때 0x2000, LOW일 때 0입니다.\n// 1과 직접 비교하지 말고 0인지 아닌지 확인해요.</code></pre><p>NUCLEO-F103RB의 B1은 PC13에 연결되어 눌렀을 때 LOW예요. 입력 설정과 풀업 구성을 확인한 뒤 읽습니다. HAL에서는 다음처럼 표현할 수 있어요.</p><pre><code>GPIO_PinState pin = HAL_GPIO_ReadPin(GPIOC, GPIO_PIN_13);\nif (pin == GPIO_PIN_RESET) {\n  // 버튼을 누른 상태\n}</code></pre><p><strong>폴링</strong>은 반복문에서 입력 상태를 계속 확인하는 방식이에요. 누르는 동안 LED를 켜는 것과, 누를 때마다 LED를 한 번씩 토글하는 것은 다릅니다.</p><p>한 번 눌림을 구분하려면 이전 상태와 현재 상태의 변화를 확인해야 해요. 실제 버튼은 접점 떨림(바운스)이 있어, 상태 변화 감지만으로 한 번 눌림을 항상 보장하지는 않습니다. 긴 HAL_Delay 동안에는 반복문의 입력 확인도 기다리게 돼요.</p><details><summary>한 번 눌렀는데 여러 번 처리된다면?</summary><p>두 원인을 나눠 확인하세요. 눌린 상태를 루프마다 처리하는 문제는 이전·현재 상태 비교로, 실제 접점 신호가 튀는 문제는 디바운싱으로 다룹니다. 일정 시간 뒤 상태가 유지되는지 확인하는 방법으로 시작할 수 있지만, 긴 Delay는 다른 처리도 멈추게 해요.</p><p class=\"muted\">추가 통합 노트 p.4·18 참고 · 인터럽트 설정은 오늘 범위에서 제외합니다.</p></details>",
    "q": "PC13의 마스크 검사 결과가 0x2000이라면?",
    "opts": [
      "HIGH이므로 이 보드의 B1은 누르지 않은 상태",
      "반드시 눌린 상태",
      "값이 1이 아니므로 오류"
    ],
    "correct": 0,
    "why": "마스크 결과는 해당 비트의 자리값입니다. PC13 HIGH는 0x2000이고, 이 active-low 버튼의 눌림은 LOW입니다.",
    "pages": "102–115",
    "kind": "topic"
  },
  {
    "title": "전체 연결 · 같은 동작을 두 방식으로 설명하기",
    "goal": "실행 결과를 MMIO와 GPIO 개념으로 되짚어 봐요.",
    "body": "<p>이제 ‘버튼을 누르면 LED가 켜진다’를 아래 순서로 설명해보세요.</p><ol><li>GPIOA·GPIOC의 클럭을 허용합니다.</li><li>PA5를 출력, PC13을 입력으로 준비합니다.</li><li>PC13의 상태를 IDR 또는 HAL ReadPin으로 읽습니다.</li><li>LOW라면 눌림으로 판단하고, BSRR 또는 HAL WritePin으로 PA5를 HIGH로 만듭니다.</li><li>루프에서 반복하며 실제 버튼·LED 동작을 관찰합니다.</li></ol><div class=\"flow\"><span>PC13 전압</span>→<span>IDR 읽기</span>→<span>C 조건문</span>→<span>BSRR 쓰기</span>→<span>PA5 출력</span></div><p>주소·비트 → 레지스터 → GPIO → 물리적 입력·출력이 연결된 모습입니다. HAL 코드를 쓰더라도 아래에는 이런 하드웨어 접근이 있어요.</p><h4>스터디에서 함께 확인할 것</h4><ul><li>LED 주기를 바꿔보고 한 주기를 계산해요.</li><li>HAL 출력 코드를 BSRR 쓰기로 바꿔 같은 결과인지 봐요.</li><li>다른 ODR 비트가 유지되는지 브라우저 연습으로 확인해요.</li><li>버튼 입력 조건을 반대로 바꿔 결과를 예상해요.</li><li>동작하지 않으면 전원·실행 상태·클럭·모드·핀·논리값 순서로 원인을 좁혀요.</li></ul><p>완료 기준은 코드를 그대로 재현하는 것에 더해, <strong>왜 이 설정과 비트가 필요한지 자료 없이 3분 안에 설명하는 것</strong>입니다.</p>",
    "q": "버튼 입력부터 LED 출력까지의 연결은?",
    "opts": [
      "IDR 읽기 → 눌림 판단 → BSRR 쓰기 → PA5 변화",
      "ODR 읽기만 하면 버튼도 자동 제어",
      "핀 모드는 아무 영향이 없다"
    ],
    "correct": 0,
    "why": "입력 상태 읽기와 출력 제어는 별도 동작이며 C 조건문이 둘을 연결합니다.",
    "pages": "GPIO·MMIO 연결 정리",
    "kind": "topic"
  }
];
