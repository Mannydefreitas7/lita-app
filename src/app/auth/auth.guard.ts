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
      console.log(this.auth.authenticated)

      // if (this.auth.authenticated) { 
      //   this.auth.stateChanged();
      //   return true 
      // } 

      // this.publisher.snackBar.open('You don\'t have access to this site','', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' })
      // this.router.navigate(['/'])
      // return false;
      return true
  }

}
