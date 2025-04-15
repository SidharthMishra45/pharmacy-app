import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../../../services/user.service';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent {
  users: User[] = [];
  newUser: User = { userId: '', name: '', email: '', role: 'Doctor' };
  editMode: boolean = false;
  showForm: boolean = false;
  selectedUserId: string = '';

  constructor(private userService: UserService) {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }

  addOrUpdateUser() {
    if (this.editMode) {
      this.userService.updateUser(this.selectedUserId, this.newUser).subscribe(() => {
        this.loadUsers();
        this.resetForm();
      });
    } else {
      this.userService.addUser(this.newUser).subscribe(() => {
        this.loadUsers();
        this.resetForm();
      });
    }
  }

  editUser(user: User) {
    this.editMode = true;
    this.showForm = true;
    this.selectedUserId = user.userId;
    this.newUser = { ...user };
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(() => this.loadUsers());
  }

  resetForm() {
    this.newUser = { userId: '', name: '', email: '', role: 'Doctor' };
    this.editMode = false;
    this.showForm = false;
  }
}
