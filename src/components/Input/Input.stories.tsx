import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    error: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// Default state
export const Default: Story = {
  args: { id: 'input-default', label: 'Current Age', placeholder: 'e.g. 45' },
};

// Error state
export const ErrorState: Story = {
  args: {
    id: 'input-error',
    label: 'Current Age',
    placeholder: 'e.g. 45',
    error: 'Age must be between 18 and 99',
  },
};

// Disabled
export const Disabled: Story = {
  args: { id: 'input-disabled', label: 'Current Age', placeholder: 'e.g. 45', disabled: true },
};

// With helper text
export const WithHelperText: Story = {
  args: {
    id: 'input-helper',
    label: 'Inflation Rate',
    placeholder: 'e.g. 3.0',
    helperText: 'Annual percentage, typically 2–4%',
  },
};

// Figma variant — currentAge
export const CurrentAge: Story = {
  args: {
    id: 'current-age',
    label: 'Current Age',
    placeholder: '45',
    type: 'number',
    min: 18,
    max: 99,
  },
};

// Figma variant — currentMonthlyNeed
export const CurrentMonthlyNeed: Story = {
  args: {
    id: 'monthly-need',
    label: 'Current Monthly Need',
    placeholder: '$5,000',
    type: 'text',
    inputMode: 'numeric',
  },
};

// Figma variant — incomeStartAge
export const IncomeStartAge: Story = {
  args: {
    id: 'income-start-age',
    label: 'Income Start Age',
    placeholder: '65',
    type: 'number',
    min: 50,
    max: 85,
  },
};

// Figma variant — inflationRate
export const InflationRate: Story = {
  args: {
    id: 'inflation-rate',
    label: 'Inflation Rate',
    placeholder: '3.0%',
    type: 'text',
    inputMode: 'decimal',
  },
};
