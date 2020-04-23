import { UploadService } from './../../services/upload.service';
import { ENDPOINTS } from './../../../config/endpoints';
import { User } from './../../models/User';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  public titulo: string;
  public user: User;
  public identity;
  public token;
  public alertMessage: string;
  public filesToUpload: Array<File>;
  public uploadImageUserUrl: string;
  public getImageUserUrl: string;

  constructor(private uploadService: UploadService, private userService: UserService) {
    this.titulo = 'Actualizar mis datos';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.user = this.identity;
    this.uploadImageUserUrl = `${this.userService.url}${ENDPOINTS.USER.uploadImageUser}/`;
    this.getImageUserUrl = `${this.userService.url}${ENDPOINTS.USER.getImageUser}/`;
  }

  ngOnInit(): void { }

  onSubmit() {
    this.userService.updateUser(this.user).subscribe((response: any) => {
      if (!response.userUpdated) {
        this.alertMessage = 'El usuario no se ha actualizado';
      } else {
        // El api nos devuelve el objeto antiguo de la base de datos, por eso no 
        // se actualiza el objeto para no tener incongruencias visuales
        // this.user = response.user;
        localStorage.setItem('identity', JSON.stringify(this.user));
        this.userService.setUserLogged(this.user);

        if (!this.filesToUpload) {
          // Redirection
        } else {
          const url = `${this.uploadImageUserUrl}${this.user._id}`;
          this.uploadService.makeFileRequest(url, [], this.filesToUpload, this.userService.getToken(), 'image').then(
            (result: any) => {
              this.user.image = result.image;
              localStorage.setItem('identity', JSON.stringify(this.user));
              this.identity = this.userService.getIdentity();
              this.userService.setUserLogged(this.identity);
            }
          );
        }

        this.alertMessage = 'Datos del usuario actualizados correctamente';
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
}
