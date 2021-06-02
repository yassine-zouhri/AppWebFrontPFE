import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl ,FormGroupDirective,NgForm, AsyncValidatorFn, ValidationErrors, AbstractControl} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NbDialogRef } from '@nebular/theme';
import { MyErrorStateMatcher } from './MyErrorStateMatcher';
import { v4 as uuidv4 } from 'uuid';
import { SignupRequest } from '../../Models/Request/SignupRequest';
import { UserService } from '../../service/userService/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { userResponse } from '../../Models/Response/userResponse';
import { delay, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'ngx-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})


export class AddUserComponent  implements OnInit  {



  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  hide1 = true;hide2 = true;

  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  imageName: any;
  
  constructor(protected ref: NbDialogRef<AddUserComponent>,private fb: FormBuilder,private datePipe: DatePipe,private userService : UserService) {
    console.log("in AddUserComponentAddUserComponentAddUserComponent ")
  }

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }

  ngOnInit(): void {
    console.log("in AddUserComponentAddUserComponentAddUserComponent ")
    this.firstForm = this.fb.group({
      NomCtrl: ['', [Validators.required,Validators.minLength(3)]],
      PrenomCtrl: ['', [Validators.required,Validators.minLength(3)]],
      VilleCtrl: ['', [Validators.required,Validators.minLength(2)]],
      PaysCtrl: ['', [Validators.required,Validators.minLength(2)]],
      EntrepriseCtrl: ['',[Validators.required,Validators.minLength(2)]],
      EchelleCtrl: ['', [Validators.required,Validators.minLength(1)]],
      AnniversaireCtrl: ['', [Validators.required]],
      MobileCtrl: ['', [Validators.required,Validators.minLength(10)]],
    });

    this.secondForm = this.fb.group({
      UsernameCtrl: ['', [Validators.required,Validators.minLength(5)],[this.usernameExistsValidator()]],
      EmailCtrl: ['', [Validators.required,Validators.email],[this.emailExistsValidator()]],
      PasswordCtrl: ['', [Validators.required,Validators.minLength(6)]],
      ConfirmPasswordCtrl: ['', [Validators.required,Validators.minLength(6)]],
      RoleCtrl: ['', [Validators.required]],
      StatusCtrl: ['', [Validators.required]],
    },{validator: this.checkPasswords});

    this.thirdForm = this.fb.group({
      ImageCtrl: ['', Validators.required],
    });
  }

  private emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(control.value).pipe(
        delay(500),
        switchMap((email) => this.userService.doesEmailExist(email).pipe(
          map(emailExists => emailExists ? { emailExists: true } : null)
        ))
      );
    };
  }

  private usernameExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(control.value).pipe(
        delay(500),
        switchMap((username) => this.userService.doesUsernameExist(username).pipe(
          map(usernameExists => usernameExists ? { usernameExists: true } : null)
        ))
      );
    };
  }


  onFirstSubmit() {
    this.firstForm.markAsDirty();
  }

  onSecondSubmit() {
    this.secondForm.markAsDirty();
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('PasswordCtrl').value;
    const confirmPassword = group.get('ConfirmPasswordCtrl').value;
    return password === confirmPassword ? null : { notSame: true }     
  }

  GetAllUserInfo(){
    var birthDate = this.datePipe.transform(this.firstForm.value.AnniversaireCtrl, 'yyyy-MM-dd')
    var username = this.secondForm.value.UsernameCtrl
    var email = this.secondForm.value.EmailCtrl
    var password = this.secondForm.value.PasswordCtrl
    var role = this.secondForm.value.RoleCtrl
    var firstName = this.firstForm.value.PrenomCtrl
    var lastName = this.firstForm.value.NomCtrl
    var city = this.firstForm.value.VilleCtrl
    var country = this.firstForm.value.PaysCtrl
    var company = this.firstForm.value.EntrepriseCtrl
    var mobile = this.firstForm.value.MobileCtrl
    var jobPosition = this.firstForm.value.EchelleCtrl
    var uuidImage :string= this.generator();
    var actif = this.secondForm.value.StatusCtrl

    var MySignupRequest : SignupRequest= new SignupRequest(username,email,role, password,firstName,lastName,
      new Date(birthDate),city,country,company,jobPosition,mobile,uuidImage,actif);
    
    this.userService.addUser(MySignupRequest).subscribe(
      (response) => {
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
    this.OnUploadImage(uuidImage)

    console.log(birthDate +"  "+ username+"  "+ email+"  "+ password+"  "+role +"  "+ firstName+"  "+ lastName+
    "  "+city +"  "+country +"  "+company +"  "+jobPosition  +"  "+  uuidImage+"  "+ actif );
    console.log(this.firstForm.value)
    console.log(this.secondForm.value)
    console.log(this.thirdForm.value)
  }

  private generator(): string {
    const isString = `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;
    return isString;
  }
  private S4(): string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  public onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }

  public OnUploadImage(uuidImage : string){
    console.log(this.selectedFile);
    //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);
    this.userService.UploadImage(uploadImageData,uuidImage).subscribe(
      (response) => {
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  ReloadPage(){
    window.location.reload();
  }




}



