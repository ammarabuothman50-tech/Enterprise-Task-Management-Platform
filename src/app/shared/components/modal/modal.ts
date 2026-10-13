import { Component, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  host: { '(document:keydown.escape)': 'close.emit()' },
})
export class Modal {
  readonly close = output();
}
