import { Component, OnDestroy } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";



@Component({
    selector: 'btn-cell-renderer',
    template: `<img style=' vertical-align: middle;width: 50px;height: 50px;border-radius: 50%;' src=\"{{ params.value }}\">` 
  })
  export class UseravatarRenderer implements ICellRendererAngularComp, OnDestroy {
    public params: any;

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