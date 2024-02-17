import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatch } from '../../customized-validators/passwordValidator';
import { RegistrationService } from '../../services/registration.service'
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  constructor(private formBuilder: FormBuilder, private service: RegistrationService, private toastr: ToastrService, private router:Router) {
    this.registrationForm = this.formBuilder.group({
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      mobile: ["", [Validators.required, Validators.pattern('[6789][0-9]{9}')]],
      email: ["", [Validators.required, Validators.email, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      password: ["", [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]],
      re_enter_password: ["", [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]],
      showpassword: [""]
    }, {
      validators: passwordMatch('password', 're_enter_password')
    })
  }
  registrationForm!: FormGroup;
  password: string = "password";


  registrationService(form: FormGroup) {
    this.service.register(form).subscribe((data: any) => {
      if (data.status == true) {
        this.router.navigate(['/login']);
        this.toastr.success(data.message);
      }
      else if (data.status == false) {
        this.toastr.error(data.message);
      }
    });
  }

  touched(form: FormGroup) {
    for (let i in form.controls)
      form.controls[i].markAsTouched()
  }

  formReset(form: FormGroup) {
    form.reset();
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
