import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private degreeDataSubject = new BehaviorSubject<any>(null);
  public degreeData$ = this.degreeDataSubject.asObservable();
  private selectedTrackSubject = new BehaviorSubject<string>('');
  public selectedTrack$ = this.selectedTrackSubject.asObservable();
  updateDegreeData(data: any) {
    this.degreeDataSubject.next(data);
    if (data && data.length > 0 && data[0].Tracks && data[0].Tracks.length > 0) {
      this.selectedTrackSubject.next(data[0].Tracks[0]);
    }
  }
  updateSelectedTrack(track: string) {
    this.selectedTrackSubject.next(track);
  }
  getCurrentTrack(): string {
    return this.selectedTrackSubject.getValue();
  }
}