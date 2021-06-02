import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NbDialogService } from "@nebular/theme";
import { userResponse } from "../../Models/Response/userResponse";
import { UserService } from "../../service/userService/user.service";
import { AddUserComponent } from "../add-user/add-user.component";
import { UpdateUserProfileComponent } from "../update-user-profile/update-user-profile.component";
import { delay, map, switchMap } from "rxjs/operators";
import { LocalDataSource } from "ng2-smart-table";
import { DatePipe } from "@angular/common";
import { tsXLXS } from "ts-xlsx-export";

@Component({
  selector: "ngx-list-users",
  templateUrl: "./list-users.component.html",
  styleUrls: ["./list-users.component.scss"],
})
export class ListUsersComponent implements OnInit {
  public AllUsers: userResponse[];

  public source: LocalDataSource;
  public data = [];
  listUserSelected : []
  constructor(
    private userService: UserService,
    private dialogService: NbDialogService,
    private datePipe: DatePipe
  ) {}

  getBoolean(value) {
    switch (value) {
      case true:
      case "true":
      case 1:
      case "1":
      case "on":
      case "yes":
        return true;
      default:
        return false;
    }
  }
  ngOnInit(): void {
    this.getAllUsers();
  }

  onCustomAction(event) {
    //console.log(event)
    switch (event.action) {
      case "update":
        console.log(event.data);
        //this.GetUuidImage("event.data[username]  "+event.data["username"])
        this.dialogService
          .open(UpdateUserProfileComponent, {
            context: {
              MyUser: event.data,
              uuidImage: this.GetUuidImage(event.data["username"]),
            },
          })
          .onClose.subscribe((name) => name && console.log(name));
        break;
      case "delete":
        console.log(event.data);
        if (window.confirm("Are you sure you want to delete?")) {
          this.DeleteUserById(event.data["username"]);
        }
    }
  }

  settings = {
    actions: {
      custom: [
        {
          name: "update",
          title: '<i class="nb-edit"></i>',
        },
        {
          name: "delete",
          title: '<i class="nb-trash"></i>',
        },
      ],
      add: false,
      edit: false,
      delete: false,
      position: "left",
    },
    mode: "inline",
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      username: {
        title: "Username",
        type: "string",
        editable: false,
      },
      email: {
        title: "Email",
        type: "string",
        editable: false,
      },
      role: {
        title: "Role",
        type: "string",
      },
      lastName: {
        title: "Nom",
        type: "string",
      },
      firstName: {
        title: "Prenom",
        type: "string",
      },
      birthDate: {
        title: "Anniversaire",
        type: "string",
      },
      city: {
        title: "Ville",
        type: "string",
      },
      pays: {
        title: "Pays",
        type: "string",
      },
      company: {
        title: "Entreprise",
        type: "string",
      },
      jobPosition: {
        title: "Échelle",
        type: "string",
      },
      Mobile: {
        title: "mobile",
        type: "string",
      },
      actif: {
        title: "Status",
        type: "boolean",
      },
    },
  };

  data1 = [
    {
      username: "yassine1998",
      email: "yassinezouhri98@gmail.com",
      role: "admin",
      lastName: "Otto",
      firstName: "Mark",
      birthDate: "1998-09-17",
      city: "bejaad",
      pays: "maroc",
      company: "TMSA",
      jobPosition: "11",
      Mobile: "+212623742230",
      actif: true,
    },
    {
      username: "yassine1998",
      email: "yassinezouhri98@gmail.com",
      role: "admin",
      lastName: "Otto",
      firstName: "Mark",
      birthDate: "1998-09-17",
      city: "bejaad",
      pays: "maroc",
      company: "TMSA",
      jobPosition: "11",
      Mobile: "+212623742230",
      actif: true,
    },
  ];


  public getAllUsers(): void {
    this.userService.getUsers1().then((value) => {
      value["pipe"](map((res) => res)).subscribe((result: userResponse[]) => {
        this.AllUsers = result;
        console.log(this.AllUsers);
        this.data = [];
        result.forEach((value) => {
          var row = {
            username: value.username,
            email: value.email,
            role: value.role,
            lastName: value.lastName,
            firstName: value.firstName,
            birthDate: this.datePipe.transform(value.birthDate, "yyyy-MM-dd"),
            city: value.city,
            pays: value.country,
            company: value.company,
            jobPosition: value.jobPosition,
            Mobile: value.mobile,
            actif: this.getBoolean(value.actif),
          };
          this.data.push(row);
          //console.log(row)
        })
        this.source = new LocalDataSource(this.data);
        this.source.load(this.data);
        this.source.refresh();

      });
    });
  }

  onDeleteConfirm(event): void {
    console.log(event.data);
    if (window.confirm("Are you sure you want to delete?")) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onEditConfirm(event): void {
    //console.log("inEdittttttt")
    //console.log(event.data)
    //console.log(event.newData)
    this.AddUser();
    event.confirm.resolve();
  }

  public AddUser() {
    setTimeout(() => {
      this.dialogService
        .open(AddUserComponent)
        .onClose.subscribe((name) => name && console.log(name));
    }, 500);
  }

  DeleteUserById(username: string) {
    var userID;
    this.AllUsers.forEach(function (value) {
      if (value["username"] == username) {
        userID = value["id"];
      }
    });
    this.userService.deleteEmployee(userID).subscribe(
      (response) => {
        console.log(response);
        window.location.reload();
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  GetUuidImage(username: string) {
    console.log("username : string  " + username);
    var uuidImage;
    this.AllUsers.forEach(function (value) {
      console.log(value);
      console.log(
        "value.username == username  " +
          "  " +
          value.username +
          "  " +
          username +
          "  " +
          (value.username == username)
      );
      if (value.username == username) {
        console.log("value.UUIDimage   +" + value.UUIDimage);
        uuidImage = value["uuidimage"];
      }
    });
    console.log("uuidImage : string  " + uuidImage);
    return uuidImage;
  }

  onBtExport() {
    tsXLXS().exportAsExcelFile(this.listUserSelected).saveAsExcelFile("listeUser");
  }

  getSelectedRows(event) {
    this.listUserSelected = event.source.filteredAndSorted
  }
}
