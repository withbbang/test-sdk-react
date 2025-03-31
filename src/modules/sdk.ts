import { useCallback, useEffect, useState } from 'react';
import { CUSTOM_WINDOW } from './constants';
import { TypeKeyValueForm, WelcomePaymentsInstance } from './types';
import { useSetToastPopupHook } from './customHooks';
import { handleGenerateRandomText } from './utils';

/**
 * @description mid 목록
 */
export const M_ID_LIST = ['welcome221', 'wpaybill01', 'welcometst'];

/**
 * @description 결제 수단 목록
 */
export const PAY_METHOD_LIST: TypeKeyValueForm[] = [
  { label: '신용카드', value: 'card' },
  { label: '계좌이체', value: 'tcash' },
  { label: '가상계좌', value: 'icash' },
  { label: '휴대폰결제', value: 'cell' },
  { label: '문화상품권', value: 'cgft' },
];

/**
 * @description 에스크로 여부
 */
export const ESCROW_TF_LIST: TypeKeyValueForm[] = [
  { label: '일반', value: 'F' },
  { label: '에스크로', value: 'T' },
];

/**
 * @description 모바일 새창 여부
 */
export const TARGET_LIST: TypeKeyValueForm[] = [
  { label: '새창', value: 'blank' },
  { label: '현재 창', value: 'self' },
];

/**
 * @description 클라이언트 키
 */
export const CLIENT_KEY =
  '4382d19fd5ac3443a45fb370bcaab2656e688291ea47dc1148bc22f5f58d0e65';

/**
 * @description sdk 초기화 훅
 * @returns 결제창 호출 함수 반환
 */
export function useInitSdk(cb: Function) {
  const useSetToastPopup = useSetToastPopupHook();
  const [sdk, setSdk] = useState<WelcomePaymentsInstance | undefined>();

  useEffect(() => {
    setSdk(
      CUSTOM_WINDOW.WelcomePayments?.init({
        mid: M_ID_LIST[2],
        clientKey: CLIENT_KEY,
        mode: CUSTOM_WINDOW.WelcomePayments?.MODE.TEST,
      }),
    );
  }, []);

  const usePay = useCallback(
    async (request: any) => {
      console.debug('request: ', request);

      const viewOpt =
        request.displayType === 'mobile'
          ? { target: request.target }
          : undefined;

      try {
        const response = await sdk?.pay(
          {
            ...request,
            orderId: `MACHO-${handleGenerateRandomText()}`,
          },
          viewOpt,
        );

        if (request.returnUrl) {
          console.debug('결제창 호출 완료', response);
        } else {
          console.debug('결제 요청 완료', response);

          // TODO: 가맹점 서버에 결제 승인 로직 api
          useSetToastPopup('가맹점 서버에 결제 승인 로직 API START');
        }

        cb('결제 요청 성공');
      } catch (e: any) {
        console.error(e);
        useSetToastPopup('결제 요청 실패');
        cb(e.message);
      }
    },
    [sdk],
  );

  return usePay;
}
