import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { PublisherService } from '../home/publishers/publisher.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private publisher: PublisherService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

      if (this.auth.authenticated) {

        return true;
        
      } else {

        this.router.navigate(['/']);
        return false;
      }
  }

}
