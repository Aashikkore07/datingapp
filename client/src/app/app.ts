import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  // ngOnInit(): void {
  //   this.http.get('https://localhost:7272/api/members').subscribe({
  //     next: (response) => this.members.set(response),
  //     error: (err) => console.log(err),
  //     complete: () => console.log('Completed the http request'),
  //   });
  // }
  async ngOnInit() {
    this.members.set(await this.getMembers());
    console.log(this.members().length);
  }

  async getMembers() {
    try {
      return lastValueFrom(this.http.get('https://localhost:7272/api/members'));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private http = inject(HttpClient);
  protected readonly title = signal('DatingApp');
  protected members = signal<any>([]);
}
