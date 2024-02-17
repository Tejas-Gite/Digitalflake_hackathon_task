import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CategoryComponent } from './components/category/category.component';
import { ProductComponent } from './components/product/product.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { CanActiveGuard } from './guards/can-active.guard';
import { ChangesPasswordComponent } from './components/changes-password/changes-password.component';

const routes: Routes = [
  {
    path:"",
    redirectTo:"/login",
    pathMatch:"full"
  },
  {
    path:"login",
    component:LoginRegisterComponent
  },
  {
    path:"registration",
    component:RegistrationComponent
  },
  {
    path:"home",
    component:DashboardComponent,
    canActivate:[CanActiveGuard]
  }
  ,
  {
    path:"category",
    component:CategoryComponent,
    canActivate:[CanActiveGuard]
  }
  ,
  {
    path:"product",
    component:ProductComponent,
    canActivate:[CanActiveGuard]
  },
  {
    path:"forgot_password",
    component:ChangesPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
