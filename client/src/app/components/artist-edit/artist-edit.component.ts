import { UploadService } from './../../services/upload.service';
import { ArtistService } from './../../services/artist.service';
import { Component, OnInit } from '@angular/core';
import { ENDPOINTS } from 'src/config/endpoints';
import { Artist } from 'src/app/models/Artist';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-artist-edit',
  templateUrl: './artist-edit.component.html',
  styleUrls: ['./artist-edit.component.css']
})
export class ArtistEditComponent implements OnInit {
  public titulo: string;
  public getImageArtistUrl: string;
  public filesToUpload: Array<File>;
  public artist: Artist;
  public isEdit: boolean;
  public alertMessage: string;
  public artistId: string;
  public uploadImageArtist: string;

  constructor(private uploadService: UploadService, private artistService: ArtistService, private _route: ActivatedRoute, private router: Router) {
    this.titulo = 'Editar Artista';
    this.artist = new Artist('', '', '');
    this.uploadImageArtist = `${this.artistService.url}${ENDPOINTS.ARTIST.uploadImageArtist}/`;
    this.getImageArtistUrl = `${this.artistService.url}${ENDPOINTS.ARTIST.getImageArtist}/`;
    this.isEdit = true;
    this.artistId = this.getArtistIdFromURL();
    this.getArtist(this.artistId);
  }

  ngOnInit(): void {
  }
  public getArtistIdFromURL(): string {
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
          this.router.navigate(['/artista', response.artist._id]);
        } else {
          const url = `${this.uploadImageArtist}${this.artistId}`;
          this.uploadService.makeFileRequest(url, [], this.filesToUpload, this.artistService.getToken(), 'image').then(
            (result: any) => {
              if (!result.artistUpdated) {
                this.alertMessage = 'La imagen del artista no se ha actualizado';
              } else {
                this.artist.image = result.artistUpdated.image;
                this.router.navigate(['/artista', result.artistUpdated._id]);
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
}
