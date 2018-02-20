import {Component, OnInit} from '@angular/core';
import {UserListService} from "./todo-list.service";
import {User} from "./todo";

@Component({
    selector: 'user-component',
    styleUrls: ['./todo.component.css'],
    templateUrl: 'todo.component.html'
})
export class UserComponent implements OnInit {
    public user: User = null;
    private id: string;

    constructor(private userListService: UserListService) {
        // this.users = this.userListService.getUsers();
    }

    private subscribeToServiceForId() {
        if (this.id) {
            this.userListService.getUserById(this.id).subscribe(
                user => this.user = user,
                err => {
                    console.log(err);
                }
            );
        }
    }

    setId(id: string) {
        this.id = id;
        this.subscribeToServiceForId();
    }

    ngOnInit(): void {
        this.subscribeToServiceForId();
    }
}
