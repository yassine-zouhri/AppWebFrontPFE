import { Injectable } from "@angular/core";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { BehaviorSubject } from "rxjs";
import { FCMuserTokenRequest } from "../../Models/Request/FCMuserTokenRequest";
import { TokenStorageService } from "../token-storageService/token-storage.service";
import { UserService } from "../userService/user.service";
//import * as functions from 'firebase-functions'

const USER_KEY = 'auth-user';

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging , private tokenStorageService : TokenStorageService,
    private userService : UserService) {
   this.angularFireMessaging.messages.subscribe(
    (_messaging: AngularFireMessaging) => {
    _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
  })


  }
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        var value : FCMuserTokenRequest = new FCMuserTokenRequest(this.tokenStorageService.getUser().id,token)
        this.userService.SendTokenFCM(value).subscribe(
          (data ) => {       
          },
          err => {
            console.log(JSON.parse(err.error).message)
        })
        window.sessionStorage.setItem("TOKEN_FB", token);
      },
      (err) => {
        console.error("Unable to get permission to notify.", err);
      }
    );
  }
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload) => {
      console.log("new message received. ", payload);
      this.currentMessage.next(payload);
      this.ShowCustomNotification(payload)
    });
  }

  ShowCustomNotification(payload : any){
    /*functions.database.ref('/events').onUpdate(async (change, context) =>{
      console.log(change,context)
    })
    payload.data.imageURL*/
    let notify_data = payload['notification']
    let title = notify_data['title']
    /*let options = {
      body : notify_data['body'],
      icon : "../assets/images/eva.png",
      badge : "../assets/images/cover3.jpg",
      image : "../assets/images/cover2.jpg"
    }*/
    let options = {
      body : notify_data['body'],
      icon : payload.data.imageURL,
      badge : payload.data.imageURL,
      image : payload.data.imageURL
    }
    console.log("new message received : ",notify_data)
    let notify : Notification = new Notification(title,options)
    notify.onclick = event =>{
      event.preventDefault();
      window.location.href="https://www.google.com"
    }
  }



  receiveMessageAgentAganda() {
    this.angularFireMessaging.messages.subscribe((payload) => {
      console.log("new message received. ", payload);
      this.currentMessage.next(payload);
      this.ShowCustomNotificationAgentAganda(payload)
    });
  }
  ShowCustomNotificationAgentAganda(payload : any){
    console.log(payload)
    let notify_data = payload['notification']
    let title = notify_data['title']
    let options = {
      body : notify_data['body'],
      image : payload['notification'].image
    }
    
    console.log("new message received : ",notify_data)
    let notify : Notification = new Notification(title,options)
    notify.onclick = event =>{
      event.preventDefault();
      window.location.href="https://www.google.com"
    }
  }



}
