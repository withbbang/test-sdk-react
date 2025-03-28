import React from 'react';
import { TypeKeyValueForm } from 'modules/types';
import styles from './RadioTag.module.scss';

function RadioTag({
  title,
  defaultValue,
  options,
  disabled = false,
  onChange,
}: RadioTagProps): React.JSX.Element {
  return (
    <div className={styles.wrap}>
      <fieldset className={styles.fieldset}>
        <span className={styles.title}>{title}</span>
        {options.map(({ value, label, name }: TypeKeyValueForm) => (
          <Radio
            key={`${value}`}
            value={`${value}`}
            label={`${label}`}
            name={`${name}`}
            defaultChecked={value === defaultValue}
            disabled={disabled}
            onChange={onChange}
          />
        ))}
      </fieldset>
    </div>
  );
}

interface RadioTagProps {
  title: string;
  defaultValue: string;
  options: Array<TypeKeyValueForm>;
  // eslint-disable-next-line react/require-default-props
  disabled?: boolean;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
}

function Radio({
  value,
  label,
  name,
  defaultChecked,
  disabled,
  onChange,
}: RadioProps): React.JSX.Element {
  return (
    <label htmlFor={`radio-${value}`}>
      <input
        type="radio"
        value={value}
        name={name}
        id={`radio-${value}`}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
      />
      {label}
    </label>
  );
}

interface RadioProps {
  value: number | string;
  label: string;
  name: string;
  defaultChecked: boolean;
  // eslint-disable-next-line react/require-default-props
  disabled?: boolean;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
}

export default RadioTag;
