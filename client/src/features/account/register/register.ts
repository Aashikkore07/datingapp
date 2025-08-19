import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds, User } from '../../../types/User';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected creds = {} as RegisterCreds;
  private accountService = inject(AccountService);
  cancelRegister = output<boolean>();

  register() {
    this.accountService
      .register(this.creds)
      .subscribe({ next: (response) => console.log(response), error: (err) => console.log(err) });
  }

  cancel(value: boolean) {
    this.cancelRegister.emit(value);
    console.log('cancelled!');
  }
}
