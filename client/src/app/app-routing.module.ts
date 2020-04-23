import { AlbumDetailComponent } from './components/album-detail/album-detail.component';
import { AlbumEditComponent } from './components/album-edit/album-edit.component';
import { AlbumAddComponent } from './components/album-add/album-add.component';
import { ArtistDetailComponent } from './components/artist-detail/artist-detail.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { ArtistAddComponent } from './components/artist-add/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit/artist-edit.component';
import { SongAddComponent } from './components/song-add/song-add.component';
import { SongEditComponent } from './components/song-edit/song-edit.component';

// Redirigimos cuando no haya nada en la url al componente de lista de artistas
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'mis-datos', component: UserEditComponent },
  { path: 'artists/:page', component: ArtistListComponent },
  { path: 'artista/:id', component: ArtistDetailComponent },
  { path: 'crear-artista', component: ArtistAddComponent },
  { path: 'editar-artista/:id', component: ArtistEditComponent },
  { path: 'crear-album/:artist', component: AlbumAddComponent },
  { path: 'editar-album/:id', component: AlbumEditComponent },
  { path: 'album/:id', component: AlbumDetailComponent },
  { path: 'crear-tema/:album', component: SongAddComponent },
  { path: 'editar-tema/:id', component: SongEditComponent },
  { path: '**', component: UserEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
