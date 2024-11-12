import { ChangeDetectorRef, Component, OnInit, Inject,PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TaskService } from '../task.service';

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

  constructor(private fb: FormBuilder, 
    private cdr: ChangeDetectorRef,
    private taskService: TaskService,  
    @Inject(PLATFORM_ID) private platformId: Object) {  // Initialize the form group
    this.tasksForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['Medium', Validators.required],
      dueDate: ['', Validators.required]
    });
  }
    // Load tasks from local storage when the component initializes
    ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
    this.taskService.getTasks().subscribe(
      (tasks) => {
        this.tasks = tasks;
        console.log('Loaded Tasks', this.tasks);
      },
      (error) => console.error('Error loading tasks',error)
    );
  
  }}

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
      this.taskService.addTask(newTask).subscribe({
        next: (task) => {
          this.tasks.push(task);
          this.saveTasks();  
          this.tasksForm.reset({priority:'Medium'});
          console.log("Task added: ", task);
        }, error: (error)=> console.error('error adding task ', error)
    }); 
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
    const updatedTask = {...this.tasks.find(t => t.id === taskId), ...updatedValues};
   this.taskService.updateTask(updatedTask).subscribe(
    (task) => {
      const taskIndex = this.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1)
        this.tasks[taskIndex] = task;
        this.saveTasks();
        this.editingTaskId = null; // Reset editing mode
        this.tasksForm.reset({ priority: 'Medium' });
        console.log("Task updated:", task);
    }, (error)=> console.error('Error updating task', error)
   );
  }
  

 //Overdue method
 isOverdue(dueDate:string): boolean {
  const today = new Date();
  const taskDueDate = new Date(dueDate);
  return taskDueDate < today && !this.tasks.find(task => task.dueDate === dueDate)?.isCompleted;
 }

  // Delete  task method
  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId).subscribe (
      () => {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks(); 
        this.cdr.detectChanges();
        console.log("Task deleted, current tasks:", this.tasks);
      }, (error) => console.error('Error deleting task', error)
  );
}

}