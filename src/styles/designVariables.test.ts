import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { designVariables } from './designVariables';

const read = (file: string) => readFileSync(resolve(__dirname, file), 'utf8');
const names = (source: string) => [...source.matchAll(/^\$(\w+):/gm)].map(([, name]) => name);

describe('designVariables', () => {
  it('exports every variable declared in design.variables.scss', () => {
    const declared = names(read('design.variables.scss')).sort();

    expect(Object.keys(designVariables).sort()).toEqual(declared);
  });

  it('resolves variables to the palette values', () => {
    expect(designVariables.inputFieldFocusBorderColor).toBe('#11175e');
    expect(designVariables.inputErrorTextColor).toBe('#b73b3b');
    expect(designVariables.fontFamilyBase).toContain('Assistant');
  });
});

describe('pallete.color.scss', () => {
  const source = read('pallete.color.scss');

  it('does not repeat a variable name', () => {
    const declared = names(source);

    expect(new Set(declared).size).toBe(declared.length);
  });

  it('does not repeat a hex value', () => {
    const hexes = [...source.matchAll(/:\s*(#[0-9a-f]{6});/gi)].map(([, hex]) => hex.toLowerCase());

    expect(new Set(hexes).size).toBe(hexes.length);
  });
});
