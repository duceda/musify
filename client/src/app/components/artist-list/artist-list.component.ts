import { HttpClient } from '@angular/common/http';
import { ArtistService } from './../../services/artist.service';
import { ENDPOINTS } from 'src/config/endpoints';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Artist } from 'src/app/models/Artist';
import { User } from 'src/app/models/User';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css']
})
export class ArtistListComponent implements OnInit {
  public titulo: string;
  public artists: Array<Artist>;
  public identity: User;
  public token: string;
  public url: string;
  public nextPage: number;
  public prevPage: number;
  public alertMessage: string;
  public getImageArtistUrl: string;
  public urlBase: string;
  public confirmado: string;

  constructor(
    private routeService: ActivatedRoute,
    private _route: Router,
    private userService: UserService,
    private artistService: ArtistService
  ) {
    this.titulo = 'Artistas';
    this.nextPage = 1;
    this.prevPage = 1;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = ENDPOINTS.baseUrl;
    this.urlBase = this.getUrlBaseWithoutParams();
    this.getImageArtistUrl = `${this.artistService.url}${ENDPOINTS.ARTIST.getImageArtist}/`;
  }

  ngOnInit(): void {
    this.getArtists();
  }

  public getUrlBaseWithoutParams(): string {
    let urlTree = this._route.parseUrl(window.location.href);
    let url = urlTree.root.children['primary'].segments.map(it => it.path).join('/');
    return url;
  }

  public getArtists() {
    let page: number;

    this.routeService.params.forEach((param: Params) => {
      page = +param['page'];

      if (!page) {
        page = 1;
      } else {
        this.nextPage = page + 1;
        this.prevPage = page - 1;

        if (this.prevPage === 0) {
          this.prevPage = 1;
        }
      }

      this.artistService.getArtists(page).subscribe((response: any) => {
        if (!response.artists) {
          this.alertMessage = 'El artista no se ha actualizado';
          this._route.navigate(['/']);
        } else {
          this.artists = response.artists;
        }
      }, (error) => {
        const err = error as any;

        if (err !== null) {
          this.alertMessage = err.error.message;
          console.log(error);
        }
      });
    });
  }

  public onDeleteConfirm(artistId: string) {
    this.confirmado = artistId;
  }

  public onCancelArtist() {
    this.confirmado = null;
  }

  public onDeleteArtist(artistId: string) {
    this.artistService.deleteArtist(artistId).subscribe((response: any) => {
      if (!response.song) {
        this.alertMessage = 'El artista no se ha podido borrar';
      } else {
        this.getArtists();
      }
    }, (error) => {
      const err = error as any;

      if (err !== null) {
        this.alertMessage = err.error.message;
        console.log(error);
      }
    });
  }
}
