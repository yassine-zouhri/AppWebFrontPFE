import { Component, OnDestroy } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";



@Component({
    selector: 'btn-cell-renderer',
    template: `

    <button style="margin-top:-8px;" nbButton ghost status="danger" (click)="btnClickedHandler($event)"><nb-icon icon="trash-2-outline"></nb-icon></button>
    `,
  })
  export class BtnCellRenderer implements ICellRendererAngularComp, OnDestroy {
    private params: any;


    agInit(params: any): void {
        this.params = params;
      }
  
    btnClickedHandler(event) {
      this.params.clicked(this.params.data);
    }

    refresh(params?: any): boolean {
        return true;
      }
    ngOnDestroy() {}

  }