import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Member, Photo } from '../../../types/Member';
import { ActivatedRoute } from '@angular/router';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../types/User';
import { StarButton } from '../../../shared/star-button/star-button';
import { DeleteButton } from '../../../shared/delete-button/delete-button';

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  // protected photos$?: Observable<Photo[]>;
  protected photos = signal<Photo[]>([]);
  private route = inject(ActivatedRoute);
  protected loading = signal(false);
  protected accountService = inject(AccountService);
  constructor() {}
  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (!memberId) return;
    this.memberService.getMemberPhotos(memberId).subscribe({
      next: (photos) => this.photos.set(photos),
    });
  }
  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.updatePhoto(file).subscribe({
      next: (photo) => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update((photos) => [...photos, photo]);
        if (!this.memberService.member()?.imageUrl) this.setMainLocalPhoto(photo);
      },
      error: (err) => {
        console.log('Error uploading image: ', err);
        this.loading.set(false);
      },
    });
  }
  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        // const currentUser = this.accountService.currentUser();
        // if (currentUser) currentUser.imageUrl = photo.url;
        // this.accountService.setCurrentUser(currentUser as User);
        // const memberUser = this.memberService.member();

        // this.memberService.member.update(
        //   (previous) => ({ ...previous, imageUrl: photo.url } as Member)
        // );
        this.setMainLocalPhoto(photo);
      },
    });
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update((photo) => photo.filter((x) => x.id != photoId));
      },
    });
  }
  private setMainLocalPhoto(photo: Photo) {
    const currentUser = this.accountService.currentUser();
    if (currentUser) currentUser.imageUrl = photo.url;
    this.accountService.setCurrentUser(currentUser as User);
    const memberUser = this.memberService.member();

    this.memberService.member.update(
      (previous) => ({ ...previous, imageUrl: photo.url } as Member)
    );
  }
}
