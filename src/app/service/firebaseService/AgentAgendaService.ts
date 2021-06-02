import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { BehaviorSubject } from "rxjs";
import { FCMuserTokenRequest } from "../../Models/Request/FCMuserTokenRequest";
import { TokenStorageService } from "../token-storageService/token-storage.service";
import { UserService } from "../userService/user.service";
import {DataManager,WebApiAdaptor,Query} from '@syncfusion/ej2-data'
import { MessagingService } from "./MessagingService";
import { RecurrenceEditor } from "@syncfusion/ej2-schedule";


@Injectable()
export class AgentAgendaService {

    public resourceAgentAgenda: Object[] = []
    public allAgents 
    public UserFBtoken : string = ""
    constructor(
        private userService : UserService,
        private datePipe: DatePipe,
        private db : AngularFireDatabase,
        private messagingService: MessagingService) {

            this.start()
            this.CheckAgentStatut()
            this.GetAllAgents()
            this.GetToken()
            
        
    }
    start() {
        console.log("testttttttttttttttttttttttttttttttttttttt")
        setInterval(function() {
            console.log("fffffffffffffffffffffffff")
        }, 500000);
    }

    GetToken(){
        this.UserFBtoken= sessionStorage.getItem("TOKEN_FB");
    }

    GetAllAgents(){
        this.userService.GetAllAgents().subscribe(
            (data : [] ) => {
                this.allAgents = data
                console.log(data)                 
            },
            err => {
              console.log(JSON.parse(err.error).message)
        })
    }

    treatAsUTC(date) {
        var result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    }

    daysBetween(startDate, endDate) {
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        return ( this.treatAsUTC(endDate).valueOf() - this.treatAsUTC(startDate).valueOf() ) / millisecondsPerDay;
    }
    
    CheckAgentStatut(){
        
        var agentStatut = this.db.database.ref('agentStatut');
        var agentAgenda = this.db.database.ref('agentsAgenda');
        var that =this
        agentAgenda.on('value', (snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach(function(childSnapshot) {
              var childData = childSnapshot.val();
              that.resourceAgentAgenda.push(childData)   
            });
          }
        })
        setTimeout(() => {
          agentStatut.on('value', (snapshot) => {
            if (snapshot.exists()) {

                console.log(that.resourceAgentAgenda)
                const dm1: DataManager = new DataManager({ json: that.resourceAgentAgenda });


                snapshot.forEach(function(childSnapshot) {
                    var childData = childSnapshot.val();
                    const agentData: Object[] = dm1.executeLocal(new Query().where('ConferenceId', 'equal', childData.id));
                    /*agentData.forEach((agent)=>{
                        var StartTime : Date = new Date(agent["StartTime"])
                        var EndTime : Date= new Date(agent["EndTime"])
                        var LastConnected : Date = new Date(childData.lastConnected.time)
                        var TimeNow : Date = new Date()
                        console.log(StartTime);
                        console.log(LastConnected)
                        console.log(EndTime)
                        console.log(TimeNow)
                        console.log((LastConnected<StartTime) +"  "+ (LastConnected<EndTime)+" "+(TimeNow<=EndTime))
                        if(LastConnected<StartTime && LastConnected<EndTime && !childData.isNotified && (TimeNow<=EndTime)){
                            console.log(that.allAgents)
                            var myAgent = that.allAgents.filter( element => element.id ==childData.id)
                            var message={
                                "notification": {
                                "title": "Retard", 
                                "body": "L'agent "+myAgent[0].firstName+" "+myAgent[0].lastName+" n'a pas encore commencé son service \nEmail : "+myAgent[0].email+"\nMobile : "+myAgent[0].mobile,
                                "image" : myAgent[0].avatar
                                },
                                "to" : "f4mw23KBGLK8-gXSW6hawm:APA91bHLd0VMr1A6aXPtNOmtrM14Un0tEE2M4Z8PfrI_4dRaN3bAEdxRwprACzmb-0F6sWnoWCs-YPRetdQkbh50SwIhd8hHN9h8qPrrnBTkyHan2j-p_JUmyNZFPzvCBA_uwvE1wbd3"
                            }
                            that.messagingService.requestPermission()
                            that.messagingService.ShowCustomNotificationAgentAganda(message)
                            childData.isNotified = true
                            that.db.database.ref('agentStatut/'+childData.id).update(childData);
                        }
                    })*/
                    console.log(agentData)
                    let recObject: RecurrenceEditor = new RecurrenceEditor();
                    agentData.forEach((a)=>{
                        console.log(a["RecurrenceRule"])
                        var LastConnected : Date = new Date(childData.lastConnected.time)
                        var TimeNow : Date = new Date()
                        if(a["RecurrenceRule"]!=undefined){
                            
                            var recurrenceRule = a["RecurrenceRule"]
                            const substring = "COUNT";

                            if(!recurrenceRule.includes(substring)){
                                
                                var lastDateStart = new Date(that.GetDateWhenRepeatedAlways(a["StartTime"], recurrenceRule))
                                var lastDateEnd = new Date(that.GetDateWhenRepeatedAlways(a["EndTime"], recurrenceRule))
                                console.log(lastDateStart.toString())
                                console.log(lastDateEnd.toString())
                                if(LastConnected< lastDateStart && LastConnected< lastDateEnd &&  (TimeNow<=lastDateEnd) && (lastDateStart<=TimeNow)){
                                    console.log(that.allAgents)
                                    var myAgent = that.allAgents.filter( element => element.id ==childData.id)
                                    var message={
                                        "notification": {
                                        "title": "Retard", 
                                        "body": "L'agent "+myAgent[0].firstName+" "+myAgent[0].lastName+" n'a pas encore commencé son service \nEmail : "+myAgent[0].email+"\nMobile : "+myAgent[0].mobile,
                                        "image" : myAgent[0].avatar
                                        },
                                        "to" : that.UserFBtoken
                                    }
                                    that.messagingService.requestPermission()
                                    that.messagingService.ShowCustomNotificationAgentAganda(message)
                                }
                            }else{
                                let datesStart: number[] = recObject.getRecurrenceDates(new Date(a["StartTime"]), recurrenceRule);
                                var dateStart : Date = null;var dateEnd : Date = null;
                                console.log(datesStart)
                                for (let i: number = 0; i < datesStart.length; i++) {
                                    console.log(that.IsToday(new Date(datesStart[i])))
                                    if(that.IsToday(new Date(datesStart[i]))){
                                        dateStart = new Date(datesStart[i])
                                        console.log(new Date(datesStart[i]).toString())
                                    }
                                }
                                let datesEnd: number[] = recObject.getRecurrenceDates(new Date(a["EndTime"]), recurrenceRule);
                                console.log(datesEnd)
                                for (let i: number = 0; i < datesEnd.length; i++) {
                                    console.log(that.IsToday(new Date(datesEnd[i])))
                                    if(that.IsToday(new Date(datesEnd[i]))){
                                        dateEnd = new Date(datesEnd[i])
                                        console.log(new Date(datesEnd[i]).toString())
                                    }
                                }
                                if(LastConnected< dateStart && LastConnected< dateEnd &&  (TimeNow<=dateEnd) && (dateStart<=TimeNow)){
                                    console.log(that.allAgents)
                                    var myAgent = that.allAgents.filter( element => element.id ==childData.id)
                                    var message={
                                        "notification": {
                                        "title": "Retard", 
                                        "body": "L'agent "+myAgent[0].firstName+" "+myAgent[0].lastName+" n'a pas encore commencé son service \nEmail : "+myAgent[0].email+"\nMobile : "+myAgent[0].mobile,
                                        "image" : myAgent[0].avatar
                                        },
                                        "to" : that.UserFBtoken
                                    }
                                    that.messagingService.requestPermission()
                                    that.messagingService.ShowCustomNotificationAgentAganda(message)
                                }

                            }
                            
                        }else{
                            console.log("ffffffffffffffffffffffffffffffffffffffffffffffff")
                            var StartTime : Date = new Date(a["StartTime"])
                            var EndTime : Date= new Date(a["EndTime"])
                            var LastConnected : Date = new Date(childData.lastConnected.time)
                            var TimeNow : Date = new Date()
                            console.log(LastConnected +"        "+StartTime+"         "+EndTime +"          "+TimeNow)
                            console.log((LastConnected<StartTime)+"    "+(LastConnected<EndTime)+"    "+(TimeNow<=EndTime)+"    "+(StartTime<TimeNow))
                            if(LastConnected<StartTime && LastConnected<EndTime &&  (TimeNow<=EndTime)  && (StartTime<TimeNow)){
                                console.log(that.allAgents)
                                var myAgent = that.allAgents.filter( element => element.id ==childData.id)
                                var message={
                                    "notification": {
                                    "title": "Retard", 
                                    "body": "L'agent "+myAgent[0].firstName+" "+myAgent[0].lastName+" n'a pas encore commencé son service \nEmail : "+myAgent[0].email+"\nMobile : "+myAgent[0].mobile,
                                    "image" : myAgent[0].avatar
                                    },
                                    "to" : that.UserFBtoken
                                }
                                that.messagingService.requestPermission()
                                that.messagingService.ShowCustomNotificationAgentAganda(message)
                            }
                        }
                        
                    })
                    
                    console.log(childData.id)
                    console.log(that.datePipe.transform(new Date(childData.lastConnected.time), "yyyy-MM-dd , h:mm a"))          
                });
            }
          })
        }, 1000);
        
    }

    GetDateWhenRepeatedAlways(dateString : string, recurrenceRule : string){
        let today = this.treatAsUTC(new Date());
        let myDate = this.treatAsUTC(new Date(dateString));                      
        var numberDays = Math.trunc(Math.abs(this.daysBetween(today,myDate))) 
        let recObject: RecurrenceEditor = new RecurrenceEditor();
        let dates: number[] = recObject.getRecurrenceDates(new Date(dateString), recurrenceRule, null, numberDays + 1, new Date(dateString));
        if(dates.length>0){
            var lastDate = new Date(dates[dates.length - 1]).toString()
            return lastDate
        }
        return ""
    }

    IsToday(date : Date){
        const today = new Date()
        return date.getDate() == today.getDate() &&
            date.getMonth() == today.getMonth() &&
            date.getFullYear() == today.getFullYear()
    }

}