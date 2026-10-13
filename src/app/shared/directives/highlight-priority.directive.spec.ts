import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { HighlightPriorityDirective } from './highlight-priority.directive';

@Component({
  imports: [HighlightPriorityDirective],
  template: `<div [appHighlightPriority]="completed()"></div>`,
})
class Host {
  readonly completed = signal(false);
}

describe('HighlightPriorityDirective', () => {
  it('changes the border color with the status', async () => {
    const fixture = TestBed.createComponent(Host);
    const div = fixture.nativeElement.querySelector('div') as HTMLElement;

    await fixture.whenStable();
    expect(div.style.borderLeft).toContain('var(--p-orange-500)');

    fixture.componentInstance.completed.set(true);
    await fixture.whenStable();
    expect(div.style.borderLeft).toContain('var(--p-green-500)');
  });
});
