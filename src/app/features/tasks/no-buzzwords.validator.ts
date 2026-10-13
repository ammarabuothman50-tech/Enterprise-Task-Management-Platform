import { ValidatorFn } from '@angular/forms';

const BUZZWORDS = ['synergy', 'leverage', 'paradigm', 'disrupt', 'blockchain'];

export const noBuzzwords: ValidatorFn = (control) => {
  const value = String(control.value ?? '').toLowerCase();
  const found = BUZZWORDS.find((word) => value.includes(word));
  return found ? { buzzword: found } : null;
};
