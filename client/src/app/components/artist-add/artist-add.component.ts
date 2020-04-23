import { ArtistService } from './../../services/artist.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { Artist } from 'src/app/models/Artist';
import { UserService } from 'src/app/services/user.service';
import { ENDPOINTS } from 'src/config/endpoints';

@Component({
  selector: 'app-artist-add',
  templateUrl: './artist-add.component.html',
  styleUrls: ['./artist-add.component.css']
})
export class ArtistAddComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public identity: User;
  public token: string;
  public url: string;
  public getImageArtistUrl: string;
  public alertMessage: string;

  constructor(
    private routeService: ActivatedRoute,
    private routerService: Router,
    private userService: UserService,
    private artistService: ArtistService
  ) {
    this.titulo = 'Añadir Artista';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = ENDPOINTS.baseUrl;
    this.artist = new Artist('', '', 'null');
    this.getImageArtistUrl = `${this.userService.url}${ENDPOINTS.USER.getImageUser}/`;
  }

  ngOnInit(): void {
    console.log('Artist-add funciona');
  }

  onSubmit(): void {
    this.artistService.addArtist(this.artist).subscribe(
      (response: any) => {
        if (!response.artist) {
          this.alertMessage = 'El artista no se ha creado';
        } else {
         this.routerService.navigate(['./editar-artista', response.artist._id]);

          this.alertMessage = 'El artista se ha creado correctamente';
        }
      },
      (error: any) => {
        const err = error as any;

        if (err !== null) {
          this.alertMessage = err.error.message;
          console.log(error);
        }
      }
    );
  }

}
