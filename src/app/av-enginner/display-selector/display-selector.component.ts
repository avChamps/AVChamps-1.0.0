import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-display-selector',
  templateUrl: './display-selector.component.html',
  styleUrls: ['./display-selector.component.css']
})
export class DisplaySelectorComponent implements OnInit {
  totalScore: number = 0;
  chart: any;
  displaySelector : boolean = false;
  showChart : boolean = false;
  @Input() toolType: any;

  sections = [
    {
      title: 'Panel',
      data: [
        { name: 'Screen Size', type: 'input', maxlength: 3 },
        { name: 'Panel Technology', type: 'static', value: 'IPS' },
        { name: 'Backlight Type', type: 'dropdown', options: ['DLED', 'Backlight'] },
        { name: 'Brightness', type: 'dropdown', options: ['300 cd/m²', '400 cd/m²', '450 cd/m²', '500 cd/m²'] },
        { name: 'Native Resolution', type: 'static', value: '4K' },
        { name: 'Aspect Ratio', type: 'static', value: '16:9' },
        { name: 'Panel Life Time (Min.)', type: 'static', value: '50000 Hrs' },
        { name: 'Response Time (typical)', type: 'static', value: '8 ms' },
        { name: 'Viewing Angle', type: 'static', value: '178:178' },
        { name: 'Haze Level - Option', type: 'input', maxlength: 2 },
        { name: 'Refresh Rate', type: 'dropdown', options: ['50 Hz', '60 Hz'] },
        { name: 'Orientation', type: 'dropdown', options: ['Landscape', 'Portrait', 'Both'] },
        { name: 'Operation Hours', type: 'dropdown', options: ['16/7', '18/7', '24/7'] },
        { name: 'Area of Usage', type: 'dropdown', options: ['Indoor', 'Outdoor'] }
      ]
    },
    {
      title: 'Built-in System',
      data: [
        { name: 'Operating System', type: 'dropdown', options: ['Custom OS', 'Linux', 'Android'] },
        { name: 'Memory', type: 'dropdown', options: ['MB', 'KB', 'GB'] },
        { name: 'Ethernet', type: 'static', value: '10/100 Mbps' },
        { name: 'WiFi', type: 'static', value: 'WiFi 5' },
        { name: 'HTML5 Player', type: 'dropdown', options: ['Yes', 'No'] }
      ]
    },
    {
      title: 'Jack Interface',
      data: [
        { name: 'HDMI', type: 'input', maxlength: 1 },
        { name: 'DVI', type: 'input', maxlength: 1 },
        { name: 'USB', type: 'input', maxlength: 1 },
        { name: 'LAN Port', type: 'dropdown', options: ['Yes', 'No'] },
        { name: 'Audio Output', type: 'static', value: '3.5mm Mini Jack' },
        { name: 'External Control', type: 'dropdown', options: ['RS232', 'Fast Ethernet'] },
        { name: 'Sensor', type: 'dropdown', options: ['Internal', 'External'] }
      ]
    },
    {
      title: 'Audio',
      data: [
        { name: 'Audio Output', type: 'static', value: '10W + 10W' },
        { name: 'Speaker System', type: 'static', value: '2.0 ch' },
        { name: 'Sound Pressure Level', type: 'input', maxlength: 2 },
        { name: 'Sound Modes', type: 'static', value: '6 modes' }
      ]
    },
    {
      title: '3rd Party Control',
      data: [
        { name: '3rd Party Control', type: 'dropdown', options: ['Crestron & QSC Certified', 'AMX'] }
      ]
    },
    {
      title: 'Certification',
      data: [
        { name: 'Safety', type: 'static', value: 'Yes' },
        { name: 'EMC', type: 'static', value: 'Yes' },
        { name: 'CE', type: 'static', value: 'Yes' },
        { name: 'BIS', type: 'static', value: 'Yes' }
      ]
    },
    {
      title: 'CMS - Dashboard',
      data: [
        { name: 'Remote Control', type: 'static', value: '100%' }
      ]
    },
    {
      title: 'Warranty',
      data: [
        { name: 'Warranty', type: 'dropdown', options: ['1yr', '2yr', '3yr', '4yr', '5yr'] }
      ]
    },
    {
      title: 'Accessory',
      data: [
        { name: 'Standard', type: 'static', value: 'Standard Kit' }
      ]
    }
  ];

  constructor(private cdr: ChangeDetectorRef) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
      this.handleMessageChange()
  }

  handleMessageChange () {
    if(this.toolType === 'displaySelector') {
      this.displaySelector = true;
    }
  }

  calculateTotal() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let score = 0;
    checkboxes.forEach((checkbox: any) => {
      if (checkbox.checked) {
        score++;
      }
    });
    this.totalScore = score;
    this.showChart = true;
    this.cdr.detectChanges();

    this.createOrUpdateChart();
  }

  createOrUpdateChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.data.datasets[0].data = [this.totalScore, this.getTotalCheckboxes() - this.totalScore];
      this.chart.update();
    } else if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Checked', 'Unchecked'],
          datasets: [{
            data: [this.totalScore, this.getTotalCheckboxes() - this.totalScore],
            backgroundColor: ['green', 'red']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  getTotalCheckboxes(): number {
    return document.querySelectorAll('input[type="checkbox"]').length;
  }
}