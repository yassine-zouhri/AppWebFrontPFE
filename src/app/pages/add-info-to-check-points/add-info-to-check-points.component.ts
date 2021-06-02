import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import * as $ from 'jquery';
import { RondeRequest } from '../../Models/Request/RondeRequest';
import { RondeService } from '../../service/userService/ronde.service';
import { AffectationrondeComponent } from '../affectationronde/affectationronde.component';


@Component({
  selector: "ngx-add-info-to-check-points",
  templateUrl: "./add-info-to-check-points.component.html",
  styleUrls: ["./add-info-to-check-points.component.scss"],
})
export class AddInfoToCheckPointsComponent implements OnInit {
  @Input() ListPointControle: any[];
  arrayImages = [];
  MyUUIDimage = []
  MyDescriptions = []
  loading = false
  MyCurrentRoaMapId ;
  constructor(
    protected ref: NbDialogRef<AddInfoToCheckPointsComponent>,
    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private rondeService : RondeService,
    private router: Router,private dialogService: NbDialogService
  ) {
  }

  ngOnInit(): void {
    console.log(this.ListPointControle);
    this.InitialiseListImages()
  }

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }

  onSelect(event,i) {
    this.arrayImages[i].push(event.addedFiles)
    console.log(this.arrayImages)
  }

  onRemove(event,i) {
    console.log(event);
    this.arrayImages[i].splice(this.arrayImages[i].indexOf(event), 1);
    console.log(this.arrayImages )
  }

  InitialiseListImages(){
    var arrayImages1 = [];
    var index = 0
    this.ListPointControle.forEach(function (value) {
      var Myfiles: File[] = [];
      arrayImages1.push(Myfiles)
    })
    this.arrayImages = arrayImages1
    
  }

  public OnUploadImage(){
    this.loading = true
    this.MyUUIDimage = []
    this.arrayImages.forEach(function (value) {
      var uuidImage = this.generator()
      this.MyUUIDimage.push(uuidImage)
      if(value.length>0){
        //console.log(value[0][0])
        //console.log(this.MyUUIDimage)
        const uploadImageData = new FormData();
        uploadImageData.append('imagePControle',value[0][0] , value[0][0].name);
        this.rondeService.UploadImage(uploadImageData,uuidImage).subscribe(
          (response) => {
            console.log(response);
          },
          (error: HttpErrorResponse) => {
            console.log(error.message);
          }
        )
      }else{
        const uploadImageData = new FormData();
        this.rondeService.UploadImage(uploadImageData,uuidImage).subscribe(
          (response) => {
            console.log(response);
          },
          (error: HttpErrorResponse) => {
            console.log(error.message);
          }
        )
      }
    },this)
    console.log(this.MyUUIDimage)
    console.log(this.arrayImages)
    this.SendRoadMapInfo()
    setTimeout(()=>{
      this.ReloadPage()
    },3000)

  }

  public getDescriptions(){
    this.MyDescriptions=[]
    for(var i = 0;i<this.arrayImages.length;i++){
      var description = document.getElementsByClassName("descriptionCP"+i)[0]["value"]
      if(description==null || description.length ==0){this.MyDescriptions.push("Rien")}
      else{this.MyDescriptions.push(document.getElementsByClassName("descriptionCP"+i)[0]["value"])}
    }
    console.log(this.MyDescriptions)
  }

  SendRoadMapInfo(){
    this.getDescriptions()
    
    var datedebut = document.getElementsByClassName("DateDebut")[0]["value"]
    var datefin  = document.getElementsByClassName("Datefin")[0]["value"]
    var geofenceredius  = document.getElementsByClassName("geofenceredius")[0]["value"]
    var MylistOfCheckPoint : any[] = []
    var index = 0
    this.ListPointControle.forEach(function (value) {
      MylistOfCheckPoint[ index]=[value["lat"],value["lng"]]
      index++;
    })
    var roadmap = new RondeRequest(datedebut ,datefin ,geofenceredius,this.MyUUIDimage,MylistOfCheckPoint,this.MyDescriptions)
    console.log(datedebut+"   "+datefin+"   "+geofenceredius)
    this.rondeService.AddRoadMap(roadmap).subscribe(
      (response) => {
        console.log(response);
        this.MyCurrentRoaMapId = response["id"]
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    )
  }

  generator(): string {
    const isString = `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;
    return isString;
  }
  private S4(): string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  ReloadPage(){
    window.location.reload();
  }

  GoBack(){
    this.router.navigate(['/pages/listeRondes']);
  }

  ValidateAndAssign(){
    this.loading = true
    this.MyUUIDimage = []
    this.arrayImages.forEach(function (value) {
      var uuidImage = this.generator()
      this.MyUUIDimage.push(uuidImage)
      if(value.length>0){
        //console.log(value[0][0])
        //console.log(this.MyUUIDimage)
        const uploadImageData = new FormData();
        uploadImageData.append('imagePControle',value[0][0] , value[0][0].name);
        this.rondeService.UploadImage(uploadImageData,uuidImage).subscribe(
          (response) => {
            console.log(response);
          },
          (error: HttpErrorResponse) => {
            console.log(error.message);
          }
        )
      }else{
        const uploadImageData = new FormData();
        this.rondeService.UploadImage(uploadImageData,uuidImage).subscribe(
          (response) => {
            console.log(response);
          },
          (error: HttpErrorResponse) => {
            console.log(error.message);
          }
        )
      }
    },this)
    this.SendRoadMapInfo()
    var a  = 3
    setTimeout(()=>{
      this.cancel()
      this.dialogService.open(AffectationrondeComponent, {
        context: {
          MyRoadMap: this.MyCurrentRoaMapId,
        },
      })
    },3000)   
  }
  


}
