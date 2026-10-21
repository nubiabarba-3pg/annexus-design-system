import { forwardRef } from 'react';
import clsx from 'clsx';
import type { InputProps } from './Input.types';
import './Input.scss';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id, error, helperText, disabled, className, ...rest },
  ref,
) {
  const hasError = Boolean(error && error.length > 0);
  const errorId = `${id}-error`;

  return (
    <div
      className={clsx('annexus-input', {
        'annexus-input--error': hasError,
        'annexus-input--disabled': disabled,
      })}
    >
      {label && (
        <label className="annexus-input__label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={clsx('annexus-input__field', className)}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? errorId : undefined}
        {...rest}
      />
      {hasError && (
        <span id={errorId} className="annexus-input__error" role="alert">
          {error}
        </span>
      )}
      {!hasError && helperText && <span className="annexus-input__helper">{helperText}</span>}
    </div>
  );
});

Input.displayName = 'Input';
