import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import * as Highcharts from 'highcharts';
import { AppService } from 'src/app/core/services/app.service';
import HC_exporting from 'highcharts/modules/exporting';

import theme from 'highcharts/themes/dark-unica';

theme(Highcharts);

@Component({
  selector: 'app-nordeste',
  templateUrl: './nordeste.component.html',
  styleUrls: ['./nordeste.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NordesteComponent implements OnInit {

  arrAux = [];
  Highcharts = Highcharts;
  chartOptions = {};

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.getData();
    this.setChart();
    HC_exporting(Highcharts);
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  getData() {
    return this.appService.getStates().subscribe(res => {
      let auxCases = 0;
      let auxDeaths = 0;
      let auxSuspects = 0;
      res.data.filter(status => {
        if (status.uf === 'AL' ||
          status.uf === 'BA' ||
          status.uf === 'CE' ||
          status.uf === 'MA' ||
          status.uf === 'PB' ||
          status.uf === 'RN' ||
          status.uf === 'SE' ||
          status.uf === 'PE' ||
          status.uf === 'PI'
        ) {
          auxDeaths += status.deaths;
          auxCases += status.cases;
          auxSuspects += status.suspects;
        }
      });

      this.arrAux.push(auxCases);
      this.arrAux.push(auxDeaths);
      this.arrAux.push(auxSuspects);
      this.setChart();
    });
  }

  setChart() {
    const data: any = {};
    data.confirmados = this.arrAux[0];
    data.mortos = this.arrAux[1];
    data.suspeitos = this.arrAux[2];

    this.chartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Nordeste',
        style: {
          fontFamily: 'Roboto, Verdana, sans-serif'
        }
      },
      xAxis: {
        categories: ['2020'],
        crosshair: true,
        labels: {
          style: {
            fontSize: '12px',
            fontFamily: 'Roboto, Verdana, sans-serif'
          }
        }
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true
      },
      legend: {
        reversed: true
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px"></span><table style="width: 130px">',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0; text-align: right;"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
        style: {
          fontFamily: 'Roboto, Verdana, sans-serif'
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        name: 'Confirmados',
        data: [data.confirmados],
        dataLabels: {
          style: {
            fontSize: '16px',
            fontFamily: 'Roboto, Verdana, sans-serif'
          }
        }

      },
      {
        name: 'Suspeitos',
        data: [data.suspeitos],
        dataLabels: {
          style: {
            fontSize: '16px',
            fontFamily: 'Roboto, Verdana, sans-serif'
          }
        }
      }, {
        name: 'Mortos',
        data: [data.mortos],
        dataLabels: {
          style: {
            fontSize: '16px',
            fontFamily: 'Roboto, Verdana, sans-serif'
          }
        }

      }],
      dataLabels: {
        style: {
          fontSize: '16px',
          fontFamily: 'Roboto, Verdana, sans-serif'
        }
      }


      , responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal'
            },
            yAxis: {
              labels: {
                align: 'left',
                x: 0,
                y: -5
              },
              title: {
                text: null
              }
            },
            subtitle: {
              text: null
            },
            credits: {
              enabled: false
            }
          }
        }]
      }
    };
  }

}
