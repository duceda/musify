import { Song } from 'src/app/models/Song';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private songPlayed$ = new Subject<Song>();

  constructor() { }

  public setSongPlayed(song: Song) {
    this.songPlayed$.next(song);
  }

  public getSongPlayed(): Observable<Song> {
    return this.songPlayed$.asObservable();
  }
}
