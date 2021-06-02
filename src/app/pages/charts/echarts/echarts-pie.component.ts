import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-echarts-pie',
  template: `
    <button (click)='test()'>test</button>
    <div echarts [options]="options" class="echart" id="myChart1"></div>
  `,
})
export class EchartsPieComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  test(){
    console.log("fffffffffffff")
   var canvas = <HTMLCanvasElement> document.getElementById('myChart1').children[0].children[0];
    var img    = canvas.toDataURL("image/png");
    //document.write('<img src="'+img+'"/>');
    var aDownloadLink = document.createElement("a");
    aDownloadLink.download = "map_capture.png";
    aDownloadLink.href = img ;
    aDownloadLink.click();


    /*const canvas = <HTMLCanvasElement> document.getElementById('myChart1').children[0].children[0];
    console.log(canvas)
    const context = canvas.getContext('2d');
          context.fillStyle = "green";
          context.fillRect(50, 50, 100, 100);

          canvas.toDataURL("image/png");*/

  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;
      this.options = {
        
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['USA', 'Germany', 'France', 'Canada', 'Russia'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Countries',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [
              { value: 335, name: 'Germany' },
              { value: 310, name: 'France' },
              { value: 234, name: 'Canada' },
              { value: 135, name: 'Russia' },
              { value: 1548, name: 'USA' },
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },

          },
        ],
      };
    });
 
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
