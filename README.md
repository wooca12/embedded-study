# Embedded Study

C 기초 문법을 아는 입문자를 위한 임베디드 학습 웹입니다.

## 사이트 링크

**https://wooca12.github.io/embedded-study/**

설치나 로그인 없이 링크를 열어 예습·실습 안내·복습·발표 연습·블로그 정리를 사용할 수 있습니다. 챗봇이나 API 연결은 없으며 개인 개념 정리를 직접 작성할 수 있습니다.

## Day 01

NUCLEO-F103RB / STM32F103RB. PDF의 7개 장을 강의 예습 10단계로 정리했습니다. 개요 → 개발환경 → 클럭·핀·프로젝트 설정 → LED → 버튼 → UART → 표준 입출력 → 도전 과제 순서입니다. C 포인터·MMIO·레지스터는 보충 2단계로 구분합니다.

- [강의 대응표](docs/lecture-map.md)
- [Mac 설치 안내](docs/mac-setup.md)
- [기술 출처](docs/sources.md)
- [MMIO 보충 코드 안내](studies/01-mmio-gpio/README.md)
- [Day 1 강의 PDF](web/private/day1/day1-firmware.pdf)

## 개인 기록

진도·이해도·실습 메모·블로그 초안·개인 개념 정리는 각자의 브라우저에 자동 저장됩니다. 서버로 보내거나 다른 멤버와 자동 동기화하지 않습니다. JSON 백업·복원과 Markdown 내려받기로 보관하세요. 브라우저 데이터를 지우기 전에 백업해야 합니다.

기존 localhost 기록과 공유 사이트의 기록은 서로 별개입니다. 옮기려면 기존 페이지에서 ‘전체 학습 기록 백업’을 내려받고 공유 사이트에서 불러오세요. 이전 버전의 대화 기록도 백업 데이터에는 보존하지만 챗봇 화면은 제공하지 않습니다.

## 로컬에서 실행하려면

추가 패키지 없이 Python 3으로 실행할 수 있습니다.

```sh
git clone https://github.com/wooca12/embedded-study.git
cd embedded-study
python3 server.py
```

http://127.0.0.1:8000 을 엽니다. 로컬 실행은 선택 사항입니다.

## 배포

main 브랜치에 push하면 GitHub Actions가 `web/`만 GitHub Pages에 배포합니다. Python 서버·환경 변수·API 키가 필요하지 않습니다. 학습 기록 백업·.env·임시 파일은 Git에서 제외합니다. GitHub 업로드와 Velog 글 발행은 직접 진행합니다.

학습 코드는 실제 보드 동작 미검증입니다.
