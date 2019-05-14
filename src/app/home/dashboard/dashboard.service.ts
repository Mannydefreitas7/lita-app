import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  loading: boolean = true;

  constructor(public router: Router, public location: Location) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }
        case event instanceof NavigationCancel:
        case event instanceof NavigationError:
        case event instanceof NavigationEnd: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  public goBack() {
    this.location.back();
  }
}
