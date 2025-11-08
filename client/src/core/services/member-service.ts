import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableMember, Member, MemberParams, Photo } from '../../types/Member';
import { AccountService } from './account-service';
import { tap } from 'rxjs';
import { PaginatedResult } from '../../types/Pagination';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  editMode = signal(false);
  member = signal<Member | null>(null);

  getMembers(memberParams: MemberParams) {
    let params = new HttpParams();

    params = params.append('pageNumber', memberParams.pageNumber);
    params = params.append('pageSize', memberParams.pageSize);
    params = params.append('minAge', memberParams.minAge);
    params = params.append('maxAge', memberParams.maxAge);
    params = params.append('orderBy', memberParams.orderBy);
    if (memberParams.gender) params = params.append('gender', memberParams.gender);
    return this.http.get<PaginatedResult<Member>>(this.baseUrl + 'members', { params }).pipe(
      tap(() => {
        localStorage.setItem('filters', JSON.stringify(memberParams));
      })
    );
  }
  getMemberById(id: string) {
    return this.http
      .get<Member>(this.baseUrl + 'members/' + id)
      .pipe(tap((member) => this.member.set(member)));
  }
  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }

  updateMember(member: EditableMember) {
    return this.http.put(this.baseUrl + 'members/', member);
  }

  updatePhoto(file: File) {
    const formdata = new FormData();
    formdata.append('file', file);
    return this.http.post<Photo>(this.baseUrl + 'members/add-photo', formdata);
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + 'members/set-main-photo/' + photo.id, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'members/delete-photo/' + photoId);
  }
  // private accountService = inject(AccountService);
  // private getHttpOptions() {
  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + this.accountService.currentUser()?.token,
  //     }),
  //   };
  // }
}
