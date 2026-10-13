import { Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { map, startWith, switchMap } from 'rxjs';

let nextId = 0;

@Component({
  selector: 'app-dropdown',
  imports: [Select, ReactiveFormsModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class AppDropdown {
  readonly control = input.required<FormControl<unknown>>();
  readonly options = input.required<unknown[]>();
  readonly optionLabel = input<string>();
  readonly optionValue = input<string>();
  readonly label = input<string>();
  readonly placeholder = input('Select');
  readonly required = input(false);

  protected readonly id = `app-dropdown-${nextId++}`;

  private readonly touchedAndEmpty = toSignal(
    toObservable(this.control).pipe(
      switchMap((control) =>
        control.events.pipe(
          startWith(null),
          map(() => control.touched && control.value == null),
        ),
      ),
    ),
  );

  protected readonly showRequired = computed(() => this.required() && !!this.touchedAndEmpty());
}
