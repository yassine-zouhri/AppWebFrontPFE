import { DatePipe } from "@angular/common";
import { global } from "@angular/compiler/src/util";
import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { NbDialogService } from "@nebular/theme";
import { GridOptions } from "ag-grid-community";
import { Observable } from "rxjs";
import { UserService } from "../../@core/mock/users.service";
import { EventResponse } from "../../Models/Response/EventResponse";
import { TokenStorageService } from "../../service/token-storageService/token-storage.service";
import { EventService } from "../../service/userService/event.service";
import { RondeService } from "../../service/userService/ronde.service";
import * as turf from '@turf/turf';
import { OnlineAgentRequest } from "../../Models/Request/OnlineAgentRequest";
import { UseravatarRenderer } from '../affectationronde/useravatarRenderer';
import { EventinperiodeComponent } from "../eventinperiode/eventinperiode.component";
import html2canvas from "html2canvas-cors";


let MySelectedMarker: google.maps.Marker;

@Component({
  selector: "ngx-event-assignment",
  templateUrl: "./event-assignment.component.html",
  styleUrls: ["./event-assignment.component.scss"],
})



export class EventAssignmentComponent implements OnInit {
  notes_Firebase_DataEvents :AngularFireList<any>;
  notes_angularEvents :Observable<any[]>;

  notes_Firebase_DataOnlineAgents :AngularFireList<any>;
  notes_angularOnlineAgents :Observable<any[]>;
  
  BtnAffectStatus = true
  ListAgentInsideCircle = []
  ListOnlineAgentsWithLoc = []
  ListOnlineAgentMarkers :google.maps.Marker[];
  ListEvent = []
  MySelectedMarkerData :any;
  MyCurrentCircle : google.maps.Circle
  /********* */
  listMarkers = [];
  bounds = new google.maps.LatLngBounds();
  //MySelectedMarker: google.maps.Marker;
  //MySelectedMarkerData :any;
  /********* */
  private gridApi;
  gridOptions: GridOptions;
  frameworkComponents: any;
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
      cellRendererParams: {
        clicked:this.onClickOnUser.bind(this),
      },
      width: 60,
      cellStyle: {'height': '100%','display': 'flex ','justify-content': 'center','align-items': 'center ',}
    },
    { headerName: 'N° matricule',width: 150,field: "matricule" ,filter: true,floatingFilter: true,cellStyle: {'height': '100%','display': 'flex ','justify-content': 'center','align-items': 'center ',} },
    { headerName: 'Username' ,field: "username",width: 115, filter: true,floatingFilter: true,cellStyle: {'height': '100%','display': 'flex ','justify-content': 'center','align-items': 'center ',}},
    
  ];

  map: google.maps.Map;
  MyMarkers: [google.maps.LatLngLiteral][] = [];
  markers: google.maps.Marker[] = [];
  loading = false;
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
      useravatar: UseravatarRenderer,
    }
  }
  ngOnInit(): void {
    var userID = this.tokenStorage.getUser()["id"] 
    this.notes_Firebase_DataEvents= this.db.list('eventsAppWeb/'+userID);
    this.notes_angularEvents=this.notes_Firebase_DataEvents.valueChanges();
    this.notes_Firebase_DataOnlineAgents= this.db.list('agentsCurrentLocation');
    this.notes_angularOnlineAgents=this.notes_Firebase_DataOnlineAgents.valueChanges();
    this.notes_angularOnlineAgents.subscribe((data)=>{
      console.log(data)
    })
    setTimeout(
      () => {
        this.initMap();
        this.GetEvents()
      }, 1000
    );

    //this.GetAllEvent();


  }

  onSelectionChanged(event){
    var selectedRows :[] = this.gridApi.getSelectedRows();
    if(selectedRows.length==0){
      this.BtnAffectStatus = true
    }else{this.BtnAffectStatus=false}
    console.log(selectedRows.length)
    console.log(selectedRows)
  }

  onClickOnUser(event){
    console.log(event)
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
    const centerControlDiv = document.createElement("div");
    this.CenterControl(centerControlDiv, this.map);
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
      centerControlDiv
    );

    const centerControlDivLegend = document.createElement("div");
    this.CenterControlLegend(centerControlDivLegend, this.map);
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
      centerControlDivLegend
    );
    setTimeout(
      () => {
        const legend = document.getElementById("legend") as HTMLElement;
        const div = document.createElement("div");
        div.innerHTML = '<img src="' + "../assets/markers/icons8-bell-30.png" + '"> ' + 'Déja Affecté'+'<br/>'+'<img src="https://img.icons8.com/material-rounded/30/fa314a/bell--v1.png" /> Non Affecté '
          +'<br/>'+'<img style="height:30px;width:30px" src="https://img.icons8.com/ultraviolet/40/000000/change-user-male.png" /> Agent'
        legend.appendChild(div)
        this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
        legend.hidden = true
      }, 3000
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
    controlUI.title = "Click to export image";
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "0px";
    controlText.style.paddingRight = "-2px";
    controlText.style.marginRight = "5px";

    controlText.innerHTML =
      '<svg id="i-download" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9 22 C0 23 1 12 9 13 6 2 23 2 22 10 32 7 32 23 23 22 M11 26 L16 30 21 26 M16 16 L16 30" /></svg>';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
      controlUI.hidden = true;
      this.map.setOptions({ disableDefaultUI: true });
      const legendControl = document.getElementById("controlLegend") as HTMLElement;
      legendControl.hidden=true
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
          const legendControl = document.getElementById("controlLegend") as HTMLElement;
          legendControl.hidden=false
        });
      }, 500);
    });
  }


  CenterControlLegend(controlDiv: Element, map: google.maps.Map) {
    // Set CSS for the control border.
    const controlUI = document.createElement("div");
    controlUI.id="controlLegend"
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginTop = "8px";
    controlUI.style.marginRight = "10px";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Click to display the legend";
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "0px";
    controlText.style.paddingRight = "0px";
    controlText.style.marginRight = "5px";

    controlText.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-menu-button-wide-fill" viewBox="0 0 16 16"><path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v2A1.5 1.5 0 0 0 1.5 5h13A1.5 1.5 0 0 0 16 3.5v-2A1.5 1.5 0 0 0 14.5 0h-13zm1 2h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1zm9.927.427A.25.25 0 0 1 12.604 2h.792a.25.25 0 0 1 .177.427l-.396.396a.25.25 0 0 1-.354 0l-.396-.396zM0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8zm1 3v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2H1zm14-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2h14zM2 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/></svg>';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
      setTimeout(() => {
        const legend = document.getElementById("legend") as HTMLElement;
        const legendControl = document.getElementById("controlLegend") as HTMLElement;
        if(legend.hidden){legend.hidden=false;legend.style.display = "block"}
        else{legend.hidden=true}
        //div.style.display = "block"
      }, 500);
    });
  }

  toggleLoadingAnimation() {
    this.loading = true;
    setTimeout(() => this.loading = false, 4000)
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

  AddMarkers(value) {

    var marker: google.maps.Marker;
    const image1 = {
      url: "../assets/markers/icons8-bell-30.png",
      size: new google.maps.Size(60, 30),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 0),
    };
    const image2 = {
      url: "https://img.icons8.com/material-rounded/30/fa314a/bell--v1.png",
      size: new google.maps.Size(60, 30),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 0),
    };
    if(value["assigned"] ==true){
      marker = new google.maps.Marker({
        position: { lat: value["latitude"], lng: value["longitude"] },
        map: this.map,
        optimized: false,
        icon: image1,
        animation: google.maps.Animation.DROP,
        draggable: true,
      });
      this.bounds.extend(marker.getPosition());
    }else{
      marker = new google.maps.Marker({
        position: { lat: value["latitude"], lng: value["longitude"] },
        map: this.map,
        optimized: false,
        icon: image2,
        animation: google.maps.Animation.DROP,
        draggable: true,
      });
      this.bounds.extend(marker.getPosition());
    }
    
    var that = this;
    marker.addListener("click",function(){ClickOnMarker();that.MySelectedMarkerData = value;});
    function ClickOnMarker(){
      if (MySelectedMarker != null) {
        MySelectedMarker.setAnimation(null);
      }
      if (marker.getAnimation() != null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        MySelectedMarker = marker;
        console.log(MySelectedMarker.getPosition().toJSON());
      }
    }
    
    /*marker.addListener("click", (i) => {
      console.log(i)
      if (this.MySelectedMarker != null) {
        this.MySelectedMarker.setAnimation(null);
      }
      if (marker.getAnimation() != null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        this.MySelectedMarker = marker;
        console.log(this.MySelectedMarker);
      }
    });*/
    this.listMarkers.push(marker);
  }

  GetEvents(){
    this.notes_angularEvents.subscribe(
      (data) =>{
        console.log(data)
        data.forEach(value=>{
          value["date"] = this.datePipe.transform(new Date(value["date"]), 'MM-dd , h:mm a')
          this.AddMarkers(value);
        })
        this.map.fitBounds(this.bounds);
        this.ListEvent = data
      },
      (err) => {
        console.log(JSON.parse(err.error).message);
      }
    )
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
    console.log(this.ListOnlineAgentsWithLoc)
    var radius= document.getElementsByClassName("perimetrEvent")[0]["value"]
    var centerPoint = {lat: MySelectedMarker.getPosition().toJSON().lat, lng: MySelectedMarker.getPosition().toJSON().lng};
    this.ListAgentInsideCircle = []
    this.ListOnlineAgentsWithLoc.forEach((data) =>{
      console.log(data)
      var checkPoint = { lat: data["lat"], lng: data["lng"] }
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

  PointInsideCircle(checkPoint, centerPoint, km) { 
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
  }

  sendEventToAgent(){
    var selectedRows :[] = this.gridApi.getSelectedRows();
    console.log(selectedRows)
    console.log(this.MySelectedMarkerData)
    selectedRows.forEach((user) =>{
      var userId =user["agentId"]
      var eventId = this.MySelectedMarkerData.id
      console.log(userId+"  "+eventId)
      this.eventService.AssignEventToAgent(userId,eventId).subscribe(
        (data) => { console.log(data)},
        err => {
          console.log(JSON.parse(err.error).message)
      })
    })
  }

  ReloadPage(){
    window.location.reload();
  }

  OnChoosePeriodeEvent(){
    this.dialogService.open(EventinperiodeComponent, {
      context: {
        datedebut: document.getElementById("datedebutEvents")['value'],
        datefin: document.getElementById("datefinEvents")['value'],
      },
    })
  }


}
