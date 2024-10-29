import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { TodolistComponent } from './todolist/todolist.component';
import { RegistrationpageComponent } from './registrationpage/registrationpage.component';
import { LogpageComponent } from './logpage/logpage.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,TodolistComponent, RegistrationpageComponent,LogpageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'todo_list_web';
}
