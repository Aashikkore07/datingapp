import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';
import { Member } from '../../../types/Member';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';
import { MemberService } from '../../../core/services/member-service';
import { PresenceService } from '../../../core/services/presence-service';
import { LikesService } from '../../../core/services/likes-service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css',
})
export class MemberDetailed implements OnInit {
  private route = inject(ActivatedRoute);
  protected memberService = inject(MemberService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  protected presenceService = inject(PresenceService);
  protected title = signal<string | undefined>('Profile');
  protected routeId = signal<string | null>(null);
  protected likesService = inject(LikesService);
  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.routeId();
  });
  protected isOnline = computed(() => this.presenceService.onlineUsers().includes(this.routeId()!));
  protected hasLiked = computed(() => this.likesService.likeIds().includes(this.routeId()!));

  ngOnInit(): void {
    this.title.set(this.route.firstChild?.snapshot?.title);
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe({
      next: () => this.title.set(this.route.firstChild?.snapshot?.title),
    });
    this.route.paramMap.subscribe((params) => {
      this.routeId.set(params.get('id'));
    });
  }
}
