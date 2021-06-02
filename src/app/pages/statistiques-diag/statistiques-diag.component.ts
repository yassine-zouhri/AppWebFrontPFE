import { HttpErrorResponse } from "@angular/common/http";
import { Component, NgZone, OnInit } from "@angular/core";

import * as Highcharts from "highcharts";
import { EventResponse } from "../../Models/Response/EventResponse";
import { EventService } from "../../service/userService/event.service";

const HighchartsMore = require("highcharts/highcharts-more");
HighchartsMore(Highcharts);

const exporting = require("highcharts/modules/exporting.src");
exporting(Highcharts);

const exportData = require("highcharts/modules/export-data");
exportData(Highcharts);

@Component({
  selector: "ngx-statistiques-diag",
  templateUrl: "./statistiques-diag.component.html",
  styleUrls: ["./statistiques-diag.component.scss"],
})
export class StatistiquesDiagComponent implements OnInit {
  chartCategorie;chartZone;chartStatut;chartDate;
  ListeDateEvent : any[] = []
  updateFromInputCategorie = false;updateFromInputZone = false;updateFromInputStatut = false;updateFromInputDate = false;
  highcharts = Highcharts;
  chartConstructorCategorie = "chart";chartConstructorZone = "chart";chartConstructorStatut = "chart";chartConstructorDate = "chart";
  chartCallbackCategorie;chartCallbackZone;chartCallbackStatut;chartCallbackDate;
  chartOptionsCategorie = {
    chart: {
      plotBackgroundColor: 'white',
      plotBorderWidth: 0,
      plotShadow: true,
      type: 'pie',
    },
    title: {
      text: 'Nombre des evenements déclarés par catégorie'
    },
    tooltip: {
      pointFormat: 'Percentage: <b>{point.percentage:.1f}%</b> <br/> Nombre: <b>{point.y}</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    exporting: {
      enabled: true,
    },
    series: [{
      colorByPoint: true,
      type: undefined,
      data: []
    }]
  };
  chartOptionsZone = {
    chart: {
      plotBackgroundColor: 'white',
      plotBorderWidth: 0,
      plotShadow: true,
      type: 'pie',
    },
    title: {
      text: 'Nombre des evenements déclarés par zone'
    },
    tooltip: {
      pointFormat: 'Percentage: <b>{point.percentage:.1f}%</b> <br/> Nombre: <b>{point.y}</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    exporting: {
      enabled: true,
    },
    series: [{
      colorByPoint: true,
      type: undefined,
      data: []
    }]
  };
  chartOptionsStatut = {
    chart: {
      plotBackgroundColor: 'white',
      plotBorderWidth: 0,
      plotShadow: true,
      type: 'pie',
    },
    title: {
      text: 'Nombre des evenements déclarés par statut'
    },
    tooltip: {
      pointFormat: 'Percentage: <b>{point.percentage:.1f}%</b> <br/> Nombre: <b>{point.y}</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    exporting: {
      enabled: true,
    },
    series: [{
      colorByPoint: true,
      type: undefined,
      data: []
    }]
  };

  chartOptionsDate = {
    
    chart: {
      type: 'spline'
    },
    title: {
        text: 'Nombre des evenements déclarés par jour'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { // don't display the dummy year
          month: '%e. %b',
          year: '%b'
      },
      title: {
          text: 'Date'
      }
    },
    yAxis: {
      title: {
          text: 'Nombre des evenements déclarés'
      },
      min: 0
    },
    tooltip: {
      pointFormat: 'Nombre des événements =  {point.y} '
    },
    plotOptions: {
      series: {
          marker: {
              enabled: true
          }
      }
    },
    colors: ['#6CF', '#39F', '#06C', '#036', '#000'],


    series: [{
        name: "Graphe",
        type:'spline',
        data: []
    },],
    responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
              plotOptions: {
                  series: {
                      marker: {
                          radius: 2.5
                      }
                  }
              }
          }
      }]
    }

  }


  constructor(private eventService: EventService) {
    const self = this;
    this.chartCallbackCategorie = (chart) => {
      self.chartCategorie = chart;
    };
    this.chartCallbackZone = (chart) => {
      self.chartZone = chart;
    };
    this.chartCallbackStatut = (chart) => {
      self.chartStatut = chart;
    };
    this.chartCallbackDate = (chart) => {
      self.chartDate = chart;
    };
  }

  listeCategorie = {
    "Incendie": 0,
    "Accident de travail": 0,
    "Immigration illégale": 0,
    "Contrebande": 0,
  };
  listeZone = {"Zone1":0,"Zone2":0,"Zone3":0,"Zone4":0}
  ListeEvent: EventResponse[] = [];
  
  ListDataCategorie = [{name:'Incendie',y:0,sliced: true,selected: true},{name:'Accident de travail',y:0},{name:'Immigration illégale',y:0},{name:'Contrebande',y:0}]
  ListDataZone = [{name:'Zone1',y:0,sliced: true,selected: true},{name:'Zone2',y:0},{name:'Zone3',y:0},{name:'Zone4',y:0}]
  ListDatStatut = [{name:"Terminé",y:0,sliced: true,selected: true},{name:"Non traité",y:0},{name:"En cours de traitement",y:0}]
  ngOnInit(): void {
    this.GetAllEvents()
    setTimeout(() => {
      this.update_chartCategorie()
      this.update_chartZone()
      this.update_chartStatut()
      this.update_chartDate()
    }, 2000);
  }

  GetAllEvents(){
    var b : any[]= []
    this.eventService.GetAllevents().subscribe(
      (data: EventResponse[]) => {
        console.log(data);
        data.forEach((value) => {
          this.ListeEvent.push(value)
          var date = new Date(value.date)
          b.push(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()))
        });
        var g :any[][]= this.OrderList(b)

        if(g.length>0){
          for(var i = 0;i<g[0].length;i++){
            this.ListeDateEvent.push([g[0][i],g[1][i]])
          }
        }
        this.GetListeEventByCategorie()
        this.GetListeEventByZone()
        this.GetListeEventByStatut()
      },
      (err) => {
        console.log(JSON.parse(err.error).message);
      }
    );
  }

  OrderList(arr) {
    var a = [],b = [], prev;  
    arr.sort();
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] !== prev) {
        a.push(arr[i]);
        b.push(1);
      } else {
        b[b.length - 1]++;
      }
      prev = arr[i];
    }
    return [a, b];
  }

  GetListeEventByCategorie(){
    if(this.ListeEvent!=null){
      this.ListeEvent.forEach(value =>{
        if(value.categorie == 'Incendie'){this.listeCategorie['Incendie'] ++ ;this.ListDataCategorie[0].y++  }
        else if(value.categorie == 'Accident de travail'){this.listeCategorie['Accident de travail'] ++ ;this.ListDataCategorie[1].y++ }
        else if(value.categorie == 'Immigration illégale'){this.listeCategorie['Immigration illégale'] ++ ;this.ListDataCategorie[2].y++ }
        else if(value.categorie == 'Contrebande'){this.listeCategorie['Contrebande'] ++;this.ListDataCategorie[3].y++ }
      })
    }
  }

  GetListeEventByZone(){
    if(this.ListeEvent!=null){
      this.ListeEvent.forEach(value =>{
        if(value.zone == 'Zone1'){this.listeCategorie['Zone1'] ++ ;this.ListDataZone[0].y++  }
        else if(value.zone == 'Zone2'){this.listeCategorie['Zone2'] ++ ;this.ListDataZone[1].y++ }
        else if(value.zone == 'Zone3'){this.listeCategorie['Zone3'] ++ ;this.ListDataZone[2].y++ }
        else if(value.zone == 'Zone4'){this.listeCategorie['Zone4'] ++;this.ListDataZone[3].y++ }
      })
    }
    console.log(this.ListDataZone)
  }

  GetListeEventByStatut(){
    if(this.ListeEvent!=null){
      this.ListeEvent.forEach(value =>{
        if(value.statut == "Terminé"){this.ListDatStatut[0].y++  }
        else if(value.statut == "Non traité"){this.ListDatStatut[1].y++ }
        else if(value.statut == "En cours de traitement"){this.ListDatStatut[2].y++ }
      })
    }
    console.log(this.ListDatStatut)
  }

  update_chartCategorie() {
    const self = this,
      chart = this.chartCategorie;

    chart.showLoading();
    setTimeout(() => {
      chart.hideLoading();

      self.chartOptionsCategorie.series = [
        {
          colorByPoint: true,
          type: undefined,
          data: self.ListDataCategorie
        }
      ];

      self.updateFromInputCategorie = true;
    }, 2000);
  }

  update_chartDate() {
    const self = this,
      chart = this.chartDate;

    chart.showLoading();
    setTimeout(() => {
      chart.hideLoading();
      self.chartOptionsDate.series = [
        {
          name:'Graphe',
          type:'spline',
          data: self.ListeDateEvent
        }
      ];
      console.log(self.ListeDateEvent)
      self.updateFromInputDate = true;
    }, 2000);
  }

  update_chartZone() {
    const self = this,
      chart = this.chartZone;
    chart.showLoading();
    setTimeout(() => {
      chart.hideLoading();

      self.chartOptionsZone.series = [
        {
          colorByPoint: true,
          type: undefined,
          data: self.ListDataZone
        }
      ];

      self.updateFromInputZone = true;
    }, 2000);
  }

  update_chartStatut() {
    const self = this,
      chart = this.chartStatut;
    chart.showLoading();
    setTimeout(() => {
      chart.hideLoading();

      self.chartOptionsStatut.series = [
        {
          colorByPoint: true,
          type: undefined,
          data: self.ListDatStatut
        }
      ];

      self.updateFromInputStatut = true;
    }, 2000);
  }
}
