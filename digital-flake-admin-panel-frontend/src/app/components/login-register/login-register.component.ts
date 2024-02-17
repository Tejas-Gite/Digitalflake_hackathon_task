import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {
  constructor(private service: LoginService, private formBuilder: FormBuilder, private router: Router, private toastr:ToastrService) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      password: ["", [Validators.required]],
      showpassword: [""]
    });
    
    this.sendEmailForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
    });
  }
  loginForm!: FormGroup;
  sendEmailForm !: FormGroup;

  errorAlert = "d-none";
  errorAlertMessage = ""
  password: string = "password";

  ngOnInit() {
    if (localStorage.getItem('token') != undefined || localStorage.getItem('token') != null) {
      this.router.navigate(['/home']);
    }
  }

  loginService(form: FormGroup) {
    this.service.login(form).subscribe((data) => {
      if (data.status == true) {

        localStorage.setItem('token', data.data);
        // let token = (data.data);
        // const decoded = jwtDecode(token);
        this.router.navigate(['/home']);
      }
      if (data.status == false) {
        this.toastr.error(data.message);
        form.reset();
        this.password = "password";
      }
    });
  }

  touched(form: FormGroup) {
    for (let i in form.controls)
      form.controls[i].markAsTouched()
  }

  showPassword(value: any) {

    if (value.target.checked == true) {
      this.password = 'text'
    }
    else {
      this.password = 'password'
    }
  }

  sendEmailLink(form:FormGroup)
  {
    this.service.forgetPassword(form.get('email')?.value).subscribe((data:any)=>{
      if(data.status == true)
      {
        this.toastr.success(data.message);
        let close_btn = document.getElementById("close");
        if(close_btn !=null)
        {
          close_btn.click();
        }
      }
      else if(data.status == false)
      {
        this.toastr.error(data.message);
      }
    });
  }
}
