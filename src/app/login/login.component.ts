import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/authService/auth.service';
import { TokenStorageService } from '../service/token-storageService/token-storage.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken() && this.tokenStorage.getUser()!=null) {
      var dateNow : Date = new Date()
      var tokenExp : Date =  new Date(this.tokenStorage.getUser().expirationToken)
      console.log(dateNow +"      "+tokenExp )
      console.log(dateNow <tokenExp )
      if(dateNow>tokenExp){
        this.router.navigate(['/login'], {});
      }else{
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
      }
    }else{
      this.router.navigate(['/login'], {});
    }



  }

  onSubmit(): void {
    this.authService.login(this.form).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.router.navigate(['/pages/listUser']);
        //this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();   
  }

}
