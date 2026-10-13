import { Component } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-spinner',
  imports: [ProgressSpinner],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
})
export class AppSpinner {}
