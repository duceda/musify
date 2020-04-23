import { Injectable } from '@angular/core';
import { ENDPOINTS } from 'src/config/endpoints';
import { Artist } from '../models/Artist';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
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

  public addArtist(artistToCreate: Artist) {
    let params = artistToCreate;
    let url = this.url + ENDPOINTS.ARTIST.artist;

    return this._http.post(url, params, this.httpOptionsWithAuth);
  }

  public editArtist(idArtist: string, artistToEdit: Artist) {
    let params = artistToEdit;
    let url = `${this.url}${ENDPOINTS.ARTIST.artist}/${idArtist}`;

    return this._http.put(url, params, this.httpOptionsWithAuth);
  }

  public getArtist(idArtist: string){
    let url = `${this.url}${ENDPOINTS.ARTIST.artist}/${idArtist}`;
    return this._http.get(url, this.httpOptionsWithAuth);
  }

  public getArtists(page: number){
    let url = `${this.url}${ENDPOINTS.ARTIST.artists}/${page}`;
    return this._http.get(url, this.httpOptionsWithAuth);
  }

  public deleteArtist(idArtist: string){
    let url = `${this.url}${ENDPOINTS.ARTIST.artist}/${idArtist}`;
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
