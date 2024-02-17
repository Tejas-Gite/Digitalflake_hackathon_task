import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatch } from '../../customized-validators/passwordValidator';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-changes-password',
  templateUrl: './changes-password.component.html',
  styleUrls: ['./changes-password.component.css']
})
export class ChangesPasswordComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute, private service:LoginService, private toastr:ToastrService,private router:Router) {
    this.changePasswordForm = this.formBuilder.group({
      password: ["", [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]],
      re_enter_password: ["", [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]],
      showpassword: [""]
    }, {
      validators: passwordMatch('password', 're_enter_password')
    })
  }

  changePasswordForm!: FormGroup;
  password: string = "password";
  token:string="";

  ngOnInit(): void {
    this.password = "password";
    this.fetchDataQuery()
  }

  fetchDataQuery() {
    this.route.queryParams.subscribe(params => {
      if (JSON.parse(JSON.stringify(params)).token == undefined) {
        this.token = "";
      }
      else {
        this.token = JSON.parse(JSON.stringify(params)).token;
      }
    }
    );
  }

  changePasswordService(form:FormGroup)
  {
    console.log(this.token)
    let token_details:JwtPayload = jwtDecode(this.token);
    console.log(token_details.email);
    console.log(token_details.id);
    this.service.changePassword(form,this.token,token_details.id).subscribe((data:any)=>{
      if(data.status == true)
      {
        this.toastr.success(data.message);
        this.router.navigate(['/login']);
      }
      else if(data.status == false)
      {
        this.toastr.error(data.message);
        this.router.navigate(['/login']);

      }
      else if(data.status == "403")
      {
        this.toastr.error("Timeout please try again with new URL");
        this.router.navigate(['/login']);
      }
    })
  }

  touched(form: FormGroup) {
    for (let i in form.controls)
      form.controls[i].markAsTouched()
  }

  formReset(form: FormGroup) {
    form.reset();
    this.password = 'password'
  }

  showPassword(value: any) {

    if (value.target.checked == true) {
      this.password = 'text'
    }
    else {
      this.password = 'password'
    }
  }
}

interface JwtPayload {
  id: string;
  email:string
}
