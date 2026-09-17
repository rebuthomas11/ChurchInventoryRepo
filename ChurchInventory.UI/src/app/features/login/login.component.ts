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
import { ILoginRequest } from 'src/app/core/models/auth.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  isLoading=false;

  matcher: CustomErrorStateMatcher =
    new CustomErrorStateMatcher();


  constructor(private fb: FormBuilder, private route:Router,private authService:AuthService, private snackBar:MatSnackBar) {}


  ngOnInit(): void {

    this.loginForm = this.fb.group({

      loginName: [
        '',
        Validators.required
      ],

      loginPassword: [
        '',
        Validators.required
      ],

      rememberMe: [false]

    });

  }


  get loginName() {
    return this.loginForm.get('loginName');
  }


  get loginPassword() {
    return this.loginForm.get('loginPassword');
  }


  login(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const request: ILoginRequest = {
      loginName: this.loginForm.value.loginName,
      loginPassword: this.loginForm.value.loginPassword
    };

    this.isLoading = true;

    this.authService.login(request)
      .subscribe({

        next: response => {

          this.authService.saveLoginDetails(
            response,
            this.loginForm.value.rememberMe
          );

          this.isLoading = false;

          this.snackBar.open(
            'Login successful',
            'Close',
            {
              duration: 3000
            }
          );

          this.route.navigate(['/dashboard']);
        },

        error: error => {

          this.isLoading = false;

          console.error('Login failed:', error);

          if (error.status === 401) {

            this.snackBar.open(
              'Invalid login name or password',
              'Close',
              {
                duration: 3000
              }
            );

          }
          else {

            this.snackBar.open(
              'Unable to login. Please try again.',
              'Close',
              {
                duration: 3000
              }
            );

          }

        }

      });

  }
}
