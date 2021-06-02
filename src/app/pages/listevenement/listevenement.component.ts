import { Component, OnInit } from '@angular/core';
import { Grid, GridOptions, Module} from '@ag-grid-community/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatePipe } from '@angular/common';
import { NbDialogService } from '@nebular/theme';
import { RondeService } from '../../service/userService/ronde.service';
import { EventService } from '../../service/userService/event.service';
import { EventResponse } from "../../Models/Response/EventResponse";
import { AffectationEventComponent } from '../affectation-event/affectation-event.component';
import { AffectationRendererEvent } from './AffectationRendererEvent';
import { tsXLXS } from 'ts-xlsx-export';


@Component({
  selector: 'ngx-listevenement',
  templateUrl: './listevenement.component.html',
  styleUrls: ['./listevenement.component.scss']
})
export class ListevenementComponent implements OnInit {

  gridOptions: GridOptions;
  frameworkComponents: any;
  listEvent = []

  columnDefs= [
    {headerName: 'Ordre', field: 'ordre',sortable: true, filter: true ,type: 'numberColumn' ,floatingFilter: true, resizable: true,suppressSizeToFit : false,cellStyle: {'height': '100%','display': 'flex ','justify-content': 'center','align-items': 'center ',}  },
    {headerName: 'Date de le création', field: 'created_at',sortable: true, type : 'dateColumn',floatingFilter: true, resizable: true,suppressSizeToFit : false},
    {headerName: 'Titre', field: 'titre',sortable: true,filter: true,floatingFilter: true, resizable: true ,suppressSizeToFit : false},
    {headerName: 'Description', field: 'description',sortable: true,filter: true,floatingFilter: true, resizable: true ,suppressSizeToFit : false},
    {headerName: 'Categorie', field: 'categorie',sortable: true, filter: true,floatingFilter: true, resizable: true ,suppressSizeToFit : false},
    {headerName: 'Zone', field: 'zone',sortable: true, filter: true,floatingFilter: true, resizable: true ,suppressSizeToFit : false},
    {headerName: 'Status', field: 'status',sortable: true, filter: true,floatingFilter: true, resizable: true ,suppressSizeToFit : false},
    {headerName: 'Priorité', field: 'priorite',sortable: true, filter: true,floatingFilter: true, resizable: true ,suppressSizeToFit : false},
    {headerName: 'Traité par', field: 'traite_par',sortable: true, filter: true,floatingFilter: true, resizable: true ,suppressSizeToFit : false},
    {
      field: "Affectation",
      resizable: true,suppressSizeToFit : false,
      cellStyle: {'height': '100%','display': 'flex ','justify-content': 'center','align-items': 'center ',} ,
      cellRenderer: "btnAffectationRenderer",
      cellRendererParams: {
        clicked:this.onClickOnRoadMap.bind(this),
      },
    },
 ];

  constructor(private datePipe: DatePipe,private dialogService: NbDialogService,private roadMapService : RondeService,
    public db : AngularFireDatabase,private eventService: EventService) {
      this.frameworkComponents = {
        btnAffectationRenderer: AffectationRendererEvent,
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

     }

  ngOnInit(): void {
    this.GetAllEvent()
  }

  GetAllEvent() {
    this.eventService.GetAllevents().subscribe(
      (data: EventResponse[]) => {
        console.log(data);
        var index = 1
        data.forEach((value) => {
          var created_at = this.datePipe.transform(new Date(value.date), 'yyyy-MM-dd , h:mm a')
          this.listEvent.push({'ordre':index,'created_at':created_at,'titre':value.titre,'description':value.description,'categorie':value.categorie,'zone':value.zone,
          'status':value.statut,'priorite':value.degre_danger,'traite_par':value.agentMatricule,
          'longitude':value.longitude,'latitude':value.latitude,'idEvent':value.id})
          index++;
          //this.AddMarkers(value);
        });
        this.gridOptions.api.setRowData( this.listEvent)
      },
      (err) => {
        console.log(JSON.parse(err.error).message);
      }
    );
  }

  onClickOnRoadMap(event){ 
    this.dialogService.open(AffectationEventComponent, {
      context: {
        MyEvent: event,
      },
    })
  }

  onBtExport() { 
    console.log(this.gridOptions.api)
    var a = []
    this.gridOptions.api.forEachNodeAfterFilter(node => {
      console.log(node.data)
      a.push(node.data)
    });
    tsXLXS().exportAsExcelFile(a).saveAsExcelFile("listeEvenement");
  }


}
