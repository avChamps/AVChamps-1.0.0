// app-btu-calculator.component.ts

import {
  Component,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  signal
} from '@angular/core'
import { FullCalendarComponent } from '@fullcalendar/angular'
import {
  CalendarOptions,
  DateSelectArg,
  EventApi,
  EventClickArg,
  EventInput
} from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { an, dA } from '@fullcalendar/core/internal-common'
import { FaServiceService } from 'src/app/services/fa-service.service'
import { PopupService } from 'src/app/services/popup.service'
import { Tooltip } from 'chart.js'
import { DownloadreportService } from 'src/app/services/downloadreport.service'
@Component({
  selector: 'app-btu-calculator',
  templateUrl: './btu-calculator.component.html',
  styleUrls: ['./btu-calculator.component.css']
})
export class BtuCalculatorComponent implements OnInit {
  showRemoveIcon: boolean = false
  isBtu: boolean = false
  ispowerCal: boolean = false
  isDialogOpen: boolean = false
  isCalender: boolean = false;
  isTradeshow : boolean = false;
  showSpinner: boolean = true;
  isAvrack : boolean = false;
  startDate: any;
  endDate: any
  dialogRef: any
  totalRackHeight :any;
  rackNumbers : any;
  qrdata: any
  total: number = 0
  totalPowerCol: number = 0
  thermalTotal: number = 0
  totalkWh: number = 0
  requiredCooling: any
  @Input() toolType: any
  calendarVisible = true // Default to true
  currentEvents: EventApi[] = []
  events: any[] = []
  @ViewChild('myDialog') myDialog!: TemplateRef<any>
  tradeshowBoxes: { title: string, urlLink: string, bgColor: string }[] = [];

  constructor (private faService: FaServiceService,public downloadReport: DownloadreportService, private popup: PopupService,private renderer: Renderer2) {
     this.handleCreateEventClick = this.handleCreateEventClick.bind(this)
  }

  btuRows = [
    { company: '', equipment: '', watt: 0 },
    { company: '', equipment: '', watt: 0 }
  ]

   powerCalRows = [
    { equipment: '', current: 0, voltage: 0, watt: 0 },
    { equipment: '', current: 0, voltage: 0, watt: 0 },
    { equipment: '', current: 0, voltage: 0, watt: 0 }
  ]

  ngOnInit (): void {
    this.handleMessageChange()
    this.calculateTotalWatt();
    this.updateRackConfiguration();
  }

  handleMessageChange () {
    if(this.toolType === 'calender') {
      this.isCalender = true;
      this.getEvents(); 
      } else if (this.toolType === 'tradeShow') {
        this.isTradeshow = true;
      this.getTradeShow();
      } else if(this.toolType === 'btu') {
        this.isBtu = true;
      } else if(this.toolType === 'ispowerCal') {
        this.ispowerCal = true;
      } else if(this.toolType === 'avRack') {
        this.isAvrack = true;
   }
      this.showSpinner = false;
  }

  updateRackConfiguration() {
    let totalUnits = 0;
    this.btuRows.forEach(row => {
      totalUnits += (row.watt >= 1 ? row.watt : 0.5);
    });
    this.totalRackHeight = Math.ceil(totalUnits) * 35;
    this.rackNumbers = Array.from({ length: Math.ceil(totalUnits) }, (_, i) => i + 1);
  }
  
  getRackItemBottom(index: number) {
    let totalRU = 0;
    for (let i = 0; i < index; i++) {
      totalRU += (this.btuRows[i].watt >= 1 ? this.btuRows[i].watt : 0.5);
    }
    return Math.floor(totalRU);
  }
  
  getHalfRackLeftPosition(index: number) {
    let count = 0;
    for (let i = 0; i < index; i++) {
      if (this.btuRows[i].watt < 1) {
        count++;
      }
    }
    return (count % 2) === 0 ? '0' : '50%';
  }
   
  getRowClass (index: number): string {
    return index % 2 === 0 ? 'even-row' : 'odd-row'
  }

  addRow (type: any) {
    if (type === 'isBtu') {
      this.btuRows.push({ company: '', equipment: '', watt: 0 })
      this.calculateTotalWatt()
    } else if (type === 'isPowercal') {
      this.powerCalRows.push({ equipment: '', current: 0, voltage: 0, watt: 0 })
    }
    this.showRemoveIcon = true
  }

  removeRow () {
    if (this.btuRows.length > 1 || this.powerCalRows.length > 1) {
      this.btuRows.pop()
      this.powerCalRows.pop()
      this.calculateTotalWatt()
    } else {
      this.showRemoveIcon = false
    }
  }

  refreshValues () {
    this.btuRows.forEach(row => {
      row.company = ''
      row.equipment = ''
      row.watt = 0
    })
    this.powerCalRows.forEach(row => {
      row.equipment = ''
      row.watt = 0
      row.voltage = 0
      row.current = 0
    })

    this.btuRows = [
      { company: '', equipment: '', watt: 0 },
      { company: '', equipment: '', watt: 0 }
    ]

    this.powerCalRows = [
      { equipment: '', current: 0, voltage: 0, watt: 0 },
      { equipment: '', current: 0, voltage: 0, watt: 0 },
      { equipment: '', current: 0, voltage: 0, watt: 0 }
    ]
    this.thermalTotal = 0
    this.total = 0
    this.requiredCooling = 0
    this.totalkWh = 0
    this.totalPowerCol = 0;
    this.updateRackConfiguration();
  }

  calculateTotalWatt () {
    this.totalPowerCol = this.powerCalRows.reduce((sum, row) => {
      row.watt = row.current * row.voltage
      return sum + Number(row.watt)
    }, 0)

    this.total = this.btuRows.reduce((sum, row) => sum + Number(row.watt), 0)
    this.totalPowerCol = this.powerCalRows.reduce(
      (sum, row) => sum + Number(row.watt),
      0
    )
    this.totalkWh = this.totalPowerCol / 1000
    this.thermalTotal = this.total * 3.4
    this.requiredCooling = this.thermalTotal / 12000
  }

  //Calender
  getEvents () {
    this.showSpinner = true
    this.faService.getEvents().subscribe((response: any) => {
      console.log('Response from server:', response)
      const newEvents = response.records.map((record: any) => ({
        title: record.event_name,
        start: record.event_date,
        url: record.website_Url
      }))
      this.events = newEvents
      this.updateCalendarEvents()
      this.showSpinner = false
    })
  }

  updateCalendarEvents () {
    this.calendarOptions.events = this.events
  }

  handleCalendarToggle () {
    this.calendarVisible = !this.calendarVisible
  }

  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next createEventButton',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    views: {
      dayGridMonth: {
        buttonText: 'Month'
      },
      timeGridWeek: {
        buttonText: 'Week'
      },
      timeGridDay: {
        buttonText: 'Day'
      },
      listWeek: {
        buttonText: 'List'
      }
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [],
    eventClick: this.handleEventClick.bind(this),
    customButtons: {
      createEventButton: {
        text: 'Post Event',
        click: () => this.handleCreateEventClick()
      }
    }
  }
  

  handleCreateEventClick = () => {
    this.popup.openDialogWithTemplateRef(this.myDialog)
  }

  handleEventClick(info: EventClickArg): void {
    if (info.event.url) {
      window.open(info.event.url, '_blank');
      info.jsEvent.preventDefault();
      return;
    }
  }

  submitForm (
    eventName: string,
    eventUrl: string,
    startDate: Date,
    endDate: Date
  ) {
    const data = {
      eventName: eventName,
      eventUrl: eventUrl,
      startDate: startDate,
      endDate: endDate
    }
    this.faService.postEvent(data).subscribe(response => {
      console.log(response)
    })
  }

//TradeShow 
getTradeShow() {
  this.showSpinner = true;
  this.faService.getTradeShow().subscribe((response: any) => {
      console.log('Response from server:', response);
      
      if (response.status && response.records) {
          this.tradeshowBoxes = response.records.map((record: any) => ({
              title: record.title,
              urlLink: record.website_Url,
              bgColor: ''
          }));
          this.shuffleTradeshowBoxes()
          this.assignRandomColors();
      } else {
          console.error('Failed to fetch trade show details:', response.message);
      }
      this.showSpinner = false;
  });
}

shuffleTradeshowBoxes(): void {
for (let i = this.tradeshowBoxes.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [this.tradeshowBoxes[i], this.tradeshowBoxes[j]] = [this.tradeshowBoxes[j], this.tradeshowBoxes[i]];
}
}

assignRandomColors(): void {
this.tradeshowBoxes.forEach(box => {
  box.bgColor = this.getRandomColor();
  console.log(`${box.title}: ${box.bgColor}`); // Debug line
});
}

getRandomColor(): string {
const letters = '0123456789ABCDEF';
let color = '#';
for (let i = 0; i < 6; i++) {
  color += letters[Math.floor(Math.random() * 16)];
}
return color;
}

downloadCard(filename: any) {
  this.showSpinner = true;
  const tableElement = document.querySelector('.styled-table') as HTMLElement;
  const header = document.querySelector('.header') as HTMLElement;
  const icons = document.querySelector('.icons') as HTMLElement;

  if (tableElement) {
    this.renderer.setStyle(tableElement, 'box-shadow', 'none');
    this.renderer.setStyle(tableElement, 'text-align', 'center');
  }

  if (header) {
    this.renderer.setStyle(header, 'text-align', 'center');
  }

  if (icons) {
    this.renderer.setStyle(icons, 'display', 'none');
  }

  this.downloadReport.downloadCard(filename, () => {
    this.showSpinner = false;
    if (tableElement) {
      this.renderer.removeStyle(tableElement, 'box-shadow');
      this.renderer.removeStyle(tableElement, 'text-align');
    }

    if (header) {
      this.renderer.removeStyle(header, 'text-align');
    }

    if (icons) {
      this.renderer.removeStyle(icons, 'display');
    }
  });
}
}
