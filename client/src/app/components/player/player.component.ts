import { ArtistService } from './../../services/artist.service';
import { PlayerService } from './../../services/player.service';
import { Component, OnInit } from '@angular/core';
import { Song } from 'src/app/models/Song';
import { Observable } from 'rxjs';
import { ENDPOINTS } from 'src/config/endpoints';
import { Artist } from 'src/app/models/Artist';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  public url: string;
  public song: Song;
  public artist: Artist;
  public getSongFileUrl: string;
  public getImageAlbumUrl: string;
  public songPlayed$: Observable<Song>;
  public artistName: string;
  public albumImage: string;

  constructor(private playerService: PlayerService, private artistService: ArtistService) {
    this.song = new Song('', 0, '', '', '');
    this.getSongFileUrl = `${this.artistService.url}${ENDPOINTS.SONG.getFileSong}/`;
    this.getImageAlbumUrl = `${this.artistService.url}${ENDPOINTS.ALBUM.getImageAlbum}/`;
  }

  ngOnInit(): void {
    let songStoraged = JSON.parse(localStorage.getItem('songPlaying'));

    if (songStoraged) {
      this.song = songStoraged;
    } else {
      this.song = new Song('', 0, '', '', '');
    }

    this.songPlayed$ = this.playerService.getSongPlayed();
    this.songPlayed$.subscribe((songPlayed: any) => {
      Object.assign(this.song, songPlayed);
      this.artistName = songPlayed.album.artist.name;
      this.albumImage = songPlayed.album.image;
      console.log(this.song);
      let elem: any;
      elem = document.getElementById('player');
      elem.load();
      elem.play();
    });
  }

}
