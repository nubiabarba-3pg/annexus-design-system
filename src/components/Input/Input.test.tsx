import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Input } from './Input';

describe('Input', () => {
  // ── Rendering ────────────────────────────────────────────────────────
  it('renders with label and input', () => {
    render(<Input id="age" label="Current Age" />);
    expect(screen.getByLabelText('Current Age')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor / id', () => {
    render(<Input id="test-input" label="My Label" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'test-input');
    expect(screen.getByText('My Label').tagName).toBe('LABEL');
    expect(screen.getByText('My Label')).toHaveAttribute('for', 'test-input');
  });

  it('renders placeholder text', () => {
    render(<Input id="age" label="Age" placeholder="e.g. 45" />);
    expect(screen.getByPlaceholderText('e.g. 45')).toBeInTheDocument();
  });

  it('renders without label (no crash when label absent)', () => {
    render(<Input id="no-label" aria-label="Age" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  // ── Default state ─────────────────────────────────────────────────────
  it('does not have aria-invalid by default', () => {
    render(<Input id="age" label="Age" />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('does not render error span by default', () => {
    render(<Input id="age" label="Age" />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  // ── Error state ───────────────────────────────────────────────────────
  it('sets aria-invalid="true" when error prop is truthy', () => {
    render(<Input id="age" label="Age" error="Required" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby linking to error span id', () => {
    render(<Input id="age" label="Age" error="Required" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'age-error');
    expect(document.getElementById('age-error')).toHaveTextContent('Required');
  });

  it('renders error message text', () => {
    render(<Input id="age" label="Age" error="Age must be 18–99" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Age must be 18–99');
  });

  it('applies --error BEM class when error is truthy', () => {
    const { container } = render(<Input id="age" label="Age" error="Err" />);
    expect(container.firstChild).toHaveClass('annexus-input--error');
  });

  it('does NOT trigger error state when error is an empty string', () => {
    render(<Input id="age" label="Age" error="" />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  // ── Helper text ───────────────────────────────────────────────────────
  it('renders helperText when no error', () => {
    render(<Input id="rate" label="Rate" helperText="Annual percentage" />);
    expect(screen.getByText('Annual percentage')).toBeInTheDocument();
  });

  it('hides helperText when error is present (error takes priority)', () => {
    render(<Input id="rate" label="Rate" helperText="Annual %" error="Required" />);
    expect(screen.queryByText('Annual %')).toBeNull();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  // ── Disabled ──────────────────────────────────────────────────────────
  it('disabled prop sets native disabled on input', () => {
    render(<Input id="age" label="Age" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies --disabled BEM class when disabled', () => {
    const { container } = render(<Input id="age" label="Age" disabled />);
    expect(container.firstChild).toHaveClass('annexus-input--disabled');
  });

  // ── Interaction ───────────────────────────────────────────────────────
  it('fires onChange when user types', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Input id="age" label="Age" onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), '45');
    expect(onChange).toHaveBeenCalled();
  });

  // ── forwardRef ────────────────────────────────────────────────────────
  it('forwards ref to the underlying input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input id="age" label="Age" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  // ── Passthrough props ─────────────────────────────────────────────────
  it('passes type, min, max attributes to the input element', () => {
    render(<Input id="age" label="Age" type="number" min={18} max={99} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '18');
    expect(input).toHaveAttribute('max', '99');
  });
});
