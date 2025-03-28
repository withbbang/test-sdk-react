import React from 'react';
import { ESCROW_TF_LIST, PAY_METHOD_LIST, TARGET_LIST } from 'modules/sdk';
import { TypeKeyValueForm } from 'modules/types';
import InputTag from 'components/inputTag/InputTag';
import RadioTag from 'components/radioTag/RadioTag';
import styles from './Main.module.scss';

function MainPT({
  form,
  onChange,
  onPay,
  onFillReturnUrl,
}: MainPTProps): React.JSX.Element {
  return (
    <div className={styles.wrap}>
      <div className={styles.innerWrap}>
        <div className={styles.inputSection}>
          <div className={styles.inputField}>
            <p className={styles.title}>사용자 입력</p>
            <InputTag
              title="구매자명"
              type="text"
              name="buyerName"
              value={`${form.buyerName}`}
              required
              onChange={onChange}
            />
            <InputTag
              title="휴대폰 번호"
              type="tel"
              name="buyerPhone"
              value={`${form.buyerPhone}`}
              required
              onChange={onChange}
            />
            <InputTag
              title="상품명"
              type="text"
              name="goodsName"
              value={`${form.goodsName}`}
              required
              onChange={onChange}
            />
            <InputTag
              title="결제 금액"
              type="number"
              name="amount"
              value={+form.amount}
              required
              onChange={onChange}
            />
            <InputTag
              title="구매자 이메일"
              type="email"
              name="buyerEmail"
              value={`${form.buyerEmail}`}
              onChange={onChange}
            />
            <InputTag
              title="리다이렉트URL"
              type="text"
              name="returnUrl"
              value={`${form.returnUrl}`}
              onChange={onChange}
              onClick={onFillReturnUrl}
            />
            <RadioTag
              title="에스크로 여부"
              defaultValue={`${form.escrowTf}`}
              options={ESCROW_TF_LIST.map(
                ({ label, value }: TypeKeyValueForm) => ({
                  value,
                  label,
                  name: 'escrowTf',
                }),
              )}
              onChange={onChange}
            />
            <RadioTag
              title="모바일 타겟"
              defaultValue={`${form.target}`}
              options={TARGET_LIST.map(
                ({ label, value }: TypeKeyValueForm) => ({
                  value,
                  label,
                  name: 'target',
                }),
              )}
              disabled={form.displayType === 'desktop'}
              onChange={onChange}
            />
          </div>
          {form.requestDate ? (
            <div className={styles.paramsField}>
              <p>{form.requestDate}&nbsp;결제요청</p>
              <p>
                결제수단:&nbsp;
                {
                  PAY_METHOD_LIST.filter(
                    ({ value }: TypeKeyValueForm) => value === form.paymethod,
                  )[0].label
                }
              </p>
              <p>프로세스:&nbsp;{form.returnUrl ? 'Redirect' : 'Promise'}</p>
              <p>파라미터:</p>
              <br />
              {/* TODO: 파라미터 표시 */}
              {form.transactionResult ? (
                <p>결제결과:&nbsp;{form.transactionResult}</p>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className={styles.transactionSection}>
          <p className={styles.title}>Desktop Test</p>
          <p className={styles.subTitle}>
            {form.returnUrl ? 'Redirect' : 'Promise'}
          </p>
          <div className={styles.buttonBox}>
            {PAY_METHOD_LIST.map(({ label, value }: TypeKeyValueForm) => (
              <button
                key={`mobile-${value}`}
                onClick={() => onPay(`${value}`)}
                disabled={form.displayType === 'mobile'}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.transactionSection}>
          <p className={styles.title}>Mobile Test</p>
          <p className={styles.subTitle}>
            {form.returnUrl ? 'Redirect' : 'Promise'}
          </p>
          <div className={styles.buttonBox}>
            {PAY_METHOD_LIST.map(({ label, value }: TypeKeyValueForm) => (
              <button
                key={`desktop-${value}`}
                onClick={() => onPay(`${value}`)}
                disabled={
                  form.displayType === 'desktop' || !`${form.returnUrl}`
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MainPTProps {
  form: TypeKeyValueForm;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  onPay: (paymethod: string) => void;
  onFillReturnUrl: () => void;
}

export default MainPT;
