import { inject, Injectable, signal } from '@angular/core';
import { ToastService } from './toast-service';
import { environment } from '../../environments/environment';
import { User } from '../../types/User';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Message } from '../../types/message';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private hubUrl = environment.hubUrl;
  private toast = inject(ToastService);
  public hubConnecion?: HubConnection;
  onlineUsers = signal<string[]>([]);
  createHubConnection(user: User) {
    this.hubConnecion = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();
    this.hubConnecion.start().catch((error) => console.log(error));
    this.hubConnecion.on('UserOnline', (userId) => {
      this.onlineUsers.update((users) => [...users, userId]);
    });
    this.hubConnecion.on('UserOffline', (userId) => {
      this.onlineUsers.update((users) => users.filter((x) => x != userId));
    });

    this.hubConnecion.on('GetOnlineUsers', (userIds) => {
      this.onlineUsers.set(userIds);
    });

    this.hubConnecion.on('NewMessageReceived', (message: Message) => {
      console.log(message.content);
      console.log(message);
      this.toast.info(
        message.senderDisplayName + ' has sent:\n' + message.content,
        10000,
        message.senderImageUrl,
        `/members/${message.senderId}/messages`
      );
    });
  }

  stopHubConnection() {
    if (this.hubConnecion?.state === HubConnectionState.Connected) {
      this.hubConnecion.stop().catch((error) => console.log(error));
    }
  }
}
