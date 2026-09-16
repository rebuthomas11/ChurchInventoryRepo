import { Component,OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';

export class CustomErrorStateMatcher implements ErrorStateMatcher {

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {

    return !!(
      control &&
      control.invalid &&
      control.touched
    );
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 loginForm!: FormGroup;

  hidePassword = true;

  matcher: CustomErrorStateMatcher =
    new CustomErrorStateMatcher();


  constructor(private fb: FormBuilder, private route:Router) {}


  ngOnInit(): void {

    this.loginForm = this.fb.group({

      username: [
        '',
        Validators.required
      ],

      password: [
        '',
        Validators.required
      ],

      rememberMe: [false]

    });

  }


  get username() {
    return this.loginForm.get('username');
  }


  get password() {
    return this.loginForm.get('password');
  }


  login(): void {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    console.log(
      'Login details:',
      this.loginForm.value
      
    );
this.route.navigate(['dashboard']);
  }
}
