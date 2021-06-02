import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from "@nebular/theme";

import { UserData } from "../../../@core/data/users";
import { LayoutService } from "../../../@core/utils";
import { filter, map, takeUntil } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { TokenStorageService } from "../../../service/token-storageService/token-storage.service";
import { UserService } from "../../../service/userService/user.service";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { MessagingService } from "../../../service/firebaseService/MessagingService";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { AgentAgendaService } from "../../../service/firebaseService/AgentAgendaService";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  username: string;

  dbRef = this.db.database.ref();
  userID = ""
  notes_Firebase_Data :AngularFireList<any>;
  notes_angular :Observable<any[]>;
  title = 'push-notification';
  message;
  listNotification =[]
  NumOfNoAssignedEvent = 0
  CurrentUser ;
  themes = [
    {
      value: "default",
      name: "Light",
    },
    {
      value: "dark",
      name: "Dark",
    },
    {
      value: "cosmic",
      name: "Cosmic",
    },
    {
      value: "corporate",
      name: "Corporate",
    },
  ];

  currentTheme = "default";

  userMenu = [{ title: "Profile" }, { title: "Log out" }];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private tokenStorage: TokenStorageService,
    private MyuserService: UserService,
    public db : AngularFireDatabase,
    private messagingService: MessagingService,
    private datePipe: DatePipe,
    private router : Router,
    private agentAgendaService : AgentAgendaService
  ) {}

  onContecxtItemSelection(title) {
    console.log("click", title);
    if (title == "Log out") {
      this.tokenStorage.signOut();
    }
  }

  CheckValidationToken() {
    var dateNow : Date = new Date()
    var tokenExp : Date;
    console.log(this.tokenStorage.getUser())
    if(this.tokenStorage.getUser()==null){
      this.router.navigate(['/login'], {});
    }else if(this.tokenStorage.getToken()!=null){
      tokenExp = new Date(this.tokenStorage.getUser().expirationToken)
      /*if(dateNow>tokenExp){
        this.router.navigate(['/login'], {});
      }*/
    }
  }

  ngOnInit() {
    //this.agentAgendaService.start()
    this.CheckValidationToken() 
    if(this.tokenStorage.getUser()!=null){
      this.userID = this.tokenStorage.getUser()["id"]
      this.messagingService.requestPermission()
      this.messagingService.receiveMessage()
      this.message = this.messagingService.currentMessage
      this.notes_Firebase_Data= this.db.list('eventsAppWeb/'+this.userID);
      this.notes_angular=this.notes_Firebase_Data.valueChanges();
      this.CurrentUser = this.tokenStorage.getUser()
      console.log(new Date(this.tokenStorage.getUser().expirationToken))
      this.GetNotification()
  
      $(".profile .icon_wrap").click(function(){
        $(this).parent().toggleClass("active");
        $(".notifications").removeClass("active");
      });
      
      $(".notifications .icon_wrap").click(function(){
        $(this).parent().toggleClass("active");
         $(".profile").removeClass("active");
      });
      
      $(".show_all .link").click(function(){
        $(".notifications").removeClass("active");
        $(".popup").show();
      });
      
      $(".close, .shadow").click(function(){
        $(".popup").hide();
      });
  
      this.menuService.onItemClick().subscribe((event) => {
        this.onContecxtItemSelection(event.item.title);
      });
  
      this.MyuserService.getImage(this.tokenStorage.getUser().id).subscribe(
        (data) => {
          console.log(data)
          this.retrieveResonse = data;
          this.base64Data = this.retrieveResonse["data"];
          this.retrievedImage = "data:image/jpeg;base64," + this.base64Data;
          console.log(this.retrievedImage)
          //console.log(this.retrievedImage)
        },
        (err) => {
          console.log(JSON.parse(err.error).message);
        }
      );
      this.username = this.tokenStorage.getUser()["username"];
      this.currentTheme = this.themeService.currentTheme;
  
      this.userService
        .getUsers()
        .pipe(takeUntil(this.destroy$))
        .subscribe((users: any) => (this.user = users.nick));
  
      const { xl } = this.breakpointService.getBreakpointsMap();
      this.themeService
        .onMediaQueryChange()
        .pipe(
          map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
          takeUntil(this.destroy$)
        )
        .subscribe(
          (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
        );
  
      this.themeService
        .onThemeChange()
        .pipe(
          map(({ name }) => name),
          takeUntil(this.destroy$)
        )
        .subscribe((themeName) => (this.currentTheme = themeName));
      }


    
  }

  

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  GetNotification(){
    this. notes_angular.subscribe(
      (data) =>{
        var a={
         "notification": {
         "title": "Hey there", 
         "body": "Subscribe to might ghost hack youtube channel"
         },
         "to" : "f4mw23KBGLK8-gXSW6hawm:APA91bHLd0VMr1A6aXPtNOmtrM14Un0tEE2M4Z8PfrI_4dRaN3bAEdxRwprACzmb-0F6sWnoWCs-YPRetdQkbh50SwIhd8hHN9h8qPrrnBTkyHan2j-p_JUmyNZFPzvCBA_uwvE1wbd3"
        }
        //this.messagingService.ShowCustomNotification(a);
        //console.log(data)
        this.NumOfNoAssignedEvent=0
        data.forEach(value=>{
          value["date"] = this.datePipe.transform(new Date(value["date"]), 'MM-dd , h:mm a')
          if(value["assigned"]==false){this.NumOfNoAssignedEvent ++;}
          
        })
        this.listNotification = data
        console.log(this.listNotification)
      }
    )
  }

  onClickEvent(item){
    console.log(item)
    var eventId = item.id
    var updates = {};
    item.dejavue = true
    updates['eventsAppWeb/'+this.userID +'/'+ eventId] = item;
    this.dbRef.update(updates)
  }
  

  
}
