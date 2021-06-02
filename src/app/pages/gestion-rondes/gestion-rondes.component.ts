import { DatePipe, DOCUMENT } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { NbDialogService } from '@nebular/theme';
import { GridOptions, RefreshCellsParams } from 'ag-grid-community';
import html2canvas from 'html2canvas-cors';
import { map } from 'rxjs/operators';
import { RoadMapResponse } from '../../Models/Response/RoadMapResponse';
import { TokenStorageService } from '../../service/token-storageService/token-storage.service';
import { RondeService } from '../../service/userService/ronde.service';
import { UserService } from '../../service/userService/user.service';
import { AddInfoToCheckPointsComponent } from '../add-info-to-check-points/add-info-to-check-points.component';
import { BtnCellRenderer } from './BtnCellRenderer';
import { ShowRoadMapRenderer } from './ShowRoadMapRenderer';


@Component({
  selector: 'ngx-gestion-rondes',
  templateUrl: './gestion-rondes.component.html',
  styleUrls: ['./gestion-rondes.component.scss']
})
export class GestionRondesComponent implements OnInit {


  /********* */
  listRoadMap =[];
  listIdRoadMap = []
  gridOptions2: GridOptions;
  frameworkComponents2: any;
  listMarkersRoadMap =[];
  listCheckPoints = []
  listImageCurrentRoadMap = []
  CurrentRoadMapUUIDimage = []
  ListDescription = []
  loading = false;
  columnDefs2= [
    {
      field: "",
      cellRenderer: "btnShowRoadMapRenderer",
      cellRendererParams: {
        clicked:this.onClickOnRoadMap.bind(this),
      },
      width: 70
    },
    {headerName: 'Ordre', field: 'ordre', hide:true,width :75,sortable: true, filter: true ,type: 'numberColumn'  },
    {headerName: 'Création', field: 'created_at',sortable: true, type : 'dateColumn'},
    {headerName: 'Status', field: 'status', width :90,sortable: true, filter: true},
    {headerName: 'Assigné', field: 'assigned',width :90,sortable: true, filter: true},
    
    
    /*75,100,90
    {headerName: 'Latitude', field: 'lat',sortable: true, filter: true , width :90}, */
   
 ];

  /********* */

  TerminerRonde =true;
  gridOptions: GridOptions;
  AddMarkersPermission : boolean = false
  listMarkers =[];
  frameworkComponents: any;
  columnDefs= [
    {headerName: 'Ordre', field: 'ordre',rowDrag: true , width :65 },
    {headerName: 'Longitude', field: 'lng',width :120},
    {headerName: 'Latitude', field: 'lat',width :120},
    {
      field: "action",
      cellRenderer: "btnCellRenderer",
      cellRendererParams: {
        clicked:this.onDeleteItem.bind(this),
      },
      minWidth: 150
    }
    /*75,100,90
    {headerName: 'Latitude', field: 'lat',sortable: true, filter: true , width :90}, */
   
 ];



  map: google.maps.Map;
  MyMarkers: [google.maps.LatLngLiteral][] = [];
  markers: google.maps.Marker[] = [];
  constructor(private dialogService: NbDialogService,private rondeService : RondeService,
    private datePipe: DatePipe,private MyuserService : UserService,private tokenStorage: TokenStorageService,) { 
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer,
    }

    this.frameworkComponents2 = {
      btnShowRoadMapRenderer: ShowRoadMapRenderer,
    }
  
    this.gridOptions = <GridOptions>{
    };

    this.gridOptions2 = <GridOptions>{
      enableColResize: true,
      floatingFilter: true,
      columnTypes: {
        numberColumn: { width: 130, filter: 'agNumberColumnFilter' },
        nonEditableColumn: { editable: false },
        dateColumn: {
          // specify we want to use the date filter
          filter: 'agDateColumnFilter',
    
          // add extra parameters for the date filter
          filterParams: {
            // provide comparator function
            comparator: function (filterLocalDateAtMidnight, cellValue) {
              // In the example application, dates are stored as dd/mm/yyyy
              // We create a Date object for comparison against the filter date
              console.log(cellValue)
              var date = datePipe.transform(new Date(cellValue), 'dd/MM/yyyy')
              var dateParts = date.split('/');
              var day = Number(dateParts[0]);
              var month = Number(dateParts[1]) - 1;
              var year = Number(dateParts[2]);
              var cellDate = new Date(year, month, day);
    
              // Now that both parameters are Date objects, we can compare
              if (cellDate < filterLocalDateAtMidnight) {
                return -1;
              } else if (cellDate > filterLocalDateAtMidnight) {
                return 1;
              } else {
                return 0;
              }
            },
          },
        },
      },
    };
  }

  

  ngOnInit(): void {
    setTimeout(
      () => {
        this.initMap();
      }, 1000
    );
    this.GetALlRoadMap()
  }

  activateValidateRoadButton(){
    if(this.listMarkers.length>0){
      this.TerminerRonde = false
    }else{this.TerminerRonde = true}
  }

  onRowDragMove(event) {
    var movingNode = event.node;
    var overNode = event.overNode;
    var rowNeedsToMove = movingNode !== overNode;
    if (rowNeedsToMove) {
      var movingData = movingNode.data;
      var overData = overNode.data;
      var fromIndex = this.listMarkers.indexOf(movingData);
      var toIndex = this.listMarkers.indexOf(overData);
      var newStore = this.listMarkers.slice();
      this.moveInArray(newStore, fromIndex, toIndex);
      //this.RefreshMapWhenDragRows(newStore)
      console.log(newStore)
    }
  }

  moveInArray(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 35.863568, lng: -5.523193 },
      zoom: 14,
    });
    var title = "Point de controle N° "
    this.map.addListener("click", (mapsMouseEvent) => {
        if(this.AddMarkersPermission==true){
          const infoWindow = new google.maps.InfoWindow();
          var MyMarkersLength = this.listMarkers.length
          this.listMarkers[MyMarkersLength]={ordre:MyMarkersLength+1,lat:mapsMouseEvent.latLng.toJSON().lat,lng:mapsMouseEvent.latLng.toJSON().lng}
          this.clearMarkers()
          this.listMarkers.forEach((value)=> {
            var MyMarker =new google.maps.Marker({
              position: {lat:value["lat"],lng:value["lng"]},
              map : this.map,
              title: `${title} ${value["ordre"]}`,
              label: `${value["ordre"]}`,
              optimized: false,
            });
            this.markers.push(MyMarker)
            MyMarker.addListener("click", () => {
              infoWindow.close();
              infoWindow.setContent(MyMarker.getTitle());
              infoWindow.open(MyMarker.getMap(), MyMarker);
            });
          })
          this.gridOptions.api.setRowData( this.listMarkers)
          this.activateValidateRoadButton()
        }
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

  EnableAddingMArkers(){
    this.ClearlistMarkersRoadMap()
    this.AddMarkersPermission=true
  }
  onDeleteItem(e) {
    const infoWindow = new google.maps.InfoWindow();
    var title = "Point de controle N° "
    this.removeItemFromArray(this.listMarkers,e)
    this.gridOptions.api.setRowData( this.listMarkers)
    console.log(this.listMarkers)
    this.clearMarkers()
    var MyDeletedMarker = {lat : e["lat"],lng: e["lng"]}
    this.ClearMaerkersByNumero(MyDeletedMarker)
    this.listMarkers = this.ReOrdreMyMarkers()
    this.listMarkers.forEach((value)=> {
      var MyMarker =new google.maps.Marker({
        position: {lat:value["lat"],lng:value["lng"]},
        map : this.map,
        title: `${title} ${value["ordre"]}`,
        label: `${value["ordre"]}`,
        optimized: false,
      });
      this.markers.push(MyMarker)
      MyMarker.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent(MyMarker.getTitle());
        infoWindow.open(MyMarker.getMap(), MyMarker);
      });
    })
    this.activateValidateRoadButton()
  }
  
  removeItemFromArray(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  clearMarkers() {
    this.setMapOnAll(null);
    this.markers= [];
  }

  setMapOnAll(map: google.maps.Map | null) {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  ClearMaerkersByNumero(value){
    for (let i = 0; i < this.markers.length; i++) {
      if(this.markers[i].getPosition().toJSON().lng==value["lng"] && this.markers[i].getPosition().toJSON().lat==value["lat"]){
          this.removeItemFromArray(this.markers, this.markers[i])
          break
      }
    }
  }

  ReOrdreMyMarkers(){
    var NewlistMarkers =[];
    var index = 0
    this.listMarkers.forEach((value)=> {
      NewlistMarkers[index] = {ordre : index+1, lat :value["lat"], lng : value["lng"]}
      index++
    })
    return NewlistMarkers
  }

  onRowDragEnd(event) {
    var fromIndex = parseInt(event.overNode.id);
    var toIndex = event.node.rowIndex;
    console.log(fromIndex);
    console.log('   to      ');
    console.log(toIndex);
    var OldIndexMarker = this.listMarkers[fromIndex]
    var NewIndexMarker = this.listMarkers[toIndex]
    this.listMarkers[fromIndex] = NewIndexMarker
    this.listMarkers[toIndex] = OldIndexMarker
    //this.moveInArray(newStore, fromIndex, toIndex);
    this.RefreshMapWhenDragRows(this.listMarkers)
    
  }

  RefreshMapWhenDragRows(value : any[]){
    const infoWindow = new google.maps.InfoWindow();
    var title = "Point de controle N° "
    var NewlistMarkers =[];
    var index = 0
    console.log(value)
    value.forEach((marker)=> {
      NewlistMarkers[index] = {ordre : index+1, lat :marker["lat"], lng : marker["lng"]}
      index++
    })
    this.listMarkers = NewlistMarkers
    this.clearMarkers()
    this.gridOptions.api.setRowData( this.listMarkers)
    this.listMarkers.forEach((value)=> {
      var MyMarker =new google.maps.Marker({
        position: {lat:value["lat"],lng:value["lng"]},
        map : this.map,
        title: `${title} ${value["ordre"]}`,
        label: `${value["ordre"]}`,
        optimized: false,
      });
      this.markers.push(MyMarker)
      MyMarker.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent(MyMarker.getTitle());
        infoWindow.open(MyMarker.getMap(), MyMarker);
      });
    })
  }

  AddRoadMap(){
    this.dialogService.open(AddInfoToCheckPointsComponent, {
      context: {
        ListPointControle: this.listMarkers,
      },
    })
    .onClose.subscribe(name => name && console.log(name));
  }



  GetALlRoadMap(){
    this.rondeService.GetAllRoadMap().subscribe(
      (response : RoadMapResponse[]) => {
        console.log(response);
        var index = 0
        response.forEach((value)=> {
          var date = this.datePipe.transform(value.created_at, 'yyyy-MM-dd , h:mm a')
          this.listRoadMap.push({'ordre':index,'created_at':date,'status':value.status,'assigned':value.status})
          this.listIdRoadMap.push(value["roadMapID"])
          index++;
          this.gridOptions2.api.setRowData( this.listRoadMap)
          this.listCheckPoints.push(value.listCheckPoint)
          this.ListDescription.push(value.listdescription)
        })
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    )
  }

  //listCheckPoint
  onClickOnRoadMap(event){
    this.AddMarkersPermission=false
    const infoWindow = new google.maps.InfoWindow();
    var title = "Point de controle N° "
    this.clearMarkers()
    this.ClearlistMarkersRoadMap()
    var indexRoadMap = event["ordre"]
    var index = 0
    this.CurrentRoadMapUUIDimage = []
    //CurrentRoadMapUUIDimage
    this.rondeService.getUUIDimageRoadMap(this.listIdRoadMap[indexRoadMap]).subscribe(
      data  => {
        data.forEach((value) =>{
          this.CurrentRoadMapUUIDimage.push(value)
        })
      },
      err => {
        console.log(JSON.parse(err.error).message)
    })

    setTimeout(
      () => {
        var indexDescription = 0
        var bounds = new google.maps.LatLngBounds();
        this.listCheckPoints[indexRoadMap].forEach((value)=> {
          var MyMarker =new google.maps.Marker({
            position: {lat:this.listCheckPoints[indexRoadMap][index][0],lng:this.listCheckPoints[indexRoadMap][index][1]},
            map : this.map,
            title: `${title} ${index+1}`,
            label: `${index+1}`,
            optimized: false,
          });
          bounds.extend(MyMarker.getPosition());
          this.listMarkersRoadMap.push(MyMarker);
          console.log(this.ListDescription[indexRoadMap])
          var descriptionCheckPoint = this.ListDescription[indexRoadMap][index]
          this.rondeService.GetImageByUUID(this.CurrentRoadMapUUIDimage[index]).subscribe(
            data  => {
              
              var retrieveResonse = data;
              var base64Data = retrieveResonse["data"];
              var retrievedImage = 'data:image/jpeg;base64,' + base64Data;
              //console.log(retrievedImage)
              MyMarker.addListener("click", () => {
                infoWindow.close();

                var b="<div class='card' style='width: 9rem;'><img style ='height : 130px;width:130px;width: 100%;z-index: 0;' src="+retrievedImage+" class='card-img-top' alt='...'/><div class='card-body'><h6 style='font-size: 15px;' class='card-title'>Description</h6><p class='card-text'style='font-size: 12px;display: block;' >"+ descriptionCheckPoint+"</p></div></div>"
                infoWindow.setContent(b);
                /*infoWindow.setContent("<div style='float:left;width : 200px;height : 150px'><img style ='height : 130px;width:130px' src='"+retrievedImage
                      +"'></div><div style='float:right; padding: 10px;'><b>Description</b><br/>"+descriptionCheckPoint+"</div>");*/
                infoWindow.open(MyMarker.getMap(),MyMarker);
              });       
            },
            err => {
              console.log(JSON.parse(err.error).message)
          })
          index++;indexDescription++;
        })
        this.map.fitBounds(bounds);
      }, 500
    );

    console.log(indexRoadMap)
    console.log(this.listIdRoadMap[indexRoadMap])

  }

  ClearlistMarkersRoadMap(){
    for (let i = 0; i < this.listMarkersRoadMap.length; i++) {
      this.listMarkersRoadMap[i].setMap(null);
    }
    this.listMarkersRoadMap= [];
  }


  /*
  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 35.863568, lng: -5.523193 },
      zoom: 14,
    });

    var title = "Point de controle N° "
    this.map.addListener("click", (mapsMouseEvent) => {
        const infoWindow = new google.maps.InfoWindow();
        var MyMarkersLength = this.MyMarkers.length
        this.MyMarkers[MyMarkersLength]=[mapsMouseEvent.latLng.toJSON()]
        var index = 0
        this.MyMarkers.forEach((value)=> {
          this.listMarkers[index]={ordre:index+1,lat:value[0]["lat"],lng:value[0]["lng"]}
          var MyMarker =new google.maps.Marker({
            position: {lat:value[0]["lat"],lng:value[0]["lng"]},
            map : this.map,
            title: `${title} ${index + 1}`,
            label: `${index + 1}`,
            optimized: false,
          });
          MyMarker.addListener("click", () => {
            console.log(MyMarker.getPosition())
            infoWindow.close();
            infoWindow.setContent(MyMarker.getTitle());
            infoWindow.open(MyMarker.getMap(), MyMarker);
          });
          index++;
        })
        console.log(this.MyMarkers)
        console.log( this.listMarkers)
        this.gridOptions.api.setRowData( this.listMarkers)
        this.activateValidateRoadButton()
    });
  }*/





  

}
