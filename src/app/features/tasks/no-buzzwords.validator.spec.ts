import { FormControl } from '@angular/forms';

import { noBuzzwords } from './no-buzzwords.validator';

describe('noBuzzwords', () => {
  it('accepts normal titles', () => {
    expect(noBuzzwords(new FormControl('Fix login bug'))).toBeNull();
  });

  it('rejects titles with a buzzword, ignoring case', () => {
    expect(noBuzzwords(new FormControl('Improve team SYNERGY'))).toEqual({ buzzword: 'synergy' });
  });

  it('accepts empty values', () => {
    expect(noBuzzwords(new FormControl(null))).toBeNull();
  });
});
