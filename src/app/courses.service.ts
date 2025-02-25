import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
interface HelloworldResponse {
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private firebaseFunctionUrl = 'https://on-request-example-tt4sagcvnq-uc.a.run.app';
  constructor(private http: HttpClient) {}
  getHelloWorld(): Observable<HelloworldResponse> {
    return this.http.get<HelloworldResponse>(`${this.firebaseFunctionUrl}`);
  }
}
