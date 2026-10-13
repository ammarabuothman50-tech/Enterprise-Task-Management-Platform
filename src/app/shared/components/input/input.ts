import { Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { map, startWith, switchMap } from 'rxjs';

let nextId = 0;

@Component({
  selector: 'app-input',
  imports: [InputText, ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class AppInput {
  readonly control = input.required<FormControl<string | null>>();
  readonly label = input<string>();
  readonly type = input<'text' | 'email' | 'password' | 'number' | 'search'>('text');
  readonly placeholder = input('');
  readonly required = input(false);

  protected readonly id = `app-input-${nextId++}`;

  private readonly touchedAndEmpty = toSignal(
    toObservable(this.control).pipe(
      switchMap((control) =>
        control.events.pipe(
          startWith(null),
          map(() => control.touched && !control.value?.trim()),
        ),
      ),
    ),
  );

  protected readonly showRequired = computed(() => this.required() && !!this.touchedAndEmpty());
}
