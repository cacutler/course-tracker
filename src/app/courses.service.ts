import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
interface HelloworldResponse {
  message?: string;
}
@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private firebaseFunctionUrl = 'https://on-request-example-tt4sagcvnq-uc.a.run.app';
  constructor(private http: HttpClient) {}
  getHelloWorld(): Observable<string> {
    // Specify response type as text, not the default JSON
    return this.http.get(this.firebaseFunctionUrl, { responseType: 'text' });
  }
}
