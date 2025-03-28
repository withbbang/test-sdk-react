import React from 'react';
import styles from './InputTag.module.scss';

function InputTag({
  title,
  type,
  name,
  value,
  placeholder = '',
  required = false,
  onChange,
  onClick,
}: InputTagProps): React.JSX.Element {
  return (
    <div className={styles.wrap}>
      <span className={styles.title}>
        {title}
        {required && <strong className={styles.required}>&nbsp;*</strong>}
      </span>
      <div className={styles.inputWrap}>
        <input
          className={styles.input}
          placeholder={placeholder}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
        />

        {onClick && (
          <button className={styles.float} onClick={onClick}>
            {value ? 'Clear' : 'Auto'}
          </button>
        )}
      </div>
    </div>
  );
}

interface InputTagProps {
  title: string;
  type: string;
  name: string;
  value: string | number;
  // eslint-disable-next-line react/require-default-props
  placeholder?: string;
  // eslint-disable-next-line react/require-default-props
  required?: boolean;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  // eslint-disable-next-line react/require-default-props
  onClick?: () => void;
}

export default InputTag;
