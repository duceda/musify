import { AlbumService } from 'src/app/services/album.service';
import { UploadService } from './../../services/upload.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ArtistService } from 'src/app/services/artist.service';
import { UserService } from 'src/app/services/user.service';
import { Artist } from 'src/app/models/Artist';
import { User } from 'src/app/models/User';
import { ENDPOINTS } from 'src/config/endpoints';
import { Album } from 'src/app/models/Album';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.css']
})
export class ArtistDetailComponent implements OnInit {

  public titulo: string;
  public getImageArtistUrl: string;
  public filesToUpload: Array<File>;
  public artist: Artist;
  public alertMessage: string;
  public artistId: string;
  public uploadImageArtist: string;
  public getImageAlbumUrl: string;
  public identity: User;
  public albums: Array<Album>;
  public confirmado: string;

  constructor(private albumService: AlbumService, private uploadService: UploadService, private artistService: ArtistService, private _route: ActivatedRoute, public userService: UserService) {
    this.uploadImageArtist = `${this.artistService.url}${ENDPOINTS.ARTIST.uploadImageArtist}/`;
    this.getImageArtistUrl = `${this.artistService.url}${ENDPOINTS.ARTIST.getImageArtist}/`;
    this.getImageAlbumUrl = `${this.artistService.url}${ENDPOINTS.ALBUM.getImageAlbum}/`;
    this.artistId = this.getArtistId();
    this.getArtist(this.artistId);
    this.identity = this.userService.getIdentity();
  }

  ngOnInit(): void {
  }

  public getAlbums(artistId: string): void {
    this.albumService.getAlbums(artistId).subscribe((response: any) => {
      if (!response.albums || response.albums.length <= 0) {
        this.alertMessage = 'Este artista no tiene albums';
      } else {
        this.albums = response.albums;
      }
    }, (error) => {
      const err = error as any;

      if (err !== null) {
        this.alertMessage = err.error.message;
        console.log(error);
      }
    });
  }

  public getArtistId(): string {
    let id: string;
    this._route.params.forEach((params: Params) => {
      id = params['id'];
    });

    return id;
  }

  public getArtist(id: string) {
    this.artistService.getArtist(id).subscribe(
      (response: any) => {
        if (!response.artist) {
          this.alertMessage = 'El usuario no se ha actualizado';
        } else {
          this.artist = response.artist;
          this.getAlbums(this.artistId);
        }
      }, (error) => {
        const err = error as any;

        if (err !== null) {
          this.alertMessage = err.error.message;
          console.log(error);
        }
      });
  }

  public fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  onSubmit() {
    this.artistService.editArtist(this.artistId, this.artist).subscribe((response: any) => {
      if (!response.artist) {
        this.alertMessage = 'El artista no se ha actualizado';
      } else {
        if (!this.filesToUpload) {
          // Redirection
        } else {
          const url = `${this.uploadImageArtist}${this.artistId}`;
          this.uploadService.makeFileRequest(url, [], this.filesToUpload, this.userService.getToken(), 'image').then(
            (result: any) => {
              if (!result.artistUpdated) {
                this.alertMessage = 'La imagen del artista no se ha actualizado';
              } else {
                this.artist.image = result.artistUpdated.image;
              }
            }
          );
        }
        this.alertMessage = 'El artista se ha actualizado correctamente';
      }
    }, (error) => {
      const err = error as any;

      if (err !== null) {
        this.alertMessage = err.error.message;
        console.log(error);
      }
    });
  }

  public onCancelAlbum() {
    this.confirmado = null;
  }

  public onDeleteConfirm(albumId: string) {
    this.confirmado = albumId;
  }

  public onDeleteAlbum(albumId: string) {
    this.albumService.deleteAlbum(albumId).subscribe((response: any) => {
      if (!response.song) {
        this.alertMessage = 'El album no se ha podido borrar';
      } else {
        this.getAlbums(this.artistId);
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
