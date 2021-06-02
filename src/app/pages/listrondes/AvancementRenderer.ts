import { Component, OnDestroy } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";



@Component({
    selector: 'btn-Affectation-renderer',
    template: `
    <button style="margin:5px;border-radius:50%;" [disabled]="btnStatus" nbButton outline status="primary" (click)="btnClickedHandler($event)"><nb-icon icon="pin-outline"></nb-icon></button>
    `,
  })
  export class AvancementRenderer implements ICellRendererAngularComp, OnDestroy {
    private params: any;
    btnStatus = true

    agInit(params: any): void {
        this.params = params;
        if(this.params.data["idAgent"]==null){
          this.btnStatus = true
        }else{this.btnStatus = false}
    }
  
    btnClickedHandler(event) {
      console.log(event)
      //console.log(this.params.data["idAgent"]==null)
      this.params.clicked(this.params.data);
    }

    refresh(params?: any): boolean {
      return true;
    }

    ngOnDestroy() {}

  }