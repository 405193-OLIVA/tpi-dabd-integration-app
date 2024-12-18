import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { toCamelCase } from '../utils/owner-helper';
import { environment } from '../../../environments/environment';

export interface Notice {
  id?: number;
  title: string;
  content: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  is_active: boolean;
  date: string;
}

interface NoticePost {
  id?: number;
  title: string;
  content: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  is_active: boolean;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  date?: string;
  isVisible: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class NoticeService {
  private http = inject(HttpClient);

  host: string = `${environment.production ? `${environment.apis.users}` : `${environment.apis.users}`}notices`;

  private transformNoticeToAnnouncement(notice: Notice): Announcement {
    return {
      id: notice.id!,
      title: notice.title,
      content: notice.content,
      priority: notice.priority.toLowerCase() as 'high' | 'medium' | 'low',
      date: notice.date,
      isVisible: notice.is_active
    };
  }

  getAllNotices(
    page: number = 0,
    size: number = 5,
    isActive?: boolean
  ): Observable<PaginatedResponse<Announcement>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (isActive !== undefined) {
      params = params.set('is_active', isActive.toString());
    }

    return this.http.get<PaginatedResponse<any>>(this.host, { params }).pipe(
      map((response) => {
        const transformedNotices = response.content.map((notice: any) =>
          this.transformNoticeToAnnouncement(notice)
        );
        return {
          ...response,
          content: transformedNotices,
        };
      })
    );
  }

  createNotice(notice: Notice, userId: number): Observable<Notice> {
    const headers = new HttpHeaders({
      'x-user-id': userId.toString(),
      'accept': '*/*',
      'Content-Type': 'application/json'
    });

    const backendNotice: NoticePost = {
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      is_active: notice.is_active
    };

    return this.http.post<Notice>(this.host, backendNotice, { headers }).pipe(
      map(response => toCamelCase(response))
    );
  }

  updateNotice(notice: Notice, userId: number): Observable<Notice> {
    const headers = new HttpHeaders({
      'x-user-id': userId.toString(),
      'accept': '*/*',
      'Content-Type': 'application/json'
    });

    const backendNotice: NoticePost = {
      id: notice.id,
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      is_active: notice.is_active
    };

    return this.http.put<Notice>(this.host, backendNotice, { headers }).pipe(
      map(response => toCamelCase(response))
    );
  }

  softDeleteNotice(id: number, userId: number): Observable<any> {
    const headers = new HttpHeaders({
      'x-user-id': userId.toString(),
      'accept': '*/*'
    });

    const params = new HttpParams().set('id', id.toString());

    return this.http.patch<any>(this.host, null, { headers, params });
  }

  getNoticeById(id: number): Observable<Notice> {
    return this.http.get<Notice>(`${this.host}/${id}`).pipe(
      map(response => toCamelCase(response))
    );
  }
}
