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
export class ProductService {

  constructor(private http: HttpClient, private dBConnection: DbConnectionService, private router: Router, private toastr: ToastrService) { }
  host = this.dBConnection.connectionURL;

  list(sort_field: string, sort_type: number, name: string, page: number, limit: number): Observable<any> {

    let headers = new HttpHeaders({
      //  'Content-Type': 'application/json',
      'responseType': 'json',
      'token': this.getToken()
    });

    let queryParams = new HttpParams;
    queryParams = queryParams.set("sort_field", sort_field);
    queryParams = queryParams.set("sort_type", String(sort_type));
    queryParams = queryParams.set("name", name);
    queryParams = queryParams.set("page", String(page));
    queryParams = queryParams.set("limit", String(limit));
    return this.http.get(this.host + 'product/list', { params: queryParams, headers: headers });
  }

  add(form: FormGroup, image: any): Observable<any> {
    let headers = new HttpHeaders({
      //  'Content-Type': 'application/json',
      'responseType': 'json',
      'token': this.getToken()
    });
    let formData = new FormData;
    formData.append("category_id", form.get('category_id')?.value);
    formData.append("name", form.get('name')?.value);
    formData.append("pack_size", form.get('pack_size')?.value);
    formData.append("mrp", form.get('mrp')?.value);
    formData.append("image", image);
    formData.append("isActive", String(form.get('isActive')?.value));
    return this.http.post(this.host + 'product/add', formData, { headers: headers });
  }

  update(form: FormGroup, image: any): Observable<any> {
    let headers = new HttpHeaders({
      //  'Content-Type': 'application/json',
      'responseType': 'json',
      'token': this.getToken()
    });
    let formData = new FormData;
    formData.append("id", form.get('id')?.value);
    formData.append("category_id", form.get('category_id')?.value);
    formData.append("name", form.get('name')?.value);
    formData.append("pack_size", form.get('pack_size')?.value);
    formData.append("mrp", form.get('mrp')?.value);
    formData.append("image", image);
    formData.append("isActive", String(form.get('isActive')?.value));
    return this.http.put(this.host + 'product/update', formData, { headers: headers });
  }

  findById(id: string): Observable<any> {
    let headers = new HttpHeaders({
      //  'Content-Type': 'application/json',
      'responseType': 'json',
      'token': this.getToken()
    });
    return this.http.get(this.host + 'product/findById/' + id, { headers: headers });
  }

  delete(id: string): Observable<any> {
    let headers = new HttpHeaders({
      //  'Content-Type': 'application/json',
      'responseType': 'json',
      'token': this.getToken()
    });
    return this.http.delete(this.host + 'product/delete/' + id, { headers: headers });
  }

  getCategory(): Observable<any> {
    let headers = new HttpHeaders({
      //  'Content-Type': 'application/json',
      'responseType': 'json',
      'token': this.getToken()
    });
    return this.http.get(this.host + 'category/findAll', { headers: headers });
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------------
  checkForSession(data: any) {
    if (data.status == "403") {
      this.toastr.error(data.message);
      localStorage.clear();
      this.router.navigate(['']);
      return false
    }
    else {
      return true;
    }
  }

  getToken(): string {
    return localStorage.getItem('token') || "";
  }
}
