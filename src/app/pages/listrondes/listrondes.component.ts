import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { RondeService } from '../../service/userService/ronde.service';
import { AdvancementRoadMapComponent } from '../advancement-road-map/advancement-road-map.component';
import { AffectationrondeComponent } from '../affectationronde/affectationronde.component';
import { AffectationRenderer } from './AffectationRenderer';
import { AvancementRenderer } from './AvancementRenderer';
import { AngularFirestore } from '@angular/fire/firestore';
import { FireBaseService } from '../../service/firebaseService/FireBaseService';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { MessagingService } from '../../service/firebaseService/MessagingService';
import { Grid, GridOptions, Module} from '@ag-grid-community/core';
import {LicenseManager,} from '@ag-grid-enterprise/core';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { AgGridAngular } from 'ag-grid-angular';
import { tsXLXS } from 'ts-xlsx-export';

@Component({
  selector: 'ngx-listrondes',
  templateUrl: './listrondes.component.html',
  styleUrls: ['./listrondes.component.scss']
})
export class ListrondesComponent implements OnInit {


  //modules: Module[] = AllModules;
  gridOptions: GridOptions;
  frameworkComponents: any;

  listRoadMap = []
  item :any;
  notes_Firebase_Data :AngularFireList<any>;
  notes_angular :Observable<any[]>;
 
  columnDefs= [
    {headerName: '', field: 'drag', rowDrag: true ,width: 30 },
    {headerName: 'Ordre', field: 'ordre',sortable: true, filter: true ,type: 'numberColumn' ,floatingFilter: true, resizable: true,suppressSizeToFit : false,cellStyle: {'height': '100%','display': 'flex ','justify-content': 'center','align-items': 'center ',}  },
    {headerName: 'Date de le création', field: 'created_at',sortable: true, type : 'dateColumn',floatingFilter: true, resizable: true,suppressSizeToFit : false},
    {headerName: 'Date du debut', field: 'datedebut',sortable: true, type : 'dateColumn',floatingFilter: true, resizable: true ,suppressSizeToFit : false},
    {headerName: 'Date de la fin ', field: 'datefin',sortable: true, type : 'dateColumn',floatingFilter: true, resizable: true ,suppressSizeToFit : false},
    {headerName: 'Status', field: 'status',sortable: true, filter: true,floatingFilter: true, resizable: true ,suppressSizeToFit : false},
    {
      field: "Affectation",
      resizable: true,suppressSizeToFit : false,
      cellStyle: {'height': '100%','display': 'flex ','justify-content': 'center','align-items': 'center ',} ,
      cellRenderer: "btnAffectationRenderer",
      cellRendererParams: {
        clicked:this.onClickOnRoadMap.bind(this),
      },
    },
    {
      field: "Avancement",
      resizable: true,suppressSizeToFit : false,
      cellStyle: {'height': '100%','display': 'flex ','justify-content': 'center','align-items': 'center ',} ,
      cellRenderer: "btnShowAdvancement",
      cellRendererParams: {
        clicked:this.onClickOnRoadMapToShowAdvancement.bind(this),
      },
    }
    /*75,100,90
    {headerName: 'Latitude', field: 'lat',sortable: true, filter: true , width :90}, */
   
 ];
//private fireBaseService : FireBaseService,
  constructor(private datePipe: DatePipe,private dialogService: NbDialogService,private roadMapService : RondeService,
   public db : AngularFireDatabase,private toastrService: NbToastrService) { 


    this.frameworkComponents = {
      btnAffectationRenderer: AffectationRenderer,
      btnShowAdvancement :  AvancementRenderer
    }
    this.gridOptions = <GridOptions>{
      rowHeight: 53,
      suppressHorizontalScroll: false,
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


   /* this.listRoadMap = [{'ordre' : 1,'created_at':"17-09-2018",'datedebut':"17-09-2018",'datefin':"17-09-2018",'status':"Terminée"},
    {'ordre' : 2,'created_at':"17-09-2018",'datedebut':"17-09-2018",'datefin':"17-09-2018",'status':"Terminée"},
    {'ordre' : 3,'created_at':"17-09-2018",'datedebut':"17-09-2018",'datefin':"17-09-2018",'status':"Terminée"}]*/
  }

  onClickOnRoadMap(event){ 
    this.dialogService.open(AffectationrondeComponent, {
      context: {
        MyRoadMap: event["idRoadMap"],
      },
    })
  }


  onClickOnRoadMapToShowAdvancement(event){
    console.log(event)
    this.dialogService.open(AdvancementRoadMapComponent, {
      context: {
        MyRoadMap: event,
      },
    })
  }

  ngOnInit(): void {
    this.GetAllRoadsMAp()
    
  }

  onBtExport() {
    /*const params = {
      columnGroups: true,
      allColumns: true,
      fileName: 'filename_of_your_choice',
      columnSeparator: document.querySelector("#columnSeparator")["value"]
    };
    this.gridOptions.api.exportDataAsCsv(params);*/
    //this.gridOptions.api.exportDataAsCsv();
    //this.gridOptions.api.exportDataAsExcel();     
    console.log(this.gridOptions.api)
    var a = []
    this.gridOptions.api.forEachNodeAfterFilter(node => {
      console.log(node.data)
      a.push(node.data)
    });
    tsXLXS().exportAsExcelFile(a).saveAsExcelFile("listeRondes");
  }

  /*test(){
    this.notes_Firebase_Data.push({  

      title:'note added by angular.push()',

      details: 'this note ist created with angularfirelist<any>. To list it in ngFor, you need an observable<any[]>',

      datetime: new Date().toString()

     });
     this. notes_angular.forEach((value)=>{
        console.log(value)
     })
     this. notes_angular.subscribe(
       (data) =>{
         console.log("yaaaaaaaaaaaaaaaaaaaarbi")
         //this.showToast('bottom-right')
         var a={
          "notification": {
          "title": "Hey there", 
          "body": "Subscribe to might ghost hack youtube channel"
          },
          "to" : "f4mw23KBGLK8-gXSW6hawm:APA91bHLd0VMr1A6aXPtNOmtrM14Un0tEE2M4Z8PfrI_4dRaN3bAEdxRwprACzmb-0F6sWnoWCs-YPRetdQkbh50SwIhd8hHN9h8qPrrnBTkyHan2j-p_JUmyNZFPzvCBA_uwvE1wbd3"
         }
         this.messagingService.ShowCustomNotification(a);
         console.log(data)
       }
     )
     //this.showToast('bottom-right')
     console.log("innnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
     
  }*/
  
  GetAllRoadsMAp(){
    this.roadMapService.getListRoadsMap().subscribe(
      (data ) => {
        console.log(data)
        var index = 0
        data.forEach(value => {
          var created_at = this.datePipe.transform(new Date(value.dateCreation), 'yyyy-MM-dd , h:mm a')
          var datedebut = this.datePipe.transform(new Date(value.dateDebut), 'yyyy-MM-dd , h:mm a')
          var datefin = this.datePipe.transform(new Date(value.dateFin), 'yyyy-MM-dd , h:mm a')
          var status ;
          if(value.status){status = "Terminée"}
          else{status = "En cours de traitement"}
          if(value.idAgent==null){status = "Non affectée"}
          this.listRoadMap.push({'idAgent': value.idAgent ,'idRoadMap' : value.idRoadMap ,'ordre' : index+1,'created_at': created_at ,'datedebut':datedebut,'datefin':datefin,'status':status})
          this.gridOptions.api.setRowData( this.listRoadMap )
          index++
        })
        
      },
      err => {
        console.log(JSON.parse(err.error).message)
    })
  }

}
