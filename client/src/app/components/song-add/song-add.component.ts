import { SongService } from './../../services/song.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Song } from 'src/app/models/Song';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ENDPOINTS } from 'src/config/endpoints';

@Component({
  selector: 'app-song-add',
  templateUrl: './song-add.component.html',
  styleUrls: ['./song-add.component.css']
})
export class SongAddComponent implements OnInit {
  public titulo: string;
  public songs: Array<Song>;
  public getSongAlbumUrl: string;
  public song: Song;
  public alertMessage: string;
  public artistId: string;
  public identity: User;
  public filesToUpload: Array<File>;
  public isEdit = false;
  

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private songService: SongService,
    public userService: UserService
  ) {
    this.titulo = 'Añadir nueva Canción';
    this.identity = this.userService.getIdentity();
    this.song = new Song('', 0, '', '', '');
    this.getSongAlbumUrl = `${this.userService.url}${ENDPOINTS.SONG.getFileSong}/`;
  }

  ngOnInit(): void {
    console.log('Componente crear album works');
  }

  onSubmit() {
    this._route.params.forEach((param: Params) => {
      let albumId = param['album'];
      this.song.album = albumId;

      this.songService.addSong(this.song).subscribe((response: any) => {
        if (!response.song) {
          this.alertMessage = 'La canción no se ha creado';
        } else {
          this.song = response.song;
          this.alertMessage = 'La canción se ha creado correctamente';
          this._router.navigate(['./editar-tema', response.song._id]);
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
