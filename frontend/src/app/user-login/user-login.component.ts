import { Component, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpRequestsUsersService } from 'src/app/services/http-requests-users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})



export class UserLoginComponent {


  formLogin: FormGroup;

  constructor(private location: Location,
    private fb: FormBuilder,
    private http: HttpRequestsUsersService,
    private toastrSrv: ToastrService,
    private router: Router 
  ) {
    this.formLogin = this.fb.group({

      email: ['', Validators.required],
      password: ['', Validators.required],

    });
  }

  goBack() {
    this.location.back();
  }

  onSubmitForm() {
    if (this.formLogin.valid) {
      const loginData = {
        email: this.formLogin.value.email,
        password: this.formLogin.value.password
      };
  
      this.http.postRequest('Users/Authenticate', loginData).subscribe({
        next: (response) => {
          // Check if the login status is approved
          if (response.status === 1) {
            // Store the JWT token
            localStorage.setItem('token', response.token);
  
            // Based on the role, navigate to the appropriate page
            switch (response.role) {
              case 1:
                this.router.navigate(['/menu-administrador']);
                break;
              case 2:
                this.router.navigate(['/menu-gestor-de-campus']);
                break;
              case 3:
                this.router.navigate(['/robot']);
                break;
              case 4:
                this.router.navigate(['/menu-gestor-de-tarefas']);
                break;
              case 5:
                this.router.navigate(['/menu-utente']);
                break;
              case 0:
              default:
                this.router.navigate(['/login-signup']);
                break;
            }
  
            this.toastrSrv.success('Login successful!', 'Success');
          } else {
            // If status is not approved, show an error message
            this.toastrSrv.error('Login not approved. Please contact the administrator.', 'Error');
          }
        },
        error: (err) => {
          // Check if the user was not found
          if (err.status === 404) {
            this.toastrSrv.error('User not found. Please check your credentials or register if you do not have an account.', 'Error');
          } else {
            // Handle other errors
            this.toastrSrv.error('Login failed: ' + (err.error.message || 'Unknown error'), 'Error');
          }
        }
      });
    } else {
      this.toastrSrv.error('Please fill in all required fields.', 'Error');
    }
  
  

    /*let apiUrl = 'Users/'+this.formLogin.value.email.toString();
    let passwordGood = false;
    this.http.getRequest(apiUrl).subscribe({
      next : (data) =>{
        console.log(data);
        if(data.password==this.formLogin.value.password.toString()){
          passwordGood = true;
        }
        neste bloco vou ver se data.password = formLogin.password, if so, reroute para menu x, if not, error wrong PW 
        console.log(passwordGood);
      },
      error: (err) => {
       if err.status==404 => user not found, else, other error 

      }
    });*/
   

  }

  prepareData() {


    const formData = {

      email: this.formLogin.value.email.toString(),
      password: this.formLogin.value.password.toString(),

    };


    console.log(formData);

    return formData;
  }
}
