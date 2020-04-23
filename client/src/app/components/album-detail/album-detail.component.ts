import { PlayerService } from './../../services/player.service';
import { SongService } from 'src/app/services/song.service';
import { ArtistService } from './../../services/artist.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { AlbumService } from 'src/app/services/album.service';
import { Album } from 'src/app/models/Album';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ENDPOINTS } from 'src/config/endpoints';
import { Song } from 'src/app/models/Song';
import { Artist } from 'src/app/models/Artist';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent implements OnInit {
  public titulo: string;
  public getImageArtistUrl: string;
  public filesToUpload: Array<File>;
  public album: Album;
  public alertMessage: string;
  public albumId: string;
  public uploadImageArtist: string;
  public getImageAlbumUrl: string;
  public identity: User;
  public albums: Array<Album>;
  public confirmado: string;
  public songs: Array<Song>;
  public artist: Artist;
  public getSongFileUrl: string;

  constructor(
    private albumService: AlbumService,
    private _route: ActivatedRoute,
    public userService: UserService,
    public router: Router,
    public artistService: ArtistService,
    public songService: SongService,
    public playerService: PlayerService
  ) {
    // this.uploadImageArtist = `${this.artistService.url}${ENDPOINTS.ARTIST.uploadImageArtist}/`;
    // this.getImageArtistUrl = `${this.artistService.url}${ENDPOINTS.ARTIST.getImageArtist}/`;
    this.getImageAlbumUrl = `${this.artistService.url}${ENDPOINTS.ALBUM.getImageAlbum}/`;
    this.getSongFileUrl = `${this.artistService.url}${ENDPOINTS.SONG.getFileSong}/`;
    this.albumId = this.getAlbumId();
    this.artist = new Artist('', '', 'null');
    this.getAlbum(this.albumId);
    this.identity = this.userService.getIdentity();
  }

  ngOnInit(): void {
  }

  public getSongs(albumId: string): void {
    this.songService.getSongs(albumId).subscribe((response: any) => {
      if (!response.songs || response.songs.length <= 0) {
        this.alertMessage = 'Este album no tiene canciones';
      } else {
        this.songs = response.songs;
      }
    }, (error) => {
      const err = error as any;

      if (err !== null) {
        this.alertMessage = err.error.message;
        console.log(error);
      }
    });
  }

  public getAlbumId(): string {
    let id: string;
    this._route.params.forEach((params: Params) => {
      id = params['id'];
    });

    return id;
  }

  public getAlbum(albumId: string) {
    this.albumService.getAlbum(albumId).subscribe(
      (response: any) => {
        if (!response.album) {
          this.alertMessage = 'Error sacando Album';
          this.router.navigate(['/']);
        } else {
          this.album = response.album;
          this.artist = response.album.artist;
          this.getSongs(this.albumId);
        }
      }, (error) => {
        const err = error as any;

        if (err !== null) {
          this.alertMessage = err.error.message;
          console.log(error);
        }
      });
  }

  public onCancelSong() {
    this.confirmado = null;
  }

  public onDeleteConfirm(albumId: string) {
    this.confirmado = albumId;
  }

  public onDeleteSong(songId: string) {
    this.songService.deleteSong(songId).subscribe((response: any) => {
      if (!response.song) {
        this.alertMessage = 'La canción no se ha podido borrar';
      } else {
        this.getSongs(this.albumId);
      }
    }, (error) => {
      const err = error as any;

      if (err !== null) {
        this.alertMessage = err.error.message;
        console.log(error);
      }
    });
  }

  public startPlayer(songToBePlayed) {
    let song = JSON.stringify(songToBePlayed);
    let filePath = this.getSongFileUrl + songToBePlayed.file;
    let imagePath = this.getImageAlbumUrl + songToBePlayed.album.image;
    localStorage.setItem('songPlaying', song);
    console.log(song);
    console.log(songToBePlayed.file);
    this.playerService.setSongPlayed(songToBePlayed);
  }
}
