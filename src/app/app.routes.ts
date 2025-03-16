import { Routes } from '@angular/router';
import { CanActivateAuth, CanActivateAuthChild, CanActivateMain, CanActivateMainChild } from './auth.guard';




export const routes: Routes = [
    {path: '', redirectTo: 'auth/welcome', pathMatch: 'full'},
    {path: 'auth', loadComponent: ()=> import('./auth/auth.component').then(m=>m.AuthComponent),
        canActivate:[CanActivateAuth], canActivateChild: [CanActivateAuthChild]
        ,children:[
        {path: 'welcome', loadComponent: ()=> import('./auth/welcome-log/welcome-log.component').then(m=>m.WelcomeLogComponent)},
        {path: 'login', loadComponent: ()=> import('./auth/login/login.component').then(m=>m.LoginComponent)},
        {path: 'register', loadComponent: ()=> import('./auth/register/register.component').then(m=>m.RegisterComponent)},
        {path: 'forget-password', loadComponent: ()=> import('./auth/forget-password/forget-password.component').then(m=>m.ForgetPasswordComponent)},
        {path: 'reset-password', loadComponent: ()=> import('./auth/reset-password/reset-password.component').then(m=>m.ResetPasswordComponent)},
    ]},
    {path: 'page', loadComponent: ()=> import('./page/page.component').then(m=>m.PageComponent),
        canActivate:[CanActivateMain], canActivateChild: [CanActivateMainChild]
        ,children:[
        {path: 'account', loadComponent: ()=> import('./page/account/account.component').then(m=>m.AccountComponent)},
        {path: 'companies', loadComponent: ()=>import('./page/companies/companies.component').then(m=>m.CompaniesComponent)},
        {path: 'companies/:id', loadComponent: ()=>import('./page/companies/company/company.component').then(m=>m.CompanyComponent)},
        {path: 'jobs', loadComponent: ()=>import('./page/jobs/jobs.component').then(m=>m.JobsComponent)},
        {path: 'jobs/:id', loadComponent: ()=>import('./page/jobs/job/job.component').then(m=>m.JobComponent)},
        {path: 'users', loadComponent: ()=>import('./page/users/users.component').then(m=>m.UsersComponent)},
        {path: 'users/:id', loadComponent: ()=>import('./page/users/user/user.component').then(m=>m.UserComponent)},
 
    ]},
];
