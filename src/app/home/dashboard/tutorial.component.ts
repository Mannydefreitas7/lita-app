import { Component, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-tutorial',
  template: `
    <p>
      tutorial works!
    </p>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class TutorialComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
