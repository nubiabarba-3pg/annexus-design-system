export function devWarning(condition: boolean, component: string, message: string): void {
  if (!condition && process.env.NODE_ENV !== 'production') {
    console.warn(`[${component}] ${message}`);
  }
}
