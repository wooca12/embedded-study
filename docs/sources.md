# 기술 출처와 범위

확인일: 2026-11-17

- ST RM0008: Memory and bus architecture, RCC_APB2ENR, GPIO CRL/CRH/IDR/ODR/BSRR.
  https://www.st.com/resource/en/reference_manual/rm0008-stm32f101xx-stm32f102xx-stm32f103xx-stm32f105xx-and-stm32f107xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf
- ST UM1724: NUCLEO-F103RB, ST-LINK/V2-1, LD2 PA5, B1 PC13, connector and board configuration.
  https://www.st.com/resource/en/user_manual/dm00105823-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf
- ST STM32F1 HAL GPIO implementation: initialization, WritePin, ReadPin, TogglePin.
  https://github.com/STMicroelectronics/stm32f1xx-hal-driver/blob/master/Src/stm32f1xx_hal_gpio.c
- ST CMSIS F103xB device definitions: peripheral addresses, register structures and RCC/GPIO masks.
  https://github.com/STMicroelectronics/cmsis-device-f1/blob/master/Include/stm32f103xb.h

학습 설명은 공개 사양에 기반해 새로 작성했습니다. 사용자 요청으로 제공된 강의 PDF p.27, 36, 44, 51, 76, 84, 102, 108, 122, 125, 137, 144을 개인 로컬 학습용 그림으로 추가했습니다. 이미지와 원본 PDF는 사용자 요청에 따라 `web/private/day1/`에 두고 스터디용 비공개 저장소에 포함합니다. 외부 배포나 블로그 글 내보내기에는 포함하지 않습니다. MMIO 도식은 별도로 작성한 보충 설명입니다.

이번 회차는 PDF Day 1의 7개 장을 요약하며 UART·표준 입출력·도전 과제까지 다룹니다. MMIO와 C 포인터는 보충 학습으로 분리합니다. 자세한 대응은 lecture-map.md를 참고하세요. 브라우저 비트 연습은 단순화한 모델입니다. C 예제는 실기 빌드·동작 미검증이며 생성한 STM32CubeF1 프로젝트와 올바른 초기화가 필요합니다.

- ST STM32F1 HAL UART 인터페이스·구현: https://github.com/STMicroelectronics/stm32f1xx-hal-driver/blob/master/Inc/stm32f1xx_hal_uart.h
