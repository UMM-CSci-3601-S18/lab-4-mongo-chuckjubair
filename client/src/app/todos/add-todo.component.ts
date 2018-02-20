import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";


@Component({
    selector: 'add-todo.component',
    templateUrl: 'add-todo.component.html',
})
export class AddTodoComponent {
    public newTodoID:string;
    public newTodoOwner:string;
    public newTodoStatus: string;
    public newTodoCategory: string;
    public newTodoBody: string;
    private todoAddSuccess : Boolean = false;

    public todos: Todo[];

    constructor(public todoListService: TodoListService,
        public dialogRef: MatDialogRef<AddTodoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    addNewTodo(id: string, owner: string, status : string, category : string, body : string) : void{

        //Here we clear all the fields, there's probably a better way
        //of doing this could be with forms or something else
        this.newTodoID = null;
        this.newTodoOwner = null;
        this.newTodoStatus = null;
        this.newTodoCategory = null;
        this.newTodoBody = null;

        this.todoListService.addNewTodo(id, owner, status, category, body).subscribe(
            succeeded => {
                this.todoAddSuccess = succeeded;
                // Once we added a new Todo, refresh our todo list.
                // There is a more efficient method where we request for
                // this new todo from the server and add it to todos, but
                // for this lab it's not necessary
                //this.todoListComponent.refreshTodos();
            });
    }

}
