/* STM32F103RB educational snippet; not a complete standalone firmware.
 * Requires an STM32CubeF1 project, CMSIS device header and HAL time base.
 * Call after HAL_Init() and SystemClock_Config(). Do not call before startup.
 * Written for this study; no lecture source code included.
 */
#include "stm32f1xx_hal.h"

void study_pa5_init(void)
{
    RCC->APB2ENR |= (1u << 2);
    (void)RCC->APB2ENR;
    GPIOA->BSRR = (1u << 21);
    GPIOA->CRL = (GPIOA->CRL & ~(0xFu << 20)) | (0x2u << 20);
}

void study_led_cycle(void)
{
    GPIOA->BSRR = (1u << 5);
    HAL_Delay(500);
    GPIOA->BSRR = (1u << 21);
    HAL_Delay(500);
}
