import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { DbConnectionService } from './db-connection.service'
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
  constructor(private http: HttpClient, private dBConnection: DbConnectionService, private router:Router, private toastr:ToastrService) {  }
  host = this.dBConnection.connectionURL
  list(sort_field: string, sort_type: number, name: string, page: number, limit: number): Observable<any> {
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'responseType': 'json',
      'token': this.getToken()
    });
    let queryParams = new HttpParams;
    queryParams = queryParams.set("sort_field", sort_field);
    queryParams = queryParams.set("sort_type", String(sort_type));
    queryParams = queryParams.set("name", name);
    queryParams = queryParams.set("page", String(page));
    queryParams = queryParams.set("limit", String(limit));
    return this.http.get(this.host + 'category/list', { params: queryParams, headers: headers });
  }

  add(form: FormGroup): Observable<any> {
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'responseType': 'json',
      'token': this.getToken()
    });
    let formData = new FormData;
    formData.append("name", form.get('name')?.value);
    formData.append("description", form.get('description')?.value);
    formData.append("isActive", form.get('isActive')?.value);
    return this.http.post(this.host + 'category/add', formData, { headers: headers });
  }

  update(form: FormGroup): Observable<any> {
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'responseType': 'json',
      'token': this.getToken()
    });
    let formData = new FormData;
    formData.append("id", form.get('id')?.value);
    formData.append("name", form.get('name')?.value);
    formData.append("description", form.get('description')?.value);
    formData.append("isActive", form.get('isActive')?.value);
    return this.http.put(this.host + 'category/update', formData, { headers: headers });
  }

  findById(id: string): Observable<any> {
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'responseType': 'json',
      'token': this.getToken()
    });
    return this.http.get(this.host + 'category/findById/' + id,{headers:headers});
  }

  delete(id: string): Observable<any> {
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'responseType': 'json',
      'token' : this.getToken()
  });
    return this.http.delete(this.host + 'category/delete/' + id,{headers:headers});
  }

  checkForSession(data:any)
  {
    if(data.status == "403")
    {
      this.toastr.error(data.message);
      localStorage.clear();
      this.router.navigate(['']);
      return false
    }
    else
    {
      return true;
    }
  }

  getToken():string
  {
    return localStorage.getItem('token')||"";
  }
}
