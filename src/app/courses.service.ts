import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private degreeDataUrl = 'https://get-degree-data-tt4sagcvnq-uc.a.run.app'
  constructor(private http: HttpClient) {}
  getDegreeData(): Observable<any[]> {
    return this.http.get<any[]>(this.degreeDataUrl);
  }
  updateDegreeData(degreeId: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.degreeDataUrl}?id=${degreeId}`, data);
  }
}