import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { NbDialogRef } from '@nebular/theme';
import html2canvas from 'html2canvas-cors';

@Component({
  selector: 'ngx-current-agent-locations',
  templateUrl: './current-agent-locations.component.html',
  styleUrls: ['./current-agent-locations.component.scss']
})
export class CurrentAgentLocationsComponent implements OnInit {


  @Input()  agentData: string;
  map: google.maps.Map;
  ListAgentLocations=[]
  loading = false;

  constructor(protected ref: NbDialogRef<CurrentAgentLocationsComponent>,
    public db: AngularFireDatabase,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    console.log(this.agentData)
    setTimeout(() => {
      this.initMap();
      this.GetLocations()
    }, 500);
    
  }

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map1"), {
      center: { lat: 35.863568, lng: -5.523193 },
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
        let div = document.getElementById("map1");
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
    setTimeout(() => this.loading = false, 3000)
  }

  GetLocations1(){
    var starCountRef = this.db.database.ref('AgentLocation1').child(this.agentData['agentId']).limitToFirst(500);
    starCountRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        this.ListAgentLocations=[]
        console.log(snapshot.val())
        /*const data = snapshot.val();
        console.log(data['00acaf28-4d78-4bf9-9f59-5fcd9713417d'])
        console.log(data.length)*/
        snapshot.forEach((value)=>{
          var item = value.toJSON()
          console.log(item)
          var date = this.datePipe.transform( new Date(item['created_at']), 'yyyy-MM-dd ,h:mm a')
          
          var a=  new Date()
          a.setHours(0);a.setMinutes(0)
          var todayDate = this.datePipe.transform( a, 'yyyy-MM-dd ,h:mm a')
          if(new Date(todayDate)<=new Date(date)){
            this.ListAgentLocations.push(item)
          }
          //console.log(item['created_at'])
          //console.log(date+"      "+todayDate)
          //console.log(date+"      "+todayDate)
          //console.log(new Date(todayDate))
          
        })
        console.log(this.ListAgentLocations)
        setTimeout(() => {
          this.DrawMarkers()
        }, 2000);
      } else {
        console.log("No data available");
      }
      
    });
  }

  GetLocations(){
    var that = this
    var ref =  this.db.database.ref("AgentLocation1").child(this.agentData['agentId']).limitToFirst(100);
    ref.once("value")
    .then(function(snapshot) {
      if (snapshot.exists()) {
        var name = snapshot.toJSON(); // {first:"Ada",last:"Lovelace"}
        console.log(name)
        snapshot.forEach((value)=>{
          var item = value.toJSON()
          that.ListAgentLocations.push(item)
          /*var date = that.datePipe.transform( new Date(item['created_at']), 'yyyy-MM-dd ,h:mm a')
          var a=  new Date()
          a.setHours(0);a.setMinutes(0)
          var todayDate = that.datePipe.transform( a, 'yyyy-MM-dd ,h:mm a')
          if(new Date(todayDate)<=new Date(date)){
            that.ListAgentLocations.push(item)
          }  */
        })
        console.log(that.ListAgentLocations)
        setTimeout(() => {
            that.DrawMarkers()
        }, 2000);
      } else {
        console.log("No data available");
      }
      
    });
  }

  DrawMarkers(){
    var bounds = new google.maps.LatLngBounds();
    this.ListAgentLocations.forEach((data) =>{
      var marker = new google.maps.Marker({
        position: { lat: data["geo_latitude"], lng: data["geo_longitude"] },
        map: this.map,
        optimized: false,
      });
      bounds.extend(marker.getPosition());
    })
    this.map.fitBounds(bounds);
    //this.map.setCenter(bounds.getCenter());
  }

}
