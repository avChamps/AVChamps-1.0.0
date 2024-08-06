import { ChangeDetectorRef, Component, Input, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { CalendarOptions, EventApi, EventClickArg } from '@fullcalendar/core';
import { Chart, registerables } from 'chart.js';
import { DownloadreportService } from 'src/app/services/downloadreport.service';
import { FaServiceService } from 'src/app/services/fa-service.service';
import { PopupService } from 'src/app/services/popup.service';
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-display-selector',
  templateUrl: './display-selector.component.html',
  styleUrls: ['./display-selector.component.css']
})
export class DisplaySelectorComponent implements OnInit {
  totalScore: number = 0;
  chart: any;
  startDate: any;
  endDate: any
  displaySelector: boolean = false;
  calendarVisible = true // Default to true
  showChart: boolean = false;
  isCalender: boolean = false;
  filteredEvents: any[] = [];
  selectedEventTypes: string[] = [];
  currentEvents: EventApi[] = []
  events: any[] = []
  showSpinner: boolean = true;
  selectedEventType: any;
  @Input() toolType: any;
  @ViewChild('myDialog') myDialog!: TemplateRef<any>
  @ViewChild('eventType') eventType!: TemplateRef<any>
  @ViewChild(MatMenuTrigger) eventTypeMenuTrigger!: MatMenuTrigger;

  eventTypes = [
    { displayName: 'Webinar', value: 'webinar' },
    { displayName: 'Trade Show', value: 'trade_show' },
    { displayName: 'Classroom', value: 'classroom' },
    { displayName: 'Product Launch', value: 'product_launch' },
    { displayName: 'Online', value: 'online' }
    // { displayName : 'All', value: 'all'}
  ];

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

  constructor(private cdr: ChangeDetectorRef, private faService: FaServiceService, public downloadReport: DownloadreportService, private popup: PopupService, private renderer: Renderer2) {
    Chart.register(...registerables);
    this.handleCreateEventClick = this.handleCreateEventClick.bind(this)
  }


  ngOnInit(): void {
    this.handleMessageChange();
    this.getEvents();
  }

  handleMessageChange() {
    if (this.toolType === 'displaySelector') {
      this.displaySelector = true;
    }
    else if (this.toolType === 'calender') {
      this.isCalender = true;
    }
  }

  submitForm(
    eventName: string,
    eventUrl: string,
    startDate: Date,
    endDate: Date,
    selectedEventType: string
  ) {
    const data = {
      eventName: eventName,
      eventUrl: eventUrl,
      startDate: startDate,
      endDate: endDate,
      eventType: selectedEventType
    }
    this.faService.postEvent(data).subscribe(response => {
      console.log(response)
    })
  }

  // Calendar
  getEvents() {
    this.showSpinner = true;
    this.faService.getEvents().subscribe((response: any) => {
      console.log('Response from server:', response);
      const newEvents = response.records.map((record: any) => ({
        title: record.event_name,
        start: record.event_date,
        url: record.website_Url,
        type: record.eventType
      }));
      console.log('Parsed events:', newEvents); // Log parsed events
      this.events = newEvents;
      this.filteredEvents = newEvents;
      this.updateCalendarEvents();
      this.showSpinner = false;
    });
  }

  updateCalendarEvents() {
    this.calendarOptions.events = this.filteredEvents;
    this.cdr.detectChanges();
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleEventDidMount(info: any) {
    const eventType = info.event.extendedProps.type;

    const eventColors: { [key: string]: string } = {
      'webinar': '#F19ED2',
      'trade_show': '#FF7F3E',
      'classroom': '#7D8ABC',
      'product_launch': '#379777',
      'online': '#50B498'
    };

    const backgroundColor = eventColors[eventType] || 'gray';
    info.el.style.backgroundColor = backgroundColor;
    info.el.style.border = 'none'; // Ensure border is set to none or another desired style
    info.el.style.color = 'white'; // Adjust text color if needed
    console.log('Mounted event:', info.event.title, 'with type:', eventType, 'and color:', backgroundColor);

    // Adding icons to the custom buttons
    const createEventButton = document.querySelector('.fc-createEventButton-button');
    if (createEventButton && !createEventButton.querySelector('mat-icon')) {
      const icon = document.createElement('mat-icon');
      icon.className = 'material-icons';
      icon.textContent = 'event';
      createEventButton.appendChild(icon);
    }

    const eventTypeButton = document.querySelector('.fc-EventType-button');
    if (eventTypeButton && !eventTypeButton.querySelector('mat-icon')) {
      const icon = document.createElement('mat-icon');
      icon.className = 'material-icons';
      icon.textContent = 'tune';
      eventTypeButton.appendChild(icon);
    }

  }

  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today createEventButton EventType',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    views: {
      dayGridMonth: {
        buttonText: 'month'
      },
      timeGridWeek: {
        buttonText: 'week'
      },
      timeGridDay: {
        buttonText: 'day'
      },
      listWeek: {
        buttonText: 'list'
      }
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: this.filteredEvents,
    eventClick: this.handleEventClick.bind(this),
    customButtons: {
      createEventButton: {
        text: '',
        click: () => this.handleCreateEventClick()
      },
      EventType: {
        text: '',
        click: () => this.toggleEventTypeDropdown()
      }
    },
    // eventDidMount: (info) => {
    //   const createEventButton = document.querySelector('.fc-createEventButton-button');
    //   if (createEventButton && !createEventButton.querySelector('mat-icon')) {
    //     const icon = document.createElement('mat-icon');
    //     icon.className = 'material-icons';
    //     icon.textContent = 'event';
    //     createEventButton.appendChild(icon);
    //   }

    //   const eventTypeButton = document.querySelector('.fc-EventType-button');
    //   if (eventTypeButton && !eventTypeButton.querySelector('mat-icon')) {
    //     const icon = document.createElement('mat-icon');
    //     icon.className = 'material-icons';
    //     icon.textContent = 'tune';
    //     eventTypeButton.appendChild(icon);
    //   }
    // }
    eventDidMount: this.handleEventDidMount.bind(this)
  };

  handleCreateEventClick = () => {
    this.popup.openDialogWithTemplateRef(this.myDialog);
  }

  toggleEventTypeDropdown() {
    this.popup.openDialogWithTemplateRef(this.eventType);
    // this.eventTypeMenuTrigger.openMenu();
  }

  handleEventClick(info: EventClickArg): void {
    if (info.event.url) {
      window.open(info.event.url, '_blank');
      info.jsEvent.preventDefault();
      return;
    }
  }

  onEventTypeChange(event: any) {
    this.selectedEventTypes = [];
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedEventTypes.push(value);
    } else {
      this.selectedEventTypes = this.selectedEventTypes.filter(type => type !== value);
    }
  }

  applyEventTypeFilter() {
    if (this.selectedEventTypes.length === 0) {
      this.filteredEvents = this.events;
    } else {
      this.filteredEvents = this.events.filter(event => this.selectedEventTypes.includes(event.type));
    }
    this.updateCalendarEvents();
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