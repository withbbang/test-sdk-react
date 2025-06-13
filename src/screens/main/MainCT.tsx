import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import { useChangeHook, useSetToastPopupHook } from 'modules/customHooks';
import {
  handleConvertDateFormat,
  handleGenerateRandomText,
  handleGetDisplayType,
} from 'modules/utils';
import { useInitSdk } from 'modules/sdk';
import { BASE_URL, RETURN_URL } from 'modules/constants';
import { CustomWindow } from 'modules/types';
import MainPT from './MainPT';

function MainCT({}: MainCTProps): React.JSX.Element {
  const navigate = useNavigate();
  const useSetToastPopup = useSetToastPopupHook();
  const usePay = useInitSdk((transactionResult: boolean) =>
    handleCallback(transactionResult),
  );
  const { form, setForm, useChange } = useChangeHook({
    displayType: handleGetDisplayType(), // desktop, mobile 타입
    requestDate: '', // 요청 날짜
    transactionResult: '', // 결제 요청 결과 문구
    target: 'self',

    /* 사용자 입력 input */
    buyerName: '상남자', // 구매자명 required
    buyerPhone: '01012345678', // 구매자 핸드폰 번호
    buyerEmail: '', // 구매자 이메일
    goodsName: '마초남', // 상품명 required
    amount: 1000, // 결제금액 required

    /* 사용자 입력 select OR check */
    escrowTf: 'F', // 에스크로 여부 (에스크로 거래: T, 일반 거래: F)

    /* 자동 입력 input */
    paymethod: '', // 결제수단
    orderId: '', // 가맹점 주문번호 (unique한 값) required
    quotabase: '02:03:04:12', // 할부개월 (개월수를 ':' 로 구분된 값)
    currency: 'KRW', // 화폐 (KRW으로 고정)
    amountTaxFree: '',
    amountVat: '',
    returnUrl: '', // 인증결과를 받을 가맹점 URL
    returnNotyUrl: 'https://merchantsite.com/PayNoti', // 가상계좌 입금통보를 받을 가맹점 측 URL (가상계좌 서비스 미이용시 returnUrl 입력)
    closeUrl: BASE_URL || '', // PC결제 닫기 클릭 시 호출 URL (sample소스 참고)
    userAgent: '', // 유입환경 (결제고객의 브라우저 및 기기 환경 (SDK연동 시 사용 불필요)) required
    extraData: '',
    additionalPaymentInfo: '',
    sharedNoInterest: '',
    onlyCardCode: '',
    directCard: '',
    directQuota: '',
    directEasypay: '',
    icashExpireDate: '',
    productPeriod: '2024073120240831',
    cellType: '1',
    cellAbleCorp: '',
    cellDefaultCorp: '',
    iosAppScheme: '',
  });

  useEffect(() => {
    // TODO: return에 모든 팝업들 상태 초기화
    const customWindow = window as CustomWindow;

    customWindow.test = () => useSetToastPopup('test');

    return () => {
      delete customWindow.test;
    };
  }, []);

  /**
   * return url 채우기 | 지우기
   * @returns {void}
   */
  const handleFillClearReturnUrl = () =>
    setForm((prevState) => ({
      ...prevState,
      returnUrl: prevState.returnUrl ? '' : `${RETURN_URL}`,
    }));

  /**
   * 결제 요청 파라미터 체크
   */
  const handleCheckValid = () => {
    if (!form.buyerName) throw Error('구매자 이름 누락');
    if (!form.buyerPhone) throw Error('구매자 핸드폰 번호 누락');
    if (!form.goodsName) throw Error('상품명 누락');
    if (!+form.amount) throw Error('결제 금액 누락');
    if (+form.amount < 1000) throw Error('최소 결제 금액 미달');
  };

  /**
   * 결제 요청
   */
  const handlePay = (paymethod: string) => {
    try {
      handleCheckValid();
      setForm((prevState) => {
        const request = {
          ...prevState,
          orderId: `MACHO-${handleGenerateRandomText()}`,
          requestDate: handleConvertDateFormat(
            new Date(),
            'yyyy-mm-dd hh:mm:ss',
          ),
          paymethod,
        };

        usePay(request);

        return request;
      });
    } catch (e: any) {
      useSetToastPopup(e.message);
    }
  };

  /**
   * 결제 요청 결과 콜백
   * @param {boolean} transactionResult 결제 요청 결과
   */
  const handleCallback = (transactionResult: boolean) =>
    setForm((prevState) => ({
      ...prevState,
      transactionResult,
    }));

  const handleTestNpay = () => {
    const customWindow = window as CustomWindow;

    customWindow.ReactNativeWebView?.postMessage(
      JSON.stringify({
        type: 'NPAY',
        url: 'https://devmobile.paywelcome.co.kr/sspay.jsp',
      }),
    );
  };

  return (
    <MainPT
      form={form}
      onChange={useChange}
      onPay={handlePay}
      onFillClearReturnUrl={handleFillClearReturnUrl}
      onTestNpay={handleTestNpay}
    />
  );
}

interface MainCTProps extends CommonState {}

export default MainCT;
