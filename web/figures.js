'use strict';
(() => {
  const lessons = document.querySelectorAll('.lesson');
  const figures = [
    { lesson: 1, page: 27, title: '보드에서 MCU와 디버거 구분하기', alt: 'NUCLEO 보드에서 ST-LINK/V2-1 영역과 STM32 MCU 영역을 구분한 강의 그림', guide: 'ST-LINK는 Mac과 MCU 사이에서 프로그램 전송과 디버깅을 돕습니다. MCU는 내려받은 펌웨어를 실행해요. 보드 전체가 하나의 CPU인 것은 아닙니다.' },
    { lesson: 5, page: 76, title: '회로도에서 LED와 PA5 연결 따라가기', alt: 'LD2 사용자 LED의 연결 핀을 찾는 회로도', guide: 'LD2라는 부품 이름을 찾은 다음 연결선을 따라 PA5를 확인하세요. 보드상의 LED 이름(LD2)과 코드에서 지정하는 핀(PA5)을 연결해서 읽는 연습입니다.' },
    { lesson: 6, page: 102, title: '버튼도 연결된 핀부터 찾기', alt: '사용자 버튼 B1과 PC13 연결을 확인하는 강의 회로도', guide: '버튼 B1의 연결을 PC13까지 따라가세요. PA5는 LED 출력, PC13은 버튼 입력이라는 차이를 기억하세요. 버튼을 눌렀을 때의 논리값은 풀업과 GND 연결을 함께 확인해야 해요.' },
    { lesson: 3, page: 44, title: '같은 핀도 설정에 따라 역할이 달라져요', alt: 'GPIO 입력·출력 및 통신 기능으로 핀의 역할을 구분한 그림', guide: 'GPIO 입력·출력과 통신 기능이 서로 다른 역할임을 확인하세요. 이 강의에서는 GPIO를 먼저 사용하고 뒤에서 UART를 설정합니다.' },
    { lesson: 6, page: 108, title: '입력 모드와 풀업을 도구에서 설정하기', alt: 'CubeIDE의 GPIO 입력 모드와 Pull-up 설정 화면', guide: 'Input mode는 외부 상태를 읽는 설정, Pull-up은 입력의 기본 상태를 HIGH 쪽으로 잡는 설정입니다. 설정 화면에서 고른 값은 생성된 GPIO 초기화 코드와 실제 레지스터 설정으로 이어져요.' },
    { lesson: 5, page: 84, title: '화면의 PA5·LD2를 코드와 연결하기', alt: 'CubeIDE Pinout에서 PA5 핀과 LD2 라벨을 보여주는 화면', guide: 'PA5는 하드웨어 핀 이름, LD2는 보드 LED를 알아보기 쉽게 붙인 라벨입니다. 이 설정을 코드로 생성한 뒤 HAL_GPIO_WritePin의 포트와 핀 인자를 비교해보세요.' },
    { lesson: 2, page: 36, title: '클럭을 기준으로 동작 이해하기', alt: '디지털 클럭과 CPU 명령 실행의 관계를 보여주는 강의 그림', guide: '반복되는 신호와 명령 실행의 관계를 보세요. 한 클럭과 C 코드 한 줄을 일대일로 생각하지는 마세요.' },
    { lesson: 4, page: 51, title: 'Clock Configuration 화면 읽기', alt: 'CubeIDE의 클럭 경로 설정 화면', guide: '클럭원에서 장치까지 이어지는 경로와 주파수를 확인해요. 처음에는 자동 설정된 경로를 읽는 데 집중하세요.' },
    { lesson: 7, page: 122, title: 'USART2와 ST-LINK 연결 찾기', alt: 'UART 통신 핀 PA2와 PA3의 ST-LINK 연결 회로도', guide: 'PA2 TX와 PA3 RX를 구분하세요. USB 케이블을 연결해도 펌웨어에서 UART 설정과 전송 코드를 준비해야 데이터가 나옵니다.' },
    { lesson: 7, page: 125, title: 'USART2를 비동기 모드로 사용하기', alt: 'CubeIDE에서 USART2의 Asynchronous 모드를 선택하는 화면', guide: '주변장치 이름은 USART2여도 Asynchronous 모드를 선택하면 이 강의의 UART 통신으로 사용할 수 있어요.' },
    { lesson: 8, page: 137, title: '표준 입출력과 UART의 연결 경로', alt: 'printf와 scanf를 _write와 _read를 거쳐 UART에 연결하는 강의 도식', guide: 'printf에서 UART까지 이어지는 호출 경로를 따라가세요. 화면의 OS 표현은 일반적인 설명이며, 이 실습에 운영체제를 별도 설치해야 한다는 뜻은 아닙니다.' },
    { lesson: 9, page: 144, title: '외부 LED 세 개로 출력 확장하기', alt: '브레드보드의 외부 LED 세 개를 활용하는 강의 도전 과제', guide: '각 LED의 GPIO 핀·직렬 저항·GND 연결을 먼저 그리세요. 세 개 동시 출력과 하나씩 순차 출력의 코드 차이를 생각해보세요.' }

  ];
  const modal = document.createElement('dialog');
  modal.className = 'figure-modal';
  modal.setAttribute('aria-label', '강의 그림 크게 보기');
  modal.innerHTML = '<form method="dialog"><button aria-label="그림 닫기">닫기 ×</button></form><img alt=""><p></p>';
  document.body.append(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  for (const item of figures) {
    const figure = document.createElement('figure');
    figure.className = 'lecture-figure';
    const heading = document.createElement('h4');
    heading.textContent = item.title;
    const button = document.createElement('button');
    button.className = 'figure-open';
    button.setAttribute('aria-label', `${item.title} — 크게 보기`);
    const img = document.createElement('img');
    img.src = `private/day1/day1-p${item.page}.png`;
    img.alt = item.alt;
    img.loading = 'lazy';
    img.width = 1440;
    img.height = 810;
    button.append(img);
    const caption = document.createElement('figcaption');
    caption.textContent = `Day 1 PDF · p.${item.page} · 그림을 누르면 크게 볼 수 있어요`;
    const guide = document.createElement('p');
    guide.className = 'figure-guide';
    guide.textContent = item.guide;
    const fallback = document.createElement('p');
    fallback.className = 'figure-unavailable';
    fallback.hidden = true;
    fallback.textContent = `개인 학습용 PDF 그림이 이 환경에 없어요. 원본 PDF p.${item.page}를 참고하세요.`;
    img.addEventListener('error', () => { button.hidden = true; fallback.hidden = false; });
    button.addEventListener('click', () => {
      modal.querySelector('img').src = img.src;
      modal.querySelector('img').alt = item.alt;
      modal.querySelector('p').textContent = `${item.title} · PDF p.${item.page}`;
      modal.showModal();
    });
    figure.append(heading, button, fallback, caption, guide);
    lessons[item.lesson].insertBefore(figure, lessons[item.lesson].querySelector('fieldset'));
  }
  const mmio = document.createElement('figure');
  mmio.className = 'concept-figure';
  mmio.innerHTML = `<h4>같은 주소 접근, 다른 도착지</h4><div class="memory-map"><div class="map-cpu">CPU<small>C 코드의 포인터로 주소 접근</small></div><div class="map-paths"><div><span class="map-address">0x2000…</span><b>RAM</b><small>일반 데이터 읽기·쓰기</small></div><div class="map-io"><span class="map-address">0x4001080C</span><b>GPIOA ODR</b><small>출력 래치의 5번 비트 → PA5 → LD2</small></div></div></div><figcaption>학습용 보충 도식 · CPU가 접근하는 주소에 따라 RAM 또는 주변장치 레지스터로 전달됩니다.</figcaption><p class="figure-guide">GPIOA 클럭과 PA5 출력 설정을 마친 뒤, ODR의 5번 비트를 바꾸면 PA5의 출력 상태가 바뀝니다. GPIO 레지스터 주소는 일반 RAM 주소와 역할이 달라요.</p>`;
  lessons[11].insertBefore(mmio, lessons[11].querySelector('fieldset'));
})();
