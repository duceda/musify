import { Injectable } from '@angular/core';
import { ENDPOINTS } from 'src/config/endpoints';
import { Artist } from '../models/Artist';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Album } from '../models/Album';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
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

  public addAlbum(albumToCreate: Album) {
    let params = albumToCreate;
    let url = this.url + ENDPOINTS.ALBUM.album;

    return this._http.post(url, params, this.httpOptionsWithAuth);
  }

  public editAlbum(idAlbum: string, albumToEdit: Album) {
    let params = albumToEdit;
    let url = `${this.url}${ENDPOINTS.ALBUM.album}/${idAlbum}`;

    return this._http.put(url, params, this.httpOptionsWithAuth);
  }

  public getAlbum(idAlbum: string){
    let url = `${this.url}${ENDPOINTS.ALBUM.album}/${idAlbum}`;
    return this._http.get(url, this.httpOptionsWithAuth);
  }

  public getAlbums(artistId: string){
    let url = `${this.url}${ENDPOINTS.ALBUM.albums}/${artistId}`;
    return this._http.get(url, this.httpOptionsWithAuth);
  }

  public deleteAlbum(idAlbum: string){
    let url = `${this.url}${ENDPOINTS.ALBUM.album}/${idAlbum}`;
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
