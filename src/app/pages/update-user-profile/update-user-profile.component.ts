import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { SignupRequest } from '../../Models/Request/SignupRequest';
import { UpdateProfileRequest } from '../../Models/Request/UpdateProfileRequest ';
import { UserService } from '../../service/userService/user.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { MyErrorStateMatcher } from '../add-user/MyErrorStateMatcher';

@Component({
  selector: 'ngx-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.scss']
})
export class UpdateUserProfileComponent implements OnInit {

  @Input() MyUser: any;
  @Input() uuidImage : string;

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
    
  }

  GetRole(role : string) {
    var Monrole
    switch(role){
      case 'ROLE_ADMINISTRATEUR' : {
        Monrole='administrateur'
        break
      }
      case 'ROLE_SUPERVISEUR' : {
        Monrole='superviseur'
        break
      }
      case 'ROLE_CHEF_POSTE' : {
        Monrole='administrateur'
        break
      }
      case 'ROLE_MANAGER' : {
        Monrole='chef de poste'
        break
      }
      case 'ROLE_AGENT' : {
        Monrole='manager'
        break
      }
      default: { 
        Monrole='agent'
        break; 
     } 
    }
    return Monrole
  }

  updateDataProfile(){
    setTimeout(
      () => {
        this.firstForm.get('NomCtrl').setValue(this.MyUser["lastName"])
        this.firstForm.get('PrenomCtrl').setValue(this.MyUser["firstName"])
        this.firstForm.get('VilleCtrl').setValue(this.MyUser["city"])
        this.firstForm.get('PaysCtrl').setValue(this.MyUser["pays"])
        this.firstForm.get('EntrepriseCtrl').setValue(this.MyUser["company"])
        this.firstForm.get('EchelleCtrl').setValue(this.MyUser["jobPosition"])
        this.firstForm.get('AnniversaireCtrl').setValue(this.MyUser["birthDate"])
        this.firstForm.get('MobileCtrl').setValue(this.MyUser["Mobile"])
        this.secondForm.get('UsernameCtrl').setValue(this.MyUser["username"])
        this.secondForm.get('EmailCtrl').setValue(this.MyUser["email"])
        this.secondForm.get('RoleCtrl').setValue(this.GetRole(this.MyUser["role"]))
        this.secondForm.get('StatusCtrl').setValue(this.MyUser["actif"])
      }, 500
    );
    
  }

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }

  ngOnInit(): void {
    this.updateDataProfile()
    console.log("titletitletitletitletitletitle +"+this.MyUser["username"])
    console.log("uuidImageuuidImageuuidImageuuidImageuuidImageuuidImageuuidImagee +"+this.uuidImage)


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
      UsernameCtrl: [{value: '', disabled: true}, [Validators.required,Validators.minLength(5)],[this.usernameExistsValidator()]],
      EmailCtrl: [{value: '', disabled: true}, [Validators.required,Validators.email],[this.emailExistsValidator()]],
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
    var username = this.MyUser["username"]
    var email = this.MyUser["email"]
    var password = this.secondForm.value.PasswordCtrl
    var role = this.secondForm.value.RoleCtrl
    var firstName = this.firstForm.value.PrenomCtrl
    var lastName = this.firstForm.value.NomCtrl
    var city = this.firstForm.value.VilleCtrl
    var country = this.firstForm.value.PaysCtrl
    var company = this.firstForm.value.EntrepriseCtrl
    var mobile = this.firstForm.value.MobileCtrl
    var jobPosition = this.firstForm.value.EchelleCtrl
    var uuidImage :string= this.uuidImage
    var actif = this.secondForm.value.StatusCtrl


    var MySignupRequest : UpdateProfileRequest= new UpdateProfileRequest(username,role, password,firstName,lastName,
      new Date(birthDate),city,country,company,jobPosition,mobile,actif);
    
    this.userService.UpdateProfileUser(MySignupRequest).subscribe(
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

  public onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }

  public OnUploadImage(uuidImage : string){
    console.log(this.selectedFile);
    //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);
    console.log(uploadImageData)
    this.userService.UpdateImageUser(uploadImageData,uuidImage).subscribe(
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
