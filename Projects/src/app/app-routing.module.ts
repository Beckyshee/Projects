import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'login', component: LoginComponent}
  
  // {path: '', component: landingComponent},
//   {path: '', component: LoginComponent},
// {path: 'register', component: RegisterComponent},
// {path: 'admin', component: AdminDashboardComponent},
// {path: 'employee', component: EmployeeDashboardComponent},
// {path: 'admin/:employee_id', component: SingleEmployeeComponent},
// {path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
