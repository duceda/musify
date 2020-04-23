import { ArtistService } from './../../services/artist.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ENDPOINTS } from 'src/config/endpoints';
import { Artist } from 'src/app/models/Artist';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Album } from 'src/app/models/Album';
import { AlbumService } from 'src/app/services/album.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-album-add',
  templateUrl: './album-add.component.html',
  styleUrls: ['./album-add.component.css']
})
export class AlbumAddComponent implements OnInit {
  public titulo: string;
  public getImageArtistUrl: string;
  public getImageAlbumUrl: string;
  public artist: Artist;
  public alertMessage: string;
  public artistId: string;
  public album: Album;
  public identity: User;
  public filesToUpload: Array<File>;

  constructor(
    private artistService: ArtistService,
    private _route: ActivatedRoute,
    private _router: Router,
    private albumService: AlbumService,
    private userService: UserService
  ) {
    this.titulo = 'Añadir Album';
    this.album = new Album('', '', '', '', 2020);
    this.getImageArtistUrl = `${this.artistService.url}${ENDPOINTS.ARTIST.getImageArtist}/`;
    this.getImageAlbumUrl = `${this.artistService.url}${ENDPOINTS.ALBUM.getImageAlbum}/`;
    this.identity = this.userService.getIdentity();
  }

  ngOnInit(): void {
    console.log('Componente crear album works');
  }

  onSubmit() {
    this._route.params.forEach((param: Params) => {
      let artistId = param['artist'];
      this.album.artist = artistId;

      this.albumService.addAlbum(this.album).subscribe((response: any) => {
        if (!response.album) {
          this.alertMessage = 'El album no se ha creado';
        } else {
          this.album = response.album;
          this.alertMessage = 'El album se ha creado correctamente';
          this._router.navigate(['./editar-album', response.album._id]);
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
