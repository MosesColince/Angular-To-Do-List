import { Routes } from '@angular/router';
import { LogpageComponent } from './logpage/logpage.component';
import { TodolistComponent } from './todolist/todolist.component';
import { RegistrationpageComponent } from './registrationpage/registrationpage.component';

export const routes: Routes = [
    
    {path: 'login', component: LogpageComponent},
    {path: 'register', component: RegistrationpageComponent},
    {path: 'todo', component: TodolistComponent},
    {path:'', redirectTo: '/login',pathMatch: 'full' },
    {path:'**', redirectTo: '/login',pathMatch: 'full' },
];
