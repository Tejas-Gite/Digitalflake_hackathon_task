import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  user_name:string="";
  ngOnInit(): void {
      let token:JwtDetails = jwtDecode(localStorage.getItem('token')||"");
      this.user_name = token.name;
  }
}

interface JwtDetails
{
  name:string
}
