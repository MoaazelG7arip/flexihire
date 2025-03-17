import { inject } from "@angular/core";
import { Router } from "@angular/router";


export const CanActivateAuth = () => {
  let user = sessionStorage.getItem('user')
  let router: Router = inject(Router);
  if(user){
    router.navigate(['/page/jobs']);
    return false;
  } else {
    return true;
  }
}
export const CanActivateAuthChild = () => {
  return CanActivateAuth();
}

export const CanActivateMain = () => {
  let user = sessionStorage.getItem('user')
  let router: Router = inject(Router);
  if(user){
    return true;
  } else {
    router.navigate(['/auth/welcome']);
    return false;
  }
}
export const CanActivateMainChild = () => {
  return CanActivateMain();
}