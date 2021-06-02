import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { NbDialogRef } from "@nebular/theme";
import { Observable } from "rxjs";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import download from "downloadjs";

import jsPDF from "jspdf";
import html2canvas from "html2canvas-cors";

let MySelectedMarker: google.maps.Marker;

@Component({
  selector: "ngx-eventinperiode",
  templateUrl: "./eventinperiode.component.html",
  styleUrls: ["./eventinperiode.component.scss"],
})
export class EventinperiodeComponent implements OnInit {
  @Input() datedebut: string;
  @Input() datefin: string;
  notes_Firebase_DataEvents: AngularFireList<any>;
  notes_angularEvents: Observable<any[]>;
  ListAllEvents = [];
  map: google.maps.Map;
  listMarkers = [];
  MySelectedMarkerData: any;
  loading = false;
  constructor(
    protected ref: NbDialogRef<EventinperiodeComponent>,
    public db: AngularFireDatabase,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.notes_Firebase_DataEvents = this.db.list("allEvents");
    this.notes_angularEvents = this.notes_Firebase_DataEvents.valueChanges();
    this.GetAllEvents();
    setTimeout(() => {
      this.DrawMarkers();
    }, 1000);
  }

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }

  GetAllEvents() {
    this.datedebut = this.datePipe.transform(
      this.datedebut,
      "yyyy-MM-dd , h:mm a"
    );
    this.datefin = this.datePipe.transform(this.datefin, "yyyy-MM-dd , h:mm a");
    console.log(this.datedebut + "      " + this.datefin);
    this.notes_angularEvents.subscribe((events) => {
      console.log(events);
      this.ListAllEvents = [];
      events.forEach((value) => {
        value["date"] = this.datePipe.transform(
          new Date(value["date"]),
          "yyyy-MM-dd , h:mm a"
        );
        if (this.datedebut == null && this.datefin.length > 0) {
          if (new Date(value["date"]) <= new Date(this.datefin)) {
            this.ListAllEvents.push(value);
          }
        } else if (this.datefin == null && this.datedebut.length > 0) {
          if (new Date(this.datedebut) <= new Date(value["date"])) {
            this.ListAllEvents.push(value);
          }
        } else if (this.datedebut.length > 0 && this.datefin.length > 0) {
          if (
            new Date(this.datedebut) <= new Date(value["date"]) &&
            new Date(value["date"]) <= new Date(this.datefin)
          ) {
            this.ListAllEvents.push(value);
          }
        }
      });
      console.log(this.ListAllEvents);
    });
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

  DrawMarkers() {
    var bounds = new google.maps.LatLngBounds();
    this.ListAllEvents.forEach((value) => {
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
      if (value["statut"] == true) {
        marker = new google.maps.Marker({
          position: { lat: value["latitude"], lng: value["longitude"] },
          map: this.map,
          optimized: false,
          icon: image1,
          animation: google.maps.Animation.DROP,
          draggable: true,
        });
        this.listMarkers.push(marker);
        bounds.extend(marker.getPosition());
      } else {
        marker = new google.maps.Marker({
          position: { lat: value["latitude"], lng: value["longitude"] },
          map: this.map,
          optimized: false,
          icon: image2,
          animation: google.maps.Animation.DROP,
          draggable: true,
        });
        this.listMarkers.push(marker);
        bounds.extend(marker.getPosition());
      }
      var that = this;
      marker.addListener("click", function () {
        ClickOnMarker();
        that.MySelectedMarkerData = value;
        console.log(that.MySelectedMarkerData);
      });
      function ClickOnMarker() {
        if (MySelectedMarker != null) {
          MySelectedMarker.setAnimation(null);
          marker.setAnimation(null);
        }
        if (marker.getAnimation() != null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          MySelectedMarker = marker;
        }
      }
    });
    this.map.fitBounds(bounds);
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
    setTimeout(() => this.loading = false, 4000)
  }

  
}
