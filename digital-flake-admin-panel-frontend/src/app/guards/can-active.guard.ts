import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CanActiveGuard implements CanActivate {
  constructor( private router: Router, private toastr:ToastrService) {

  }
  role_valid: boolean = false;
  token: any;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if ((localStorage.getItem('token') || "").length != 0) {
      return true;
    }
    else {
      this.toastr.error("Please Login To Continue");
      this.router.navigate(['']);
      return false;
    }
  }
}
