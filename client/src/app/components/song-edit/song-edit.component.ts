import { ArtistService } from './../../services/artist.service';
import { UploadService } from './../../services/upload.service';
import { Component, OnInit } from '@angular/core';
import { Song } from 'src/app/models/Song';
import { User } from 'src/app/models/User';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SongService } from 'src/app/services/song.service';
import { UserService } from 'src/app/services/user.service';
import { ENDPOINTS } from 'src/config/endpoints';

@Component({
  selector: 'app-song-edit',
  templateUrl: './song-edit.component.html',
  styleUrls: ['./song-edit.component.css']
})
export class SongEditComponent implements OnInit {
  public titulo: string;
  public songs: Array<Song>;
  public getSongAlbumUrl: string;
  public song: Song;
  public alertMessage: string;
  public artistId: string;
  public identity: User;
  public filesToUpload: Array<File>;
  public isEdit = true;
  public songId: string;
  public uploadSongUrl: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private songService: SongService,
    public userService: UserService,
    private uploadService: UploadService,
    private artistService: ArtistService
  ) {
    this.titulo = 'Editar Canción';
    this.song = new Song('', 0, '', '', '');
    this.identity = this.userService.getIdentity();
    this.getSongAlbumUrl = `${this.userService.url}${ENDPOINTS.SONG.getFileSong}/`;
    this.uploadSongUrl = `${this.userService.url}${ENDPOINTS.SONG.uploadFileSong}/`;
  }

  ngOnInit(): void {
    this.getSongFromURL();
  }

  public getSongFromURL(): void {
    let id: string;
    this._route.params.forEach((params: Params) => {
      this.songId = params['id'];
      this.songService.getSong(this.songId).subscribe((response: any) => {
        if (!response.song) {
          this.alertMessage = 'La canción no se ha encontrado';
          this._router.navigate(['/']);
        } else {
          this.song = response.song;
        }
      }, (error) => {
        const err = error as any;

        if (err !== null) {
          this.alertMessage = err.error.message;
          console.log(error);
          this._router.navigate(['/']);
        }
      });
    });
  }

  onSubmit() {
    this.songService.editSong(this.songId, this.song).subscribe((response: any) => {
      if (!response.song) {
        this.alertMessage = 'La canción no se ha modificado';
      } else {
        this.alertMessage = 'La canción se ha modificado correctamente';
        if (!this.filesToUpload || this.filesToUpload.length <= 0) {
          this._router.navigate(['/album', response.song.album]);
        } else {
          // Subir el fichero de audio
          const url = `${this.uploadSongUrl}${this.songId}`;
          this.uploadService.makeFileRequest(url, [], this.filesToUpload, this.artistService.getToken(), 'file').then(
            (response: any) => {
              if (!response.file) {
                this.alertMessage = 'El fichero  de canción no se ha subido';
              } else {
                this.song.file = response.file.file;
                this._router.navigate(['/album', response.file.album]);
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
  }

  public fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
