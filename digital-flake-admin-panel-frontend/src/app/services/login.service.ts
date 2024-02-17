import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'
import { Observable } from 'rxjs';
import {DbConnectionService} from './db-connection.service'
import { FormGroup } from '@angular/forms';
import { EncrDecrService } from './encr-decr.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient,private dBConnection:DbConnectionService, private encrypt:EncrDecrService) { }
  host = this.dBConnection.connectionURL;
  login(form:FormGroup):Observable<any>
  {
    let formData = new FormData;
    formData.append("email",form.get('email')?.value);
    formData.append("password",this.encrypt.encrypt(form.get('password')?.value));
    return this.http.post(this.host+"login/login",formData);
  }

  forgetPassword(email:string):Observable<any>
  {
    return this.http.post(this.host+"forget_passoword/password_restore/"+email,{});
  }
  
  changePassword(form:FormGroup,token:string,user_id:string):Observable<any>
  {
    let headers = new HttpHeaders({
      'responseType': 'json',
      'token': token
    });
    let formData = new FormData;
    formData.append("password",this.encrypt.encrypt(form.get('password')?.value));
    formData.append("id",user_id);
    return this.http.post(this.host+"forget_passoword/save_password/",formData,{headers:headers});

  }
}
