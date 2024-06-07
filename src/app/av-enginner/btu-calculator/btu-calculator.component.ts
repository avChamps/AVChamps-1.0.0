// app-btu-calculator.component.ts

import {
  Component,
  Input,
  OnInit,
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
  showSpinner: boolean = true
  startDate: any
  endDate: any
  dialogRef: any
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

  constructor (
    private faService: FaServiceService,
    private popup: PopupService
  ) {
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
    this.calculateTotalWatt()
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
      }
      this.showSpinner = false;
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
    this.totalPowerCol = 0
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
        text: 'Add Post',
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

  downloadReport (option: any) {
    var fileName: any
    var header: any
    if (option === 'btu') {
      fileName = 'btu-Calculator.pdf'
      header = 'Thermal Dissipation Details'
    } else if (option === 'powerCal') {
      fileName = 'Power-Calculator.pdf'
      header = ' AV rack UPS power requirement'
    }
    const element = document.getElementById('pdfContent')

    if (element) {
      const options = {
        ignoreElements: (element: { id: string }) => element.id === 'icons'
      }

      html2canvas(element, options).then(canvas => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF()
        const imgWidth = 200
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const xPosition = (pageWidth - imgWidth) / 2
        let yPosition = 10

        const headerText = header
        const fontSize = 15
        const fontWeight = 'normal'
        const headerTextWidth =
          (pdf.getStringUnitWidth(headerText) * fontSize) /
          pdf.internal.scaleFactor
        const headerXPosition = (pageWidth - headerTextWidth) / 2
        const headerYPosition = yPosition + 2

        pdf.setFont('helvetica', fontWeight)
        pdf.text(headerText, headerXPosition, headerYPosition)
        pdf.setTextColor(0)
        pdf.setFont('helvetica', 'normal')

        yPosition += 15

        const borderOffset = 4

        pdf.setDrawColor(0, 0, 0)
        pdf.setLineWidth(0.5)
        pdf.rect(
          borderOffset,
          borderOffset,
          pageWidth - 2 * borderOffset,
          pageHeight - 2 * borderOffset,
          'S'
        )

        pdf.addImage(imgData, 'PNG', xPosition, yPosition, imgWidth, imgHeight)
        pdf.save(fileName)
      })
    } else {
      console.error("Element with id 'pdfContent' not found.")
    }
  }
}
