import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css',
})
export class TestErrors {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  validationErrors = signal<string[]>([]);

  get404Error() {
    this.http.get(this.baseUrl + 'buggy/not-found').subscribe({
      next: (Response) => console.log(Response),
      error: (err) => console.log(err),
    });
  }

  get500Error() {
    this.http.get(this.baseUrl + 'buggy/server-error').subscribe({
      next: (Response) => console.log(Response),
      error: (err) => console.log(err),
    });
  }
  get400Error() {
    this.http.get(this.baseUrl + 'buggy/bad-request').subscribe({
      next: (Response) => console.log(Response),
      error: (err) => {
        console.log(err);
      },
    });
  }
  get401Error() {
    this.http.get(this.baseUrl + 'buggy/auth').subscribe({
      next: (Response) => console.log(Response),
      error: (err) => console.log(err),
    });
  }

  get400ValiddationError() {
    this.http.post(this.baseUrl + 'account/register', {}).subscribe({
      next: (Response) => console.log(Response),
      error: (err) => {
        console.log(err);
        this.validationErrors.set(err);
      },
    });
  }
}
