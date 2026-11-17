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

오늘의 학습 설명은 MMIO와 GPIO 제어를 중심으로 재구성했습니다. 기존 Day 1 PDF의 보드·GPIO·버튼 내용과 그림 6개를 참고하고, 추가 통합 복습 노트(22쪽) p.2·4·9·18의 GPIO·출력 방식·버튼 상태 구분을 반영했습니다. 추가 PDF 원본은 이번 변경에서 업로드하지 않았습니다.

MMIO·volatile·주소·레지스터·비트 연산은 공식 문서를 바탕으로 보완했습니다. 학습 코드와 브라우저 모델은 이해를 위한 예시이며 실기 동작은 미검증입니다. 오늘 범위와 자료 관계는 [주제 구성](lecture-map.md)을 참고하세요.
