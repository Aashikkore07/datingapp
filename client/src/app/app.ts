import { Component, inject } from '@angular/core';
import { Nav } from '../layout/nav/nav';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected router = inject(Router);

  // ngOnInit(): void {
  //   this.http.get('https://localhost:7272/api/members').subscribe({
  //     next: (response) => this.members.set(response),
  //     error: (err) => console.log(err),
  //     complete: () => console.log('Completed the http request'),
  //   });
  // }
}
