import { Component, Input, OnInit } from '@angular/core';
import { Grid, GridOptions, Module} from '@ag-grid-community/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { RondeService } from '../../service/userService/ronde.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../../service/userService/user.service';
import { TokenStorageService } from '../../service/token-storageService/token-storage.service';
import { EventService } from '../../service/userService/event.service';
import { UseravatarRendererEvent } from './UseravatarRendererEvent';
import { OnlineAgentRequest } from '../../Models/Request/OnlineAgentRequest';
import html2canvas from 'html2canvas-cors';

let MySelectedMarker: google.maps.Marker;

@Component({
  selector: 'ngx-affectation-event',
  templateUrl: './affectation-event.component.html',
  styleUrls: ['./affectation-event.component.scss']
})
export class AffectationEventComponent implements OnInit {

  @Input() MyEvent: any;
  gridOptions: GridOptions;
  frameworkComponents: any;
  private gridApi;
  leftColumns = [
    {
      colId: 'checkbox',
      maxWidth: 50,
      checkboxSelection: true,
      suppressMenu: true,
      headerCheckboxSelection: true,
      
    },
    {
      headerName: '',
      field: "urlImage",
      cellRenderer: "useravatar",
      width: 60,
      cellStyle: {'height': '100%','display': 'flex ','justify-content': 'center','align-items': 'center ',}
    },
    { headerName: 'N° matricule',field: "matricule" ,filter: true,floatingFilter: true,cellStyle: {'height': '100%','display': 'flex ','justify-content': 'center','align-items': 'center ',} },
    
  ];

  notes_Firebase_DataOnlineAgents :AngularFireList<any>;
  notes_angularOnlineAgents :Observable<any[]>;
  ListAgentInsideCircle = []
  ListOnlineAgentsWithLoc = []
  ListOnlineAgentMarkers :google.maps.Marker[];
  map: google.maps.Map;
  MyCurrentCircle : google.maps.Circle
  BtnAffectStatus = true
  loading = false
  constructor(
    private dialogService: NbDialogService,
    private rondeService: RondeService,
    private datePipe: DatePipe,
    private MyuserService: UserService,
    private tokenStorage: TokenStorageService,
    private eventService: EventService,
    public db : AngularFireDatabase
  ) {
    this.gridOptions = <GridOptions>{
      rowHeight: 60,
      defaultColDef: {
        resizable: true,
      },
    };
    this.frameworkComponents = {
      useravatar: UseravatarRendererEvent,
    }
   }

  ngOnInit(): void {
    console.log(this.MyEvent)
    setTimeout(
      () => {
        this.initMap();
      }, 500
    );
  }

  onSelectionChanged(event){
    var selectedRows :[] = this.gridApi.getSelectedRows();
    if(selectedRows.length==0){
      this.BtnAffectStatus = true
    }else{this.BtnAffectStatus=false}
    console.log(selectedRows.length)
    console.log(selectedRows)
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  getRowNodeId = data => data.matricule;

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 35.7901383, lng: -5.8129017 },
      zoom: 14,
      styles: [
        {
          featureType: "poi",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.business",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
      ],
    });
    var marker: google.maps.Marker;
    const image = {
      url: "https://img.icons8.com/material-rounded/30/fa314a/bell--v1.png",
      size: new google.maps.Size(60, 30),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 0),
    };
    marker = new google.maps.Marker({
      position: { lat: this.MyEvent["latitude"], lng: this.MyEvent["longitude"] },
      map: this.map,
      optimized: false,
      icon: image,
      animation: google.maps.Animation.DROP,
      draggable: true,
    });
    MySelectedMarker = marker
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
        this.toggleLoadingAnimation()
        var that =this
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
    setTimeout(() => this.loading = false, 4000)
  }


  GetOnlineAgents(){
    this.ListOnlineAgentsWithLoc=[]
    var that = this
    var ref =  this.db.database.ref("agentsCurrentLocation")
    ref.once("value")
    .then(function(snapshot) {
      var name = snapshot.toJSON(); // {first:"Ada",last:"Lovelace"}
      console.log(name)
      that.eventService.GetOnlineAgent().subscribe((agents : OnlineAgentRequest[])=>{
        console.log(agents)
        agents.forEach((agent : OnlineAgentRequest) =>{
          that.ListOnlineAgentsWithLoc.push({"agentId":agent.agentId,"token" :agent.token,
                "lng":snapshot.toJSON()[agent.agentId]["lng"],"lat":snapshot.toJSON()[agent.agentId]["lat"],
                "urlImage" : agent.urlImage ,"matricule" : agent.matricule,"username" : agent.username })
        })
        console.log(that.ListOnlineAgentsWithLoc)
        that.DrawMarkersOnlineAgentOnMap()
      })
    });
  }

  DrawMarkersOnlineAgentOnMap(){
    this.clearMarkers()
    console.log("datadatadatadatadatadatadatadatadata")
    console.log(this.ListOnlineAgentsWithLoc)
    var radius= document.getElementsByClassName("perimetrEvent")[0]["value"]
    var centerPoint = {lat: MySelectedMarker.getPosition().toJSON().lat, lng: MySelectedMarker.getPosition().toJSON().lng};
    this.ListAgentInsideCircle = []
    this.ListOnlineAgentsWithLoc.forEach((data) =>{
      console.log(data)
      var checkPoint = { lat: data["lat"], lng: data["lng"] }
      console.log(checkPoint)
      console.log("this.PointInsideCircle(checkPoint, centerPoint, radius/1000)  "+this.PointInsideCircle(checkPoint, centerPoint, radius/1000))
      if(this.PointInsideCircle(checkPoint, centerPoint, radius/1000)){
        const image = {
          url: "https://img.icons8.com/ultraviolet/40/000000/change-user-male.png",
          size: new google.maps.Size(60, 30),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0),
        };
  
        var marker = new google.maps.Marker({
          position: { lat: data["lat"], lng: data["lng"] },
          map: this.map,
          optimized: false,
          icon: image
        });
        this.ListOnlineAgentMarkers.push(marker)
        this.ListAgentInsideCircle.push(data)
        this.gridOptions.api.setRowData( this.ListAgentInsideCircle)
        console.log(this.ListAgentInsideCircle)
      }   
    })
  }

  clearMarkers() {
    console.log(this.ListOnlineAgentMarkers)
    if(this.ListOnlineAgentMarkers!=null){
      for (let i = 0; i < this.ListOnlineAgentMarkers.length; i++) {
        this.ListOnlineAgentMarkers[i].setMap(null);
      }
    }
    console.log(this.ListOnlineAgentMarkers)
    this.ListOnlineAgentMarkers = [];
  }

  PointInsideCircle(checkPoint, centerPoint, km) { 
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
  }

  DrawParameter(){
    this.GetOnlineAgents()
    setTimeout(
      () => {
        var radius= document.getElementsByClassName("perimetrEvent")[0]["value"]
        /*var center = [35.7901383, -5.8129017];
        var radius = 5;
        var options = {steps: 10, units: 'kilometers', properties: {foo: 'bar'}};
        var circle = turf.circle(center, radius, options);*/
        if(this.MyCurrentCircle != null){this.MyCurrentCircle.setMap(null)}
        const eventCircle = new google.maps.Circle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.5,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map :this.map,
          center: MySelectedMarker.getPosition().toJSON(),
          radius: parseInt(radius),
        });
        this.map.setCenter(MySelectedMarker.getPosition().toJSON())
        this.map.setZoom(18)
        this.MyCurrentCircle = eventCircle
      }, 1000
    ); 
  }

  ReloadPage(){
    window.location.reload();
  }

  sendEventToAgent(){
    var selectedRows :[] = this.gridApi.getSelectedRows();
    console.log(selectedRows)
    selectedRows.forEach((user) =>{
      var userId =user["agentId"]
      var eventId = this.MyEvent.idEvent
      console.log(userId+"  "+eventId)
      this.eventService.AssignEventToAgent(userId,eventId).subscribe(
        (data) => { 
          console.log(data)
          this.ReloadPage()
        },
        err => {
          console.log(JSON.parse(err.error).message)
      })
    })
  }


}
