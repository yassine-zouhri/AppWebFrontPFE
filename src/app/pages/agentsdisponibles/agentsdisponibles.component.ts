import { GridOptions } from '@ag-grid-community/core';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { NbDialogService } from '@nebular/theme';
import { EventService } from "../../service/userService/event.service";
import { UserService } from '../../service/userService/user.service';
import { TokenStorageService } from '../../service/token-storageService/token-storage.service';
import { RondeService } from '../../service/userService/ronde.service';
import { UseravatarRenderer } from '../affectationronde/useravatarRenderer';
import { HttpErrorResponse } from '@angular/common/http';
import { OnlineAgentRequest } from '../../Models/Request/OnlineAgentRequest';
import { Observable } from 'rxjs';
import { CurrentAgentLocationsComponent } from '../current-agent-locations/current-agent-locations.component';
import html2canvas from 'html2canvas-cors';

@Component({
  selector: 'ngx-agentsdisponibles',
  templateUrl: './agentsdisponibles.component.html',
  styleUrls: ['./agentsdisponibles.component.scss']
})
export class AgentsdisponiblesComponent implements OnInit {

  map: google.maps.Map;
  frameworkComponents: any;
  gridOptions: GridOptions;
  loading = false;
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

  private gridApi;
  ListAgentActif=[]
  ListOnlineAgentMarkers=[]
  ListOnlineAgentsWithLoc=[]

  notes_Firebase_DataOnlineAgents :AngularFireList<any>;
  notes_angularOnlineAgents :Observable<any[]>;

  constructor(
    private dialogService: NbDialogService,
    private rondeService: RondeService,
    private datePipe: DatePipe,
    private MyuserService: UserService,
    private tokenStorage: TokenStorageService,
    public db : AngularFireDatabase,
    private eventService: EventService
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
    setTimeout(
      () => {
        this.initMap();
        this.GetOnlineAgents()
      }, 1000
    );

  }

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
        this.toggleLoadingAnimation()
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

  onClickOnUser(event){
    console.log(event)
  }

  onSelectionChanged(event){
    var selectedRows :[] = this.gridApi.getSelectedRows();
    var AgentData : any
    /*if(selectedRows.length==0){
      this.BtnAffectStatus = true
    }else{this.BtnAffectStatus=false}
    console.log(selectedRows.length)
    console.log(selectedRows)*/
    selectedRows.forEach((value)=>{
      AgentData = value
    })
    if(selectedRows.length>0){
      this.dialogService.open(CurrentAgentLocationsComponent, {
        context: {
          agentData: AgentData,
        },
      })
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  getRowNodeId = data => data.matricule;



  clearMarkers() {
    if(this.ListOnlineAgentMarkers!=null){
      for (let i = 0; i < this.ListOnlineAgentMarkers.length; i++) {
        this.ListOnlineAgentMarkers[i].setMap(null);
      }
    }
    console.log(this.ListOnlineAgentMarkers)
    this.ListOnlineAgentMarkers = [];
  }

  GetOnlineAgents(){

    var starCountRef = this.db.database.ref('agentsCurrentLocation');
    starCountRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        this.ListOnlineAgentsWithLoc=[]
        const data = snapshot.val();
        console.log(data)
        this.eventService.GetOnlineAgent().subscribe((agents : OnlineAgentRequest[])=>{
          console.log(agents)
          agents.forEach((agent : OnlineAgentRequest) =>{
            this.ListOnlineAgentsWithLoc.push({"agentId":agent.agentId,"token" :agent.token,
                  "lng":snapshot.toJSON()[agent.agentId]["lng"],"lat":snapshot.toJSON()[agent.agentId]["lat"],
                  "urlImage" : agent.urlImage ,"matricule" : agent.matricule,"username" : agent.username })
          })
          this.gridOptions.api.setRowData(this.ListOnlineAgentsWithLoc)
          console.log(this.ListOnlineAgentsWithLoc)
          this.DrawMarkersOnlineAgentOnMap()
        })
      } else {
        console.log("No data available");
      }
      
    });

  }

  DrawMarkersOnlineAgentOnMap(){
    var bounds = new google.maps.LatLngBounds();
    this.clearMarkers()
    console.log(this.ListOnlineAgentsWithLoc)
    this.ListOnlineAgentMarkers = []
    this.ListOnlineAgentsWithLoc.forEach((data) =>{
      console.log(data)
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
      bounds.extend(marker.getPosition());
      this.ListOnlineAgentMarkers.push(marker)
    })
    //this.map.setCenter(bounds.getCenter());
    this.map.fitBounds(bounds);
  }

}
