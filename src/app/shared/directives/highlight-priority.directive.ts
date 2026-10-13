import { computed, Directive, input } from '@angular/core';

@Directive({
  selector: '[appHighlightPriority]',
  host: { '[style.border-left]': 'border()' },
})
export class HighlightPriorityDirective {
  readonly completed = input.required<boolean>({ alias: 'appHighlightPriority' });

  protected readonly border = computed(
    () => `4px solid ${this.completed() ? 'var(--p-green-500)' : 'var(--p-orange-500)'}`,
  );
}
