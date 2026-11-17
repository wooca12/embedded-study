'use strict';
(() => {
  const lessons = document.querySelectorAll('.lesson');
  const figures = [{"lesson": 0, "page": 27, "title": "보드에서 실행부와 디버거 구분하기", "alt": "보드에서 실행부와 디버거 구분하기에 참고하는 PDF 그림", "guide": "위쪽 ST-LINK는 프로그램 전송·디버깅을 돕고 아래쪽 MCU가 내 코드를 실행합니다."}, {"lesson": 3, "page": 44, "title": "입력과 출력의 역할 구분하기", "alt": "입력과 출력의 역할 구분하기에 참고하는 PDF 그림", "guide": "GPIO 입력은 외부 상태를 읽고 출력은 신호를 내보냅니다. 오늘은 입력 PC13과 출력 PA5에 집중하세요."}, {"lesson": 5, "page": 76, "title": "출력 비트와 LED 연결하기", "alt": "출력 비트와 LED 연결하기에 참고하는 PDF 그림", "guide": "LD2에서 연결선을 따라 PA5를 찾아보세요. 출력 레지스터의 5번 비트가 이 핀을 제어합니다."}, {"lesson": 5, "page": 84, "title": "도구의 핀 설정과 코드 연결하기", "alt": "도구의 핀 설정과 코드 연결하기에 참고하는 PDF 그림", "guide": "PA5 핀과 LD2 라벨을 구분하세요. 설정 후 생성한 초기화 코드가 실제 GPIO 준비를 수행합니다."}, {"lesson": 6, "page": 102, "title": "버튼이 연결된 입력 핀 찾기", "alt": "버튼이 연결된 입력 핀 찾기에 참고하는 PDF 그림", "guide": "B1에서 PC13으로 이어지는 선을 확인하세요. 실제 눌림과 HIGH·LOW의 관계는 회로로 판단합니다."}, {"lesson": 6, "page": 108, "title": "입력 모드와 풀업 구분하기", "alt": "입력 모드와 풀업 구분하기에 참고하는 PDF 그림", "guide": "아래쪽 설정의 Input mode와 Pull-up을 보세요. 기본 HIGH 상태와 버튼을 누른 LOW 상태를 연결해 설명해보세요."}];
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
  mmio.innerHTML = `<h4>같은 주소 접근, 다른 도착지</h4><div class="memory-map"><div class="map-cpu">CPU<small>C 코드의 포인터로 주소 접근</small></div><div class="map-paths"><div><span class="map-address">0x2000…</span><b>RAM</b><small>일반 데이터 읽기·쓰기</small></div><div class="map-io"><span class="map-address">0x4001080C</span><b>GPIOA ODR</b><small>출력 래치의 5번 비트 → PA5 → LD2</small></div></div></div><figcaption>MMIO 이해 도식 · CPU가 접근하는 주소에 따라 RAM 또는 주변장치 레지스터로 전달됩니다.</figcaption><p class="figure-guide">GPIOA 클럭과 PA5 출력 설정을 마친 뒤, ODR의 5번 비트를 바꾸면 PA5의 출력 상태가 바뀝니다. GPIO 레지스터 주소는 일반 RAM 주소와 역할이 달라요.</p>`;
  lessons[2].insertBefore(mmio, lessons[2].querySelector('fieldset'));
})();
