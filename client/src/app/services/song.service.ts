import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ENDPOINTS } from 'src/config/endpoints';
import { Song } from '../models/Song';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  public url: string;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private httpOptionsWithAuth = {
    headers:
      new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.getToken()
      })
  };
  token: any;

  constructor(private _http: HttpClient) {
    this.url = ENDPOINTS.baseUrl;
  }

  public addSong(songToCreate: Song) {
    let params = songToCreate;
    let url = this.url + ENDPOINTS.SONG.song;

    return this._http.post(url, params, this.httpOptionsWithAuth);
  }

  public editSong(idSong: string, songToEdit: Song) {
    let params = songToEdit;
    let url = `${this.url}${ENDPOINTS.SONG.song}/${idSong}`;

    return this._http.put(url, params, this.httpOptionsWithAuth);
  }

  public getSong(idSong: string){
    let url = `${this.url}${ENDPOINTS.SONG.song}/${idSong}`;
    return this._http.get(url, this.httpOptionsWithAuth);
  }

  public getSongs(albumId: string){
    let url = `${this.url}${ENDPOINTS.SONG.songs}/${albumId}`;
    return this._http.get(url, this.httpOptionsWithAuth);
  }

  public deleteSong(idSong: string){
    let url = `${this.url}${ENDPOINTS.SONG.song}/${idSong}`;
    return this._http.delete(url, this.httpOptionsWithAuth);
  }

  public getToken() {
    let token = JSON.parse(localStorage.getItem('token'));

    if (token) {
      this.token = token;
    } else {
      this.token = null;
    }

    return this.token;
  }
}
