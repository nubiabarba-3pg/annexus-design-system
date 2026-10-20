export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  /** Visible label text — recommended; supply aria-label if omitted */
  label?: string;
  /** Stable id shared between <label htmlFor> and <input id> */
  id: string;
  /** Truthy string triggers Error state + aria-invalid + aria-describedby */
  error?: string;
  /** Supplementary hint text shown below field when no error is present */
  helperText?: string;
}
