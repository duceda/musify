import { UploadService } from './../../services/upload.service';
import { ArtistService } from './../../services/artist.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Album } from 'src/app/models/Album';
import { AlbumService } from 'src/app/services/album.service';
import { User } from 'src/app/models/User';
import { ENDPOINTS } from 'src/config/endpoints';

@Component({
  selector: 'app-album-edit',
  templateUrl: './album-edit.component.html',
  styleUrls: ['./album-edit.component.css']
})
export class AlbumEditComponent implements OnInit {
  public titulo: string;
  public alertMessage: string;
  public artistId: string;
  public album: Album;
  public identity: User;
  public isEdit: boolean;
  public filesToUpload: Array<File>;
  public getImageAlbumUrl: string;
  public uploadImageAlbumUrl: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private albumService: AlbumService,
    private userService: UserService,
    private artistService: ArtistService,
    private uploadService: UploadService
  ) {
    this.titulo = 'Editar Album';
    this.album = new Album('', '', '', '', 2020);
    this.identity = this.userService.getIdentity();
    this.isEdit = true;
    this.getImageAlbumUrl = `${this.artistService.url}${ENDPOINTS.ALBUM.getImageAlbum}/`;
    this.uploadImageAlbumUrl = `${this.artistService.url}${ENDPOINTS.ALBUM.uploadImageAlbum}/`;
  }

  ngOnInit(): void {
    this.getAlbumFromURL();
  }

  getAlbumFromURL() {
    this._route.params.forEach((param: Params) => {
      let albumId = param['id'];

      this.albumService.getAlbum(albumId).subscribe((response: any) => {
        if (!response.album) {
          this.alertMessage = 'El album no se ha encontrado';
        } else {
          this.album = response.album;
        }
      },
        (error: any) => {
          const err = error as any;

          if (err !== null) {
            this.alertMessage = err.error.message;
            console.log(error);
          }
        });
    });
  }

  onSubmit() {
    this._route.params.forEach((param: Params) => {
      let albumId = param['id'];

      this.albumService.addAlbum(this.album).subscribe((response: any) => {
        if (!response.album) {
          this.alertMessage = 'El album no se ha actualizado';
        } else {
          this.alertMessage = 'El album se ha actualizado correctamente';

          if (!this.filesToUpload || this.filesToUpload.length <= 0) {
            this._router.navigate(['/artista', response.album.artist]);
          } else {
            // Subir el fichero de imagen
            const url = `${this.uploadImageAlbumUrl}${albumId}`;
            this.uploadService.makeFileRequest(url, [], this.filesToUpload, this.artistService.getToken(), 'image').then(
              (result: any) => {
                if (!result.album) {
                  this.alertMessage = 'La imagen del album no se ha actualizado';
                } else {
                  this._router.navigate(['/artista', response.album.artist]);
                }
              }, (error) => {
                console.log(error);
              }
            );
          }
        }
      },
        (error: any) => {
          const err = error as any;

          if (err !== null) {
            this.alertMessage = err.error.message;
            console.log(error);
          }
        });
    });
  }

  public fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
