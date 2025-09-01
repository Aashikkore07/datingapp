import { Component, inject } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Photo } from '../../../types/Member';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-photos',
  imports: [AsyncPipe],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos {
  private memberService = inject(MemberService);
  protected photos$?: Observable<Photo[]>;
  private route = inject(ActivatedRoute);
  constructor() {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (!memberId) return;
    this.photos$ = this.memberService.getMemberPhotos(memberId);
  }
  get photoMocks() {
    return Array.from({ length: 20 }, () => ({
      url: 'user.png',
    }));
  }
}
