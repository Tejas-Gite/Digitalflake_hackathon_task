import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbConnectionService {

  constructor() { }
  connectionURL:string="http://localhost:3000/";
}
