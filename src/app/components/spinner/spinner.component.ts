import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lita-spinner',
  template: `
  <section class="lita-spinner lita-section">
    <div fxLayout="col" fxLayoutAlign="center center" fxFill>
      <mat-spinner strokeWidth="3" diameter="50"></mat-spinner>
    </div>
  </section>
  `,
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
