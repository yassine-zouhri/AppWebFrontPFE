import { Component, OnInit, ViewChild,ViewEncapsulation, Inject,  } from '@angular/core';
import { DragEventArgs, EventRenderedArgs, PopupOpenEventArgs, RenderCellEventArgs, ResizeEventArgs, TimeScaleModel, TreeViewArgs} from '@syncfusion/ej2-schedule';
import {DataManager,WebApiAdaptor,Query} from '@syncfusion/ej2-data'


import { hospitalData, resourceData, roomData, timelineResourceData, waitingList,resourceConferenceData } from './data';
import { extend, closest, remove, addClass, isNullOrUndefined, Browser,L10n,setCulture } from '@syncfusion/ej2-base';
import {
    EventSettingsModel, View, GroupModel, TimelineViewsService, TimelineMonthService,
    ResizeService,AgendaService, WorkHoursModel, DragAndDropService, ResourceDetails, ScheduleComponent, ActionEventArgs, CellClickEventArgs
} from '@syncfusion/ej2-angular-schedule';
import { DragAndDropEventArgs } from '@syncfusion/ej2-navigations';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { PagerModule, PageEventArgs } from '@syncfusion/ej2-angular-grids';
import { UserService } from '../../service/userService/user.service';
import { createElement } from 'highcharts';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { AngularFireDatabase } from '@angular/fire/database';
import * as EJ2_LOCALE from './fr.json'
import { loadCldr} from '@syncfusion/ej2-base';
import * as numberingSystems from '../../../../node_modules/cldr-data/supplemental/numberingSystems.json';
import * as gregorian from '../../../../node_modules/cldr-data/main/fr-CH/ca-gregorian.json';
import * as numbers from '../../../../node_modules/cldr-data/main/fr-CH/numbers.json';
import * as timeZoneNames from "../../../../node_modules/cldr-data/main/fr-CH/timeZoneNames.json";

loadCldr(numberingSystems['default'], gregorian['default'], numbers['default'], timeZoneNames['default']);
//loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);

//L10n.load({ de: EJ2_LOCALE.de });
setCulture('fr-CH');
/*@Component({
  selector: 'ngx-agent-scheduler',
  templateUrl: './agent-scheduler.component.html',
  styleUrls: ['./agent-scheduler.component.scss']
})*/

L10n.load({ 'fr-CH': EJ2_LOCALE.fr });

/*L10n.load({ 'fr-CH': numberingSystems.supplemental });
L10n.load({ 'fr-CH': gregorian.main['fr-CH'] });
L10n.load({ 'fr-CH': numbers.main['fr-CH'] });
L10n.load({ 'fr-CH': timeZoneNames.main['fr-CH'] });*/

/*L10n.load({
  'en-US': {
      'schedule': {
          'day': 'journée',
          'week': 'La semaine',
          'workWeek': 'Semaine de travail',
          'month': 'Mois',
          'today': 'Aujourd`hui',
          'agenda': 'Ordre du jour',
          'save':'Enregistrer',
          'addTitle' : 'Ajouter un titre',
          'moreDetails' : 'Plus de details',
          'description':'Description',
          'title' : 'Titre',
          'newEvent' : 'Nouvel evénement',
          'editEvent' : "Modifier l'événement",
          'edit':'Modifier',
          'editTitle' : 'Modifier le titre',
          'repeat' : 'Répéter',
          'previous' : 'Précédent',
          'saveButton':'Enregistrer',
          'subject' : 'Sujet',
          'startTime' : 'De',
          'endTime' : 'À',
          
      },
      'calendar': {
        'today': 'Aujourd`hui'
    }
  }
});*/



@Component({
  selector: 'ngx-agent-scheduler',
  templateUrl: './agent-scheduler.component.html',
  styleUrls: ['./agent-scheduler.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [TimelineViewsService, AgendaService, ResizeService, DragAndDropService]
})


export class AgentSchedulerComponent implements OnInit{
  listAgent : any[] = []
  public flag: Boolean = false;
  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  public resourceAgentAgenda: Object[] = []
  public numberPages : number = 1
  /*public resourceConferenceData: Object[] = [
    {
        Id: 1,
        Subject: 'Burning Man',
        StartTime: new Date(2018, 5, 1, 15, 0),
        EndTime: new Date(2018, 5, 1, 17, 0),
        ConferenceId: [8,13]
    }, {
        Id: 2,
        Subject: 'Data-Driven Economy',
        StartTime: new Date(2018, 5, 2, 12, 0),
        EndTime: new Date(2018, 5, 2, 14, 0),
        ConferenceId: [9,13]
    }, {
        Id: 3,
        Subject: 'Techweek',
        StartTime: new Date(2018, 5, 2, 15, 0),
        EndTime: new Date(2018, 5, 2, 17, 0),
        ConferenceId: [10,13]
    }, {
        Id: 4,
        Subject: 'Content Marketing World',
        StartTime: new Date(2018, 5, 2, 18, 0),
        EndTime: new Date(2018, 5, 2, 20, 0),
        ConferenceId: [13]
    }, {
        Id: 5,
        Subject: 'B2B Marketing Forum',
        StartTime: new Date(2018, 5, 3, 10, 0),
        EndTime: new Date(2018, 5, 3, 12, 0),
        ConferenceId: [8]
    }, {
        Id: 6,
        Subject: 'Business Innovation Factory',
        StartTime: new Date(2018, 5, 3, 13, 0),
        EndTime: new Date(2018, 5, 3, 15, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 7,
        Subject: 'Grow Conference',
        StartTime: new Date(2018, 5, 3, 16, 0),
        EndTime: new Date(2018, 5, 3, 18, 0),
        ConferenceId: [2, 3]
    }, {
        Id: 8,
        Subject: 'Journalism Interactive',
        StartTime: new Date(2018, 5, 3, 19, 0),
        EndTime: new Date(2018, 5, 3, 21, 0),
        ConferenceId: [10, 13]
    }, {
        Id: 9,
        Subject: 'Blogcademy',
        StartTime: new Date(2018, 5, 4, 10, 0),
        EndTime: new Date(2018, 5, 4, 11, 30),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 10,
        Subject: 'Sustainable Brands',
        StartTime: new Date(2018, 5, 4, 13, 0),
        EndTime: new Date(2018, 5, 4, 15, 30),
        ConferenceId: [1, 2]
    }, {
        Id: 11,
        Subject: 'Fashion Confidential',
        StartTime: new Date(2018, 5, 4, 9, 0),
        EndTime: new Date(2018, 5, 4, 9, 45),
        ConferenceId: [2, 3]
    }, {
        Id: 12,
        Subject: 'Mobile World Conference',
        StartTime: new Date(2018, 5, 5, 12, 0),
        EndTime: new Date(2018, 5, 5, 14, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 13,
        Subject: 'The Human Gathering',
        StartTime: new Date(2018, 5, 5, 15, 0),
        EndTime: new Date(2018, 5, 5, 17, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 14,
        Subject: 'Web Summit',
        StartTime: new Date(2018, 5, 5, 18, 0),
        EndTime: new Date(2018, 5, 5, 20, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 15,
        Subject: 'Funnel Hacking Live',
        StartTime: new Date(2018, 5, 6, 12, 0),
        EndTime: new Date(2018, 5, 6, 14, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 16,
        Subject: 'Data Science Conference',
        StartTime: new Date(2018, 5, 6, 15, 0),
        EndTime: new Date(2018, 5, 6, 17, 0),
        ConferenceId: [2, 3]
    }, {
        Id: 17,
        Subject: 'Powerful Living Experience',
        StartTime: new Date(2018, 5, 6, 21, 0),
        EndTime: new Date(2018, 5, 6, 23, 30),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 18,
        Subject: 'World Domination Summit',
        StartTime: new Date(2018, 5, 7, 12, 0),
        EndTime: new Date(2018, 5, 7, 14, 0),
        ConferenceId: [2, 3]
    }, {
        Id: 19,
        Subject: 'Burning Man',
        StartTime: new Date(2018, 5, 7, 15, 0),
        EndTime: new Date(2018, 5, 7, 17, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 20,
        Subject: 'Data-Driven Economy',
        StartTime: new Date(2018, 5, 7, 18, 0),
        EndTime: new Date(2018, 5, 7, 20, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 21,
        Subject: 'Techweek',
        StartTime: new Date(2018, 5, 8, 12, 0),
        EndTime: new Date(2018, 5, 8, 14, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 22,
        Subject: 'Content Marketing World',
        StartTime: new Date(2018, 5, 8, 15, 0),
        EndTime: new Date(2018, 5, 8, 17, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 23,
        Subject: 'B2B Marketing Forum',
        StartTime: new Date(2018, 5, 8, 20, 30),
        EndTime: new Date(2018, 5, 8, 21, 30),
        ConferenceId: [1, 3]
    }, {
        Id: 24,
        Subject: 'Business Innovation Factory',
        StartTime: new Date(2018, 5, 9, 12, 0),
        EndTime: new Date(2018, 5, 9, 14, 0),
        ConferenceId: [2, 3]
    }, {
        Id: 25,
        Subject: 'Grow Conference',
        StartTime: new Date(2018, 5, 9, 15, 0),
        EndTime: new Date(2018, 5, 9, 17, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 26,
        Subject: 'Journalism Interactive',
        StartTime: new Date(2018, 5, 9, 18, 0),
        EndTime: new Date(2018, 5, 9, 20, 0),
        ConferenceId: [10, 9, 13]
    }, {
        Id: 27,
        Subject: 'Blogcademy',
        StartTime: new Date(2018, 5, 10, 12, 0),
        EndTime: new Date(2018, 5, 10, 14, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 28,
        Subject: 'Sustainable Brands',
        StartTime: new Date(2018, 5, 10, 15, 0),
        EndTime: new Date(2018, 5, 10, 17, 0),
        ConferenceId: [2, 3]
    }, {
        Id: 29,
        Subject: 'Fashion Confidential',
        StartTime: new Date(2018, 5, 10, 18, 0),
        EndTime: new Date(2018, 5, 10, 20, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 30,
        Subject: 'Mobile World Conference',
        StartTime: new Date(2018, 5, 11, 12, 0),
        EndTime: new Date(2018, 5, 11, 14, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 31,
        Subject: 'The Human Gathering',
        StartTime: new Date(2018, 5, 11, 15, 0),
        EndTime: new Date(2018, 5, 11, 17, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 32,
        Subject: 'Web Summit',
        StartTime: new Date(2018, 5, 11, 18, 0),
        EndTime: new Date(2018, 5, 11, 20, 0),
        ConferenceId: [3]
    }, {
        Id: 33,
        Subject: 'Funnel Hacking Live',
        StartTime: new Date(2018, 5, 12, 14, 0),
        EndTime: new Date(2018, 5, 12, 16, 0),
        ConferenceId: [1]
    }, {
        Id: 34,
        Subject: 'Data Science Conference',
        StartTime: new Date(2018, 5, 12, 14, 0),
        EndTime: new Date(2018, 5, 12, 16, 0),
        ConferenceId: [2]
    }, {
        Id: 35,
        Subject: 'Powerful Living Experience',
        StartTime: new Date(2018, 5, 12, 18, 0),
        EndTime: new Date(2018, 5, 12, 20, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 36,
        Subject: 'World Domination Summit',
        StartTime: new Date(2018, 5, 12, 18, 0),
        EndTime: new Date(2018, 5, 12, 20, 0),
        ConferenceId: [3]
    }, {
        Id: 37,
        Subject: 'Burning Man',
        StartTime: new Date(2018, 5, 13, 14, 0),
        EndTime: new Date(2018, 5, 13, 16, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 38,
        Subject: 'Data-Driven Economy',
        StartTime: new Date(2018, 5, 13, 14, 0),
        EndTime: new Date(2018, 5, 13, 16, 0),
        ConferenceId: [1]
    }, {
        Id: 39,
        Subject: 'Techweek',
        StartTime: new Date(2018, 5, 13, 18, 0),
        EndTime: new Date(2018, 5, 13, 20, 0),
        ConferenceId: [2, 3]
    }, {
        Id: 40,
        Subject: 'Content Marketing World',
        StartTime: new Date(2018, 5, 13, 18, 0),
        EndTime: new Date(2018, 5, 13, 20, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 41,
        Subject: 'B2B Marketing Forum',
        StartTime: new Date(2018, 5, 14, 14, 0),
        EndTime: new Date(2018, 5, 14, 16, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 42,
        Subject: 'Business Innovation Factory',
        StartTime: new Date(2018, 5, 14, 14, 0),
        EndTime: new Date(2018, 5, 14, 16, 0),
        ConferenceId: [2, 3]
    }, {
        Id: 43,
        Subject: 'Grow Conference',
        StartTime: new Date(2018, 5, 14, 18, 0),
        EndTime: new Date(2018, 5, 14, 20, 0),
        ConferenceId: [3]
    }, {
        Id: 44,
        Subject: 'Journalism Interactive',
        StartTime: new Date(2018, 5, 14, 18, 0),
        EndTime: new Date(2018, 5, 14, 20, 0),
        ConferenceId: [10, 8, 13]
    }, {
        Id: 45,
        Subject: 'Blogcademy',
        StartTime: new Date(2018, 5, 15, 14, 0),
        EndTime: new Date(2018, 5, 15, 16, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 46,
        Subject: 'Sustainable Brands',
        StartTime: new Date(2018, 5, 15, 14, 0),
        EndTime: new Date(2018, 5, 15, 16, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 47,
        Subject: 'Fashion Confidential',
        StartTime: new Date(2018, 5, 15, 18, 0),
        EndTime: new Date(2018, 5, 15, 20, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 48,
        Subject: 'Mobile World Conference',
        StartTime: new Date(2018, 5, 15, 18, 0),
        EndTime: new Date(2018, 5, 15, 20, 0),
        ConferenceId: [2, 3]
    }
  ];*/
  listColor : any[]=['#ffcd94','#ffe34c','#b6fcd5','#1aaa55','#357cd2','#7fa900','#4ca3dd','#ffb42e']
  public data: Object[] = <Object[]>extend([], this.resourceAgentAgenda, null, true);
  public selectedDate: Date = new Date();
  public currentView: View = 'WorkWeek';
  public resourceDataSource: Object[] = [
        { Text: 'Margaret', Id: 1, Color: '#1aaa55' },
        { Text: 'Robert', Id: 2, Color: '#357cd2' },
        { Text: 'Laura', Id: 3, Color: '#7fa900' },
        { Text: 'Margaret', Id: 4, Color: '#1aaa55' },
        { Text: 'Robert', Id: 5, Color: '#357cd2' },
        { Text: 'Laura', Id: 6, Color: '#7fa900' },
        { Text: 'Margaret', Id: 7, Color: '#1aaa55' },
        { Text: 'Robert', Id: 8, Color: '#357cd2' },
        { Text: 'Laura', Id: 9, Color: '#7fa900' },
        { Text: 'Margaret', Id: 10, Color: '#1aaa55' },
        { Text: 'Robert', Id: 11, Color: '#357cd2' },
        { Text: 'Laura', Id: 12, Color: '#7fa900' },
        { Text: 'Margaret', Id: 13, Color: '#1aaa55' },
        { Text: 'Robert', Id: 14, Color: '#357cd2' },
        { Text: 'Laura', Id: 15, Color: '#7fa900' },
        { Text: 'Margaret', Id: 16, Color: '#1aaa55' },
        { Text: 'Robert', Id: 17, Color: '#357cd2' },
        { Text: 'Laura', Id: 18, Color: '#7fa900' }
    ];
    public group: GroupModel = { allowGroupEdit: true, resources: ['Conferences'] };
    public allowMultiple: Boolean = false;
    
    public eventSettings: EventSettingsModel = {
        dataSource: null,
        fields: {
            subject: { title: 'Titre', name: 'Subject' },
            description: { title: 'Description', name: 'Description' },
            startTime: { title: 'De', name: 'StartTime' },
            endTime: { title: 'À', name: 'EndTime' },
            isAllDay : {title :'Toute la journée',name:'isAllDay' },
        }
    };

    constructor(private userService : UserService,
        public db : AngularFireDatabase) {
    }

    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.scheduleObj.locale='fr-CH'
        }, 500);
        this.GetAllAgent()
    }

    GetAllAgent(){
      this.userService.getUsersByRoleAgent().subscribe(
        (data : []) => {
          data.forEach((value)=> {
            var retrievedImage: any;
            var base64Data: any;
            var retrieveResonse: any;
            retrieveResonse = value;
            base64Data = retrieveResonse["data"];
            retrievedImage = 'data:image/jpeg;base64,' + base64Data;
            this.listAgent.push({'agentId': value["agentId"],"image":retrievedImage,"username":value["username"],"matricule":value["matricule"],Text:value["fullName"],Color: this.listColor[this.getRandomInt(9)]})
          })
          if(data.length > 8){
              if(data.length % 8 ==0){this.numberPages = Math.trunc(data.length/8)}
              else{this.numberPages = Math.trunc(data.length/8)+1}
          }else{this.numberPages = 1}
          console.log(this.listAgent)
          this.scheduleObj.resources[0].dataSource = this.listAgent
        },
        err => {
          console.log(JSON.parse(err.error).message)
      })
    }

    getEmployeeName(value: ResourceDetails | TreeViewArgs): string {
        return ((value as ResourceDetails).resourceData) ?
            (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] as string
            : (value as TreeViewArgs).resourceName;
    }
    getEmployeeMAtricule(value: ResourceDetails | TreeViewArgs): string {
        let resourceName: string = value['resourceData'].matricule;
        return  resourceName;
    }
    getEmployeeImage(value: ResourceDetails | TreeViewArgs): string {
        let resourceName = value['resourceData'].image;
        return resourceName;
    }

    

    
    onActionComplete(args: ActionEventArgs): void {
        var MyData : any[] = []
        console.log(this.scheduleObj.eventSettings.dataSource)
        if (!this.flag) {
            var starCountRef = this.db.database.ref('agentsAgenda');
            var that = this
            starCountRef.once("value").then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();
                    that.resourceAgentAgenda.push(childData)
                });

                console.log(that.resourceAgentAgenda)
                const page: string = '1' as string;
                console.log(that.scheduleObj.resources[0].dataSource)
                console.log(that.scheduleObj.eventSettings.dataSource)
                that.pageChange(page);
            })
            
        }else{
            this.db.database.ref('agentsAgenda').remove();
            console.log(this.scheduleObj.eventSettings.dataSource)
            MyData = this.scheduleObj.eventSettings.dataSource as []
            MyData.forEach((value)=>{
                //console.log(value)
                var newPostKey =  this.db.database.ref('agentsAgenda').push().key;
                var updates = {};
                if(value.Location == undefined){value.Location = null}
                if(value.Description == undefined){value.Description = null}
                updates['/' + newPostKey] = value;
                this.db.database.ref('agentsAgenda').update(updates);
            })
        }
    }
    onSlide(args: PageEventArgs): void {
        var page: string = args.currentPage;
        console.log("page  " +page)
        if( page == undefined){page = "1"}
        this.pageChange(page);
    }

    pageChange(page: string) {
      this.flag = true;
      setTimeout(()=>{
        var debutIndex = 5*(parseInt(page)-1)
        var finIndex = 5*parseInt(page)-1
        if((this.listAgent.length-1)<finIndex){
          finIndex = this.listAgent.length-1
        }
  
        const CurRoomData: Object[] = [];
        const CurConferenceData: Object[] = [];
        const dm1: DataManager = new DataManager({ json: this.resourceAgentAgenda });
        console.log(this.listAgent)
        for (var i = debutIndex; i < finIndex+1; i++) {
          const val: any = this.listAgent[i];
          const CurResData: Object[] = dm1.executeLocal(new Query().where('ConferenceId', 'contains', val.agentId));
          console.log(CurResData)
          CurResData.forEach((value)=>{CurConferenceData.push(value)})
          CurRoomData.push(val);
        }
        console.log(CurRoomData)
        console.log(CurConferenceData)
        this.scheduleObj.resources[0].dataSource = CurRoomData;
        this.scheduleObj.eventSettings.dataSource = CurConferenceData;
        this.scheduleObj.dataBind();
      },1000)
    }

    onResizeStart(args : ResizeEventArgs) : void{
      //args.scroll.enable = false
      args.interval = 5
    }
    public dateParser(data: string) {
      return new Date(data);
    }


    public onActionBegin(args: { [key: string]: Object }): void {
      console.log(args)
      console.log( this.scheduleObj.eventBase)
      /*if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
          let data: any;
          if (args.requestType === 'eventCreate') {
              data = <any>args.data[0];
          } else if (args.requestType === 'eventChange') {
              data = <any>args.data;
          }
          if (!this.scheduleObj.isSlotAvailable(data.StartTime as Date, data.EndTime as Date)) {
              args.cancel = true;
          }
      }*/
  }

  public statusFields: Object = { text: 'StatusText', value: 'StatusText' };
  public StatusData: Object[] = [
    { StatusText: 'New', Id: 1 },
    { StatusText: 'Requested', Id: 2 },
    { StatusText: 'Confirmed', Id: 3 }
  ];

  public onEventRendered(args: EventRenderedArgs): void {
    //console.log(args)
    switch (args.data.EventType) {
        case 'Requested':
            (args.element as HTMLElement).style.backgroundColor = '#F57F17';
            break;
        case 'Confirmed':
            (args.element as HTMLElement).style.backgroundColor = '#7fa900';
            break;
        case 'New':
            (args.element as HTMLElement).style.backgroundColor = '#8e24aa';
            break;
    }
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'Editor') {
        // Create required custom elements in initial time

        (<any>this.scheduleObj.eventWindow).recurrenceEditor.frequencies  = ['none', 'daily', 'weekly'];
        if (!args.element.querySelector('.custom-field-row')) {
            let row: HTMLElement = createElement('div', { className: 'custom-field-row' });
            let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
            formElement.firstChild.insertBefore(row, args.element.querySelector('.e-description-row'));
            let container: HTMLElement = createElement('div', { className: 'custom-field-container' });
            let inputEle: HTMLInputElement = createElement('input', {
                className: 'e-field', name: 'ZoneN' 
            }) as HTMLInputElement;
            container.appendChild(inputEle);
            row.appendChild(container);
            let drowDownList: DropDownList = new DropDownList({
                dataSource: [
                    { text: 'Zone 1', value: 'zone1' },
                    { text: 'Zone 2', value: 'zone2' },
                    { text: 'Zone 3', value: 'zone3' },
                    { text: 'Zone 4', value: 'zone4' }
                ],
                fields: { text: 'text', value: 'value' },
                value: (args.data as { [key: string]: Object }).ZoneN as string,
                floatLabelType: 'Always', placeholder: 'Zone'
            });
            drowDownList.appendTo(inputEle);
            inputEle.setAttribute('name', 'ZoneN');
        }
    }
    }

    GetData(){
        var starCountRef = this.db.database.ref('agentsAgenda');
        starCountRef.once("value")
        .then(function(snapshot) {
            console.log(snapshot.val())
        })

        var postData = {
            author: "username",
        };
        var newPostKey =  this.db.database.ref('agentsAgenda').push().key;
        var updates = {};
        updates['/' + newPostKey] = postData;
        this.db.database.ref('agentsAgenda').update(updates);
    }




}


/*export class AgentSchedulerComponent implements OnInit{
  listAgent : any[] = []
  public flag: Boolean = false;
  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  public resourceConferenceData: Object[] = [
    {
        Id: 1,
        Subject: 'Burning Man',
        StartTime: new Date(2018, 5, 1, 15, 0),
        EndTime: new Date(2018, 5, 1, 17, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 2,
        Subject: 'Data-Driven Economy',
        StartTime: new Date(2018, 5, 2, 12, 0),
        EndTime: new Date(2018, 5, 2, 14, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 3,
        Subject: 'Techweek',
        StartTime: new Date(2018, 5, 2, 15, 0),
        EndTime: new Date(2018, 5, 2, 17, 0),
        ConferenceId: [2, 3]
    }, {
        Id: 4,
        Subject: 'Content Marketing World',
        StartTime: new Date(2018, 5, 2, 18, 0),
        EndTime: new Date(2018, 5, 2, 20, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 5,
        Subject: 'B2B Marketing Forum',
        StartTime: new Date(2018, 5, 3, 10, 0),
        EndTime: new Date(2018, 5, 3, 12, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 6,
        Subject: 'Business Innovation Factory',
        StartTime: new Date(2018, 5, 3, 13, 0),
        EndTime: new Date(2018, 5, 3, 15, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 7,
        Subject: 'Grow Conference',
        StartTime: new Date(2018, 5, 3, 16, 0),
        EndTime: new Date(2018, 5, 3, 18, 0),
        ConferenceId: [2, 3]
    }, {
        Id: 8,
        Subject: 'Journalism Interactive',
        StartTime: new Date(2018, 5, 3, 19, 0),
        EndTime: new Date(2018, 5, 3, 21, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 9,
        Subject: 'Blogcademy',
        StartTime: new Date(2018, 5, 4, 10, 0),
        EndTime: new Date(2018, 5, 4, 11, 30),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 10,
        Subject: 'Sustainable Brands',
        StartTime: new Date(2018, 5, 4, 13, 0),
        EndTime: new Date(2018, 5, 4, 15, 30),
        ConferenceId: [1, 2]
    }, {
        Id: 11,
        Subject: 'Fashion Confidential',
        StartTime: new Date(2018, 5, 4, 9, 0),
        EndTime: new Date(2018, 5, 4, 9, 45),
        ConferenceId: [2, 3]
    }, {
        Id: 12,
        Subject: 'Mobile World Conference',
        StartTime: new Date(2018, 5, 5, 12, 0),
        EndTime: new Date(2018, 5, 5, 14, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 13,
        Subject: 'The Human Gathering',
        StartTime: new Date(2018, 5, 5, 15, 0),
        EndTime: new Date(2018, 5, 5, 17, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 14,
        Subject: 'Web Summit',
        StartTime: new Date(2018, 5, 5, 18, 0),
        EndTime: new Date(2018, 5, 5, 20, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 15,
        Subject: 'Funnel Hacking Live',
        StartTime: new Date(2018, 5, 6, 12, 0),
        EndTime: new Date(2018, 5, 6, 14, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 16,
        Subject: 'Data Science Conference',
        StartTime: new Date(2018, 5, 6, 15, 0),
        EndTime: new Date(2018, 5, 6, 17, 0),
        ConferenceId: [2, 3]
    }, {
        Id: 17,
        Subject: 'Powerful Living Experience',
        StartTime: new Date(2018, 5, 6, 21, 0),
        EndTime: new Date(2018, 5, 6, 23, 30),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 18,
        Subject: 'World Domination Summit',
        StartTime: new Date(2018, 5, 7, 12, 0),
        EndTime: new Date(2018, 5, 7, 14, 0),
        ConferenceId: [2, 3]
    }, {
        Id: 19,
        Subject: 'Burning Man',
        StartTime: new Date(2018, 5, 7, 15, 0),
        EndTime: new Date(2018, 5, 7, 17, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 20,
        Subject: 'Data-Driven Economy',
        StartTime: new Date(2018, 5, 7, 18, 0),
        EndTime: new Date(2018, 5, 7, 20, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 21,
        Subject: 'Techweek',
        StartTime: new Date(2018, 5, 8, 12, 0),
        EndTime: new Date(2018, 5, 8, 14, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 22,
        Subject: 'Content Marketing World',
        StartTime: new Date(2018, 5, 8, 15, 0),
        EndTime: new Date(2018, 5, 8, 17, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 23,
        Subject: 'B2B Marketing Forum',
        StartTime: new Date(2018, 5, 8, 20, 30),
        EndTime: new Date(2018, 5, 8, 21, 30),
        ConferenceId: [1, 3]
    }, {
        Id: 24,
        Subject: 'Business Innovation Factory',
        StartTime: new Date(2018, 5, 9, 12, 0),
        EndTime: new Date(2018, 5, 9, 14, 0),
        ConferenceId: [2, 3]
    }, {
        Id: 25,
        Subject: 'Grow Conference',
        StartTime: new Date(2018, 5, 9, 15, 0),
        EndTime: new Date(2018, 5, 9, 17, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 26,
        Subject: 'Journalism Interactive',
        StartTime: new Date(2018, 5, 9, 18, 0),
        EndTime: new Date(2018, 5, 9, 20, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 27,
        Subject: 'Blogcademy',
        StartTime: new Date(2018, 5, 10, 12, 0),
        EndTime: new Date(2018, 5, 10, 14, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 28,
        Subject: 'Sustainable Brands',
        StartTime: new Date(2018, 5, 10, 15, 0),
        EndTime: new Date(2018, 5, 10, 17, 0),
        ConferenceId: [2, 3]
    }, {
        Id: 29,
        Subject: 'Fashion Confidential',
        StartTime: new Date(2018, 5, 10, 18, 0),
        EndTime: new Date(2018, 5, 10, 20, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 30,
        Subject: 'Mobile World Conference',
        StartTime: new Date(2018, 5, 11, 12, 0),
        EndTime: new Date(2018, 5, 11, 14, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 31,
        Subject: 'The Human Gathering',
        StartTime: new Date(2018, 5, 11, 15, 0),
        EndTime: new Date(2018, 5, 11, 17, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 32,
        Subject: 'Web Summit',
        StartTime: new Date(2018, 5, 11, 18, 0),
        EndTime: new Date(2018, 5, 11, 20, 0),
        ConferenceId: [3]
    }, {
        Id: 33,
        Subject: 'Funnel Hacking Live',
        StartTime: new Date(2018, 5, 12, 14, 0),
        EndTime: new Date(2018, 5, 12, 16, 0),
        ConferenceId: [1]
    }, {
        Id: 34,
        Subject: 'Data Science Conference',
        StartTime: new Date(2018, 5, 12, 14, 0),
        EndTime: new Date(2018, 5, 12, 16, 0),
        ConferenceId: [2]
    }, {
        Id: 35,
        Subject: 'Powerful Living Experience',
        StartTime: new Date(2018, 5, 12, 18, 0),
        EndTime: new Date(2018, 5, 12, 20, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 36,
        Subject: 'World Domination Summit',
        StartTime: new Date(2018, 5, 12, 18, 0),
        EndTime: new Date(2018, 5, 12, 20, 0),
        ConferenceId: [3]
    }, {
        Id: 37,
        Subject: 'Burning Man',
        StartTime: new Date(2018, 5, 13, 14, 0),
        EndTime: new Date(2018, 5, 13, 16, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 38,
        Subject: 'Data-Driven Economy',
        StartTime: new Date(2018, 5, 13, 14, 0),
        EndTime: new Date(2018, 5, 13, 16, 0),
        ConferenceId: [1]
    }, {
        Id: 39,
        Subject: 'Techweek',
        StartTime: new Date(2018, 5, 13, 18, 0),
        EndTime: new Date(2018, 5, 13, 20, 0),
        ConferenceId: [2, 3]
    }, {
        Id: 40,
        Subject: 'Content Marketing World',
        StartTime: new Date(2018, 5, 13, 18, 0),
        EndTime: new Date(2018, 5, 13, 20, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 41,
        Subject: 'B2B Marketing Forum',
        StartTime: new Date(2018, 5, 14, 14, 0),
        EndTime: new Date(2018, 5, 14, 16, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 42,
        Subject: 'Business Innovation Factory',
        StartTime: new Date(2018, 5, 14, 14, 0),
        EndTime: new Date(2018, 5, 14, 16, 0),
        ConferenceId: [2, 3]
    }, {
        Id: 43,
        Subject: 'Grow Conference',
        StartTime: new Date(2018, 5, 14, 18, 0),
        EndTime: new Date(2018, 5, 14, 20, 0),
        ConferenceId: [3]
    }, {
        Id: 44,
        Subject: 'Journalism Interactive',
        StartTime: new Date(2018, 5, 14, 18, 0),
        EndTime: new Date(2018, 5, 14, 20, 0),
        ConferenceId: [1, 2, 3]
    }, {
        Id: 45,
        Subject: 'Blogcademy',
        StartTime: new Date(2018, 5, 15, 14, 0),
        EndTime: new Date(2018, 5, 15, 16, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 46,
        Subject: 'Sustainable Brands',
        StartTime: new Date(2018, 5, 15, 14, 0),
        EndTime: new Date(2018, 5, 15, 16, 0),
        ConferenceId: [1, 3]
    }, {
        Id: 47,
        Subject: 'Fashion Confidential',
        StartTime: new Date(2018, 5, 15, 18, 0),
        EndTime: new Date(2018, 5, 15, 20, 0),
        ConferenceId: [1, 2]
    }, {
        Id: 48,
        Subject: 'Mobile World Conference',
        StartTime: new Date(2018, 5, 15, 18, 0),
        EndTime: new Date(2018, 5, 15, 20, 0),
        ConferenceId: [2, 3]
    }
  ];
  listColor : any[]=['#ffcd94','#ffe34c','#b6fcd5','#1aaa55','#357cd2','#7fa900','#4ca3dd','#ffb42e','#ffff66']
  public NumbreUser : number = 18
  public data: Object[] = <Object[]>extend([], this.resourceConferenceData, null, true);
  public selectedDate: Date = new Date(2018, 5, 5);
  public currentView: View = 'WorkWeek';
  public resourceDataSource: Object[] = [
        { Text: 'Margaret', Id: 1, Color: '#1aaa55' },
        { Text: 'Robert', Id: 2, Color: '#357cd2' },
        { Text: 'Laura', Id: 3, Color: '#7fa900' },
        { Text: 'Margaret', Id: 4, Color: '#1aaa55' },
        { Text: 'Robert', Id: 5, Color: '#357cd2' },
        { Text: 'Laura', Id: 6, Color: '#7fa900' },
        { Text: 'Margaret', Id: 7, Color: '#1aaa55' },
        { Text: 'Robert', Id: 8, Color: '#357cd2' },
        { Text: 'Laura', Id: 9, Color: '#7fa900' },
        { Text: 'Margaret', Id: 10, Color: '#1aaa55' },
        { Text: 'Robert', Id: 11, Color: '#357cd2' },
        { Text: 'Laura', Id: 12, Color: '#7fa900' },
        { Text: 'Margaret', Id: 13, Color: '#1aaa55' },
        { Text: 'Robert', Id: 14, Color: '#357cd2' },
        { Text: 'Laura', Id: 15, Color: '#7fa900' },
        { Text: 'Margaret', Id: 16, Color: '#1aaa55' },
        { Text: 'Robert', Id: 17, Color: '#357cd2' },
        { Text: 'Laura', Id: 18, Color: '#7fa900' }
    ];
    public group: GroupModel = { allowGroupEdit: true, resources: ['Conferences'] };
    public allowMultiple: Boolean = true;
    
    public eventSettings: EventSettingsModel = {
        dataSource: this.resourceConferenceData,
        fields: {
            subject: { title: 'Conference Name', name: 'Subject' },
            description: { title: 'Summary', name: 'Description' },
            startTime: { title: 'From', name: 'StartTime' },
            endTime: { title: 'To', name: 'EndTime' }
        }
    };

    constructor(private userService : UserService) {
    }

    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    ngOnInit(): void {
      this.userService.getUsersByRoleAgent().subscribe(
        (data : []) => {
          data.forEach((value)=> {
            var retrievedImage: any;
            var base64Data: any;
            var retrieveResonse: any;
            retrieveResonse = value;
            base64Data = retrieveResonse["data"];
            retrievedImage = 'data:image/jpeg;base64,' + base64Data;
            this.listAgent.push({'Id': value["agentId"],"image":retrievedImage,"username":value["username"],"matricule":value["matricule"],Text:value["fullName"],Color: this.listColor[this.getRandomInt(10)]})
          })
          console.log(this.listAgent)
          this.scheduleObj.resources[0].dataSource = this.listAgent
        },
        err => {
          console.log(JSON.parse(err.error).message)
      })
  
    }

    getEmployeeName(value: ResourceDetails | TreeViewArgs): string {
        return ((value as ResourceDetails).resourceData) ?
            (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] as string
            : (value as TreeViewArgs).resourceName;
    }
    getEmployeeDesignation(value: ResourceDetails | TreeViewArgs): string {
        let resourceName: string = this.getEmployeeName(value);
        return (resourceName === 'Margaret') ? 'Sales Representative' : (resourceName === 'Robert') ?
            'Vice President, Sales' : 'Inside Sales Coordinator';
    }
    getEmployeeImage(value: ResourceDetails | TreeViewArgs): string {
        let resourceName: string = this.getEmployeeName(value);
        return resourceName.replace(' ', '-').toLowerCase();
    }

    

    
    onActionComplete(args: ActionEventArgs): void {
      if (!this.flag) {
          const page: string = '1' as string;
          const  resourceDataSource1: Object[] = [
            { Text: 'Margaret', Id: 1, Color: '#1aaa55' }];
          //this.scheduleObj.resources[0].dataSource = resourceDataSource1
          console.log(this.scheduleObj.resources[0].dataSource)
          console.log(this.scheduleObj.eventSettings.dataSource)
          this.pageChange(page);
      }
    }
    onSlide(args: PageEventArgs): void {
      const page: string = args.currentPage;
      console.log("page  " +page)

      this.pageChange(page);
      this.flag = true;
    }

    pageChange(page: string) {
      console.log(parseInt(page))
      var debutIndex = 5*(parseInt(page)-1)
      var finIndex = 5*parseInt(page)-1
      if((this.NumbreUser-1)<finIndex){
        finIndex = this.NumbreUser-1
      }

      const CurRoomData: Object[] = [];
      const CurConferenceData: Object[] = [];
      const dm1: DataManager = new DataManager({ json: this.resourceConferenceData });

      for (var i = debutIndex; i < finIndex+1; i++) {
        const val: any = this.resourceDataSource[i];
        const CurResData: Object[] = dm1.executeLocal(new Query().where('Id', 'equal', val.Id));
        CurConferenceData.push(CurResData[0])
        CurRoomData.push(this.resourceDataSource[val.Id - 1]);
      }
      console.log(CurRoomData)
      console.log(CurConferenceData)
      this.scheduleObj.resources[0].dataSource = CurRoomData;
      this.scheduleObj.eventSettings.dataSource = CurConferenceData;
      this.scheduleObj.dataBind();
      
    }

    onResizeStart(args : ResizeEventArgs) : void{
      //args.scroll.enable = false
      args.interval = 5
    }
    public dateParser(data: string) {
      return new Date(data);
    }




}*/

/*export class AgentSchedulerComponent{
  public setView : View = "WorkWeek"
  public setDate: Date = new Date(2019, 0, 15);
  public resourcetDataSource : Object[] = [
    {Name : 'Nancy',Id : 1,Color : '#56ca85' },
    {Name : 'YASSINE',Id : 2,Color : '#cb6bb2' },
    {Name : 'ZOUHRI',Id : 3,Color : '#df5286' }
  ]

  public groupData: GroupModel = {
    resources: ['Resources']
  };

  public eventObject: EventSettingsModel = {
    dataSource:[{
      Id: 1,
      Subject: "Meditation time",
      StartTime: new Date(2019,0,17,11,0),
      EndTime: new Date(2019,0,17,11,30),
      Location: "At Yoga Center",
      ResourceID : 1

    },{
      Id: 2,
      Subject: "Meditation 2222",
      StartTime: new Date(2019,0,18,11,0),
      EndTime: new Date(2019,0,18,11,30),
      Location: "At Yoga Center",
      ResourceID : 3

    }]

  }

  public setViews : View[] = ["Day","Month","Week","WorkWeek","TimelineMonth","TimelineDay","TimelineWeek"]

  onResizeStart(args : ResizeEventArgs) : void{
    //args.scroll.enable = false
    args.interval = 5
  }


}*/

/**
 
export class AgentSchedulerComponent  {
  public timeScale: TimeScaleModel = { interval: 60, slotCount: 1 };
  public selectedDate: Date = new Date(2018, 3, 4);
  public group: GroupModel = {
      resources: ['Projects', 'Categories']
  };
  public projectDataSource: Object[] = [
      { text: 'PROJECT 1', id: 1, color: '#cb6bb2' },
      { text: 'PROJECT 2', id: 2, color: '#56ca85' },
      { text: 'PROJECT 3', id: 3, color: '#df5286' }
  ];
  public categoryDataSource: Object[] = [
      { text: 'Nancy', id: 1, groupId: 1, color: '#df5286' },
      { text: 'Steven', id: 2, groupId: 1, color: '#7fa900' },
      { text: 'Robert', id: 3, groupId: 2, color: '#ea7a57' },
      { text: 'Smith', id: 4, groupId: 2, color: '#5978ee' },
      { text: 'Micheal', id: 5, groupId: 3, color: '#df5286' },
      { text: 'Root', id: 6, groupId: 3, color: '#00bdae' },
  ];
  public allowMultiple: Boolean = true;
  public eventSettings: EventSettingsModel = {
      dataSource: <Object[]>extend([], resourceData.concat(timelineResourceData), null, true)
  };

  public eventSettings: EventSettingsModel = {
    //dataSource: this.eventData
    dataSource:[{
      StartTime: new Date(2018, 3, 4,4,0),
      EndTime: new Date(2018, 3, 4,6,0),
      Location: "At Yoga Center",
      //IsAllDay : true
    }]

  }


  onResizeStart(args : ResizeEventArgs) : void{
    //args.scroll.enable = false
    args.interval = 5
  }
}
 */

/**
 @ViewChild('schedulerObj')
  public scheduleInstance : ScheduleComponent
  private eventData : DataManager = new DataManager({
    url:'https://js.syncfusion.com/demos/ejservices/api/Schedule/loadData',
    adaptor : new WebApiAdaptor,
    crossDomain : true
  })

  constructor() { }

  ngOnInit(): void {
  }

  public setView : View[] = ["Day","Month","TimelineMonth","TimelineDay"]
  public setDate: Date = new Date(2019, 0, 17);
  public eventObject: EventSettingsModel = {
    //dataSource: this.eventData
    dataSource:[{
      Id: 1,
      Subject: "Meditation time",
      StartTime: new Date(2019,0,17,4,0),
      EndTime: new Date(2019,0,17,6,0),
      Location: "At Yoga Center",
      //IsAllDay : true
    }]

  }

  public waitingList : {[key:string] : Object}[] = [
    {
      Id : 1,
      Name : 'Steven'
    },
    {
      Id : 2,
      Name : 'yassine'
    },
    {
      Id : 3,
      Name : 'zouhri'
    },
  ]

  public field : Object = {dataSource : this.waitingList,id : 'Id',text:'Name'}

  onDragStart(args : DragEventArgs) : void{
    //args.scroll.enable = false
    args.interval = 1
    args.navigation.enable = true
  }

  onResizeStart(args : ResizeEventArgs) : void{
    //args.scroll.enable = false
    args.interval = 1
  }

  onTreeDragStop(args : DragAndDropEventArgs) : void{
    let cellData : CellClickEventArgs = this.scheduleInstance.getCellDetails(args.target)
    let eventData1 : {[key : string] : Object} = {
      Subject : args.draggedNodeData.text,
      StartTime : cellData.startTime,
      EndTime : cellData.endTime,
      IsAllDay : cellData.isAllDay
    }
    this.scheduleInstance.addEvent(eventData1)
  }

  
 */