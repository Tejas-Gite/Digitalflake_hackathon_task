import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'
import { Observable } from 'rxjs';
import {DbConnectionService} from './db-connection.service'
import { FormGroup } from '@angular/forms';
import { EncrDecrService } from './encr-decr.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http:HttpClient,private dBConnection:DbConnectionService,private encrypt:EncrDecrService) { }
  host = this.dBConnection.connectionURL;

  register(form:FormGroup):Observable<any>
  {
    let formdata = new FormData;
    formdata.append("first_name", form.get('first_name')?.value); 
    formdata.append("last_name", form.get('last_name')?.value); 
    formdata.append("email", form.get('email')?.value); 
    formdata.append("mobile", form.get('mobile')?.value);
    formdata.append("password", this.encrypt.encrypt(form.get('password')?.value));
    return this.http.post(this.host+"user/add",formdata);
  }
}
