import { useCallback, useEffect, useState } from 'react';
import { APPROVE_URL, CUSTOM_WINDOW } from './constants';
import { TypeKeyValueForm, WelcomePaymentsInstance } from './types';
import { useSetToastPopupHook } from './customHooks';
import { postAPI } from './apis';

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
  { label: '현재 창', value: 'self' },
  { label: '새창', value: 'blank' },
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
        const response = await sdk?.pay({ ...request }, viewOpt);

        if (request.returnUrl) {
          console.debug('결제창 호출 완료', response);
          cb('결제 요청 성공');
        } else {
          console.debug('결제 요청 완료', response);
          await postAPI(`${APPROVE_URL}`, response); // 승인 요청
          console.debug('결제 승인 완료', response);
          cb('결제 승인 완료');
        }
      } catch (e: any) {
        console.error(e);
        useSetToastPopup('결제 실패');
        cb(e.message);
      }
    },
    [sdk],
  );

  return usePay;
}
