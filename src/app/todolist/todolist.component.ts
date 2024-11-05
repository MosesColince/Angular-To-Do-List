import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


 //Initialise an array of required infromation
interface Task {
  id: number;
  title: string;
  description:string;
  priority: 'High'| 'Medium' |'Low';
  dueDate: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-todolist',
  standalone: true,
  imports: [RouterLink, CommonModule,ReactiveFormsModule, FormsModule],
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {
  tasksForm: FormGroup;
  tasks: Task[] = [];
  editingTaskId: number | null = null;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {  // Initialize the form group
    this.tasksForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['Medium', Validators.required],
      dueDate: ['', Validators.required]
    });
  }
    // Load tasks from local storage when the component initializes
    ngOnInit(): void {
    const storedTasks =  localStorage.getItem('tasks');
    this.tasks = storedTasks ? JSON.parse(storedTasks) :[];
    console.log('Loaded Tasks', this.tasks);
  }

  // Method to handle adding tasks
  addTask() {
    if (this.tasksForm.valid) {
      const formValues = this.tasksForm.value;

      const newTask: Task = { 
      id: Date.now(),
      title: formValues.title,
      description:formValues.description,
      priority: formValues.priority,
      dueDate: formValues.dueDate,
      isCompleted: false
      };
      console.log('New task:',newTask);
      
      // Push new task to the tasks array
      this.tasks.push(newTask);
      this.saveTasks();  
      this.tasksForm.reset({priority:'Medium'});
// Reset the form after adding
      console.log("Task added: ", newTask);
    } else {
      console.log("Form is invalid: ", this.tasksForm.errors);
    }
  }
toggleTaskCompletion(task: Task ) {
  task.isCompleted = !task.isCompleted;
  this.saveTasks();
  this.cdr.detectChanges();
}
  // Save tasks to local storage method
 private saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    console.log("Tasks saved:", this.tasks);
  }

  // Method to return color based on priority
  getPriorityColor(priority: string) {
    switch (priority) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Low':
        return 'green';
      default:
        return 'black';
    }
  }

  // Edit task 
  editTask(task: Task) {
      this.tasksForm.setValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate
    });
    this.editingTaskId = task.id;
  }

  updateTask(taskId: number, updatedValues: any) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedValues };
      this.saveTasks();
      console.log("Task updated:", this.tasks[taskIndex]);
      this.editingTaskId = null; // Reset editing mode
      this.tasksForm.reset({ priority: 'Medium' });
    }
  }

 //Overdue method
 isOverdue(dueDate:string): boolean {
  const today = new Date();
  const taskDueDate = new Date(dueDate);
  return taskDueDate < today && !this.tasks.find(task => task.dueDate === dueDate)?.isCompleted;
 }

  // Delete  task method
  deleteTask(taskid: number) {
    this.tasks = this.tasks.filter(task => task.id !== taskid);
    this.saveTasks(); 
    this.cdr.detectChanges();
    console.log("Task deleted, current tasks:", this.tasks);
  }
}

