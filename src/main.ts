import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient,withFetch,withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import { LogpageComponent } from './app/logpage/logpage.component';
import { RegistrationpageComponent } from './app/registrationpage/registrationpage.component';
import { TodolistComponent } from './app/todolist/todolist.component';


 const appRoutes: Routes = [
    
  {path: 'login', component: LogpageComponent},
  {path: 'register', component: RegistrationpageComponent},
  {path: 'todo', component: TodolistComponent},
  {path:'', redirectTo: '/login',pathMatch: 'full' },
  {path:'**', redirectTo: '/login',pathMatch: 'full' },
];

bootstrapApplication(AppComponent,{
  providers:[
    provideHttpClient(withFetch()),
    provideRouter(appRoutes)
  ]
}). catch(err => console.error(err));
  
