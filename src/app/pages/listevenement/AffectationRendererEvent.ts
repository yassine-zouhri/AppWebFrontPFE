import { Component, OnDestroy } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";



@Component({
    selector: 'btn-Affectation-renderer',
    template: `
    <button style="margin:5px;border-radius:50%;" nbButton [disabled]="btnStatus"  outline status="success" (click)="btnClickedHandler($event)"><nb-icon icon="person-add-outline"></nb-icon></button>
    `,
  })
  export class AffectationRendererEvent implements ICellRendererAngularComp, OnDestroy {
    private params: any;
    btnStatus = false

    agInit(params: any): void {
        this.params = params;
        if(this.params.data["traite_par"]==""){
          this.btnStatus = false
        }else{this.btnStatus = true}
        console.log(this.params.data)
    }
  
    btnClickedHandler(event) {
      //console.log(this.params.data["idAgent"]==null)
      this.params.clicked(this.params.data);
    }

    refresh(params?: any): boolean {
      return true;
    }

    ngOnDestroy() {}

  }