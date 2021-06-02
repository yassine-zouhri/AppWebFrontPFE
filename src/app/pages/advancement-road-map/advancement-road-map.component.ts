import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { GridOptions } from 'ag-grid-community';
import html2canvas from 'html2canvas-cors';
import { RondeService } from '../../service/userService/ronde.service';
import { UserService } from '../../service/userService/user.service';

@Component({
  selector: 'ngx-advancement-road-map',
  templateUrl: './advancement-road-map.component.html',
  styleUrls: ['./advancement-road-map.component.scss']
})
export class AdvancementRoadMapComponent implements OnInit {

  @Input() MyRoadMap: any;
  map: google.maps.Map;
  CurrentRoadMap=[]
  listCoordPolyLine = []
  listCheckPoint = []
  gridOptions: GridOptions;
  userEmail = "";userMobile="";userfullName="";userMatricule=""
  imageData = ""
  loading = false;
  columnDefs= [
    {headerName: 'N°', field: 'ordre',sortable: true, filter: true,width : 55, resizable: true, },
    {headerName: "Date d'entrée", field: 'enterDate',sortable: true,filter: true,width : 145, resizable: true, },
    {headerName: "Date de sortie", field: 'exitDate',sortable: true,filter: true,width : 145, resizable: true,}];
  //imageData = "data:image/jpeg;base64,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"

  dataTable = []

  constructor(protected ref: NbDialogRef<AdvancementRoadMapComponent>,private rondeService : RondeService,
    private datePipe: DatePipe,private userService : UserService) { 
    this.gridOptions = <GridOptions>{
      enableColResize: true,
      floatingFilter: true,
    }
  }

  ngOnInit(): void {
    console.log(this.MyRoadMap)
    this.initMap()
    this.getRoadMapStatus(this.MyRoadMap["idRoadMap"])
    this.getUserInfo(this.MyRoadMap["idAgent"])
  }

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 35.863568, lng: -5.523193 },
      zoom: 14,
    });
    var title = "Point de controle N° "
    this.map.addListener("click", (mapsMouseEvent) => {
    });
    const centerControlDiv = document.createElement("div");
    this.CenterControl(centerControlDiv, this.map);
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
      centerControlDiv
    );
  }

  CenterControl(controlDiv: Element, map: google.maps.Map) {
    // Set CSS for the control border.
    const controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginTop = "8px";
    controlUI.style.marginRight = "10px";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Click to recenter the map";
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "0px";
    controlText.style.marginRight = "5px";

    controlText.innerHTML =
      '<svg id="i-download" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9 22 C0 23 1 12 9 13 6 2 23 2 22 10 32 7 32 23 23 22 M11 26 L16 30 21 26 M16 16 L16 30" /></svg>';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
      
      controlUI.hidden = true;
      this.map.setOptions({ disableDefaultUI: true });
      setTimeout(() => {
        let div = document.getElementById("map");
        var that =this
        that.toggleLoadingAnimation()
        html2canvas(div, {
          allowTaint: false,
          useCORS: true,
          logging: true,
        }).then(function (canvas) {
          var image = canvas.toDataURL();
          var aDownloadLink = document.createElement("a");
          aDownloadLink.download = "map_capture.png";
          aDownloadLink.href = image;
          aDownloadLink.click();
          controlUI.hidden = false;
          that.map.setOptions({ disableDefaultUI: false });
        });
      }, 500);
    });
  }

  
  toggleLoadingAnimation() {
    this.loading = true;
    setTimeout(() => this.loading = false, 3000)
  }

  getRoadMapStatus(inRoaMap : number){
    this.rondeService.getStatusRoadMap(inRoaMap).subscribe(
      data  => {
        var bounds = new google.maps.LatLngBounds();
        var index = 0
        var Myindex = 0;var enterDate='Pas encore';var exitDate='Pas encore'
        data.forEach((value) =>{
          this.CurrentRoadMap.push(value)
          if(value.dateEvent != null && value.typeEvent =="Exit"){
            exitDate = this.datePipe.transform( value.dateEvent, 'yyyy-MM-dd ,h:mm a')
            var MyMarker =new google.maps.Marker({
              position: {lat:value.latitude,lng:value.longitude},
              map : this.map,
              icon:"https://img.icons8.com/flat-round/64/000000/checkmark.png",
              optimized: false,
            });
            bounds.extend(MyMarker.getPosition());
            this.listCoordPolyLine.push({ lat: value.latitude, lng: value.longitude })
          }else if(value.dateEvent == null && value.typeEvent =="Exit"){
            var MyMarker =new google.maps.Marker({
              position: {lat:value.latitude,lng:value.longitude},
              map : this.map,
              label: `${Math.trunc(index/2)+1}`,
              optimized: false,
            });
            bounds.extend(MyMarker.getPosition());
            this.listCoordPolyLine.push({ lat: value.latitude, lng: value.longitude })
          }else if(value.typeEvent =="Enter" && value.dateEvent != null ){
            enterDate = this.datePipe.transform( value.dateEvent, 'yyyy-MM-dd , h:mm a')
          }
          
          index++;Myindex++;
          if(Myindex ==2){
            this.dataTable.push({'ordre' : index/2,'enterDate':enterDate,'exitDate':exitDate})
            enterDate='Pas encore';exitDate='Pas encore';Myindex=0
          }
        })
        const flightPath = new google.maps.Polyline({
          path: this.listCoordPolyLine,
          geodesic: true,
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 4,
        });
        this.map.setCenter(this.listCoordPolyLine[0]); 
        flightPath.setMap(this.map);
        console.log(this.CurrentRoadMap)
        console.log(this.dataTable)
        this.gridOptions.api.setRowData( this.dataTable)
        this.map.fitBounds(bounds);
      },
      err => {
        console.log(JSON.parse(err.error).message)
    })
  }

  getUserInfo(userId : number){
    this.userService.getUserById(userId).subscribe(
      (response  ) => {
        console.log(response);
        this.userEmail = response["email"]
        this.userMobile = response["mobile"]
        this.userfullName=response["lastName"]+" "+response["firstName"]
        this.userMatricule = response["matricule"]
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    )
    this.userService.getImage(userId).subscribe(
      data => {
        var retrieveResonse = data;
        var base64Data = retrieveResonse["data"];
        var retrievedImage = 'data:image/jpeg;base64,' + base64Data;
        this.imageData = retrievedImage 
        //console.log(this.retrievedImage)
      },
      err => {
        console.log(JSON.parse(err.error).message)
      }
    );
  }

}
