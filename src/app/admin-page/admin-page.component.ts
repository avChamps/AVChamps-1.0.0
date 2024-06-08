import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { FaServiceService } from '../services/fa-service.service'
import Chart from 'chart.js/auto'
import { UserServicesService } from '../services/user-services.service'
import { PopupService } from '../services/popup.service'
import { A, an } from '@fullcalendar/core/internal-common'

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  sender = 'AV Champs'
  title: any;
  description: any
  eventName: any
  eventUrl: any
  link: any
  chart: any
  totalCount: any
  startDate!: any;
  eventEndDate : any;
  dltFeedDate!: any
  selectedRating: any = 'All'
  endDate!: Date | null
  showSpinner: boolean = false
  showAdminpanel: boolean = false;
  selectedOptions: any
  @ViewChild('myDialog') myDialog!: TemplateRef<any>

  constructor (
    private faService: FaServiceService,
    private popup: PopupService
  ) {}
  ngOnInit (): void {
    this.showLogin()
  }

  showLogin () {
    setTimeout(() => {
      this.popup.openDialogWithTemplateRef(this.myDialog)
    }, 10)
  }

  submitForm (emailId: any,userName: any, password: any) {
    if (emailId === 'Avchamps1@gmail.com' && userName === 'AvChamps' && password === 'Bl@ckp0ny@24') {
      this.showAdminpanel = true;
    } else {
      alert('Your Not a Admin')
    }
  }

  onSubmit () {
    this.showSpinner = true
    const feedData = {
      sender: this.sender,
      title: this.title,
      dltFeedDate: this.dltFeedDate,
      description: this.description,
      link: this.link
    }
    this.faService.insertFeedData(feedData).subscribe((response: any) => {
      console.log('Form submitted:', response)
      if (response.status) {
        alert(response.message)
        this.showSpinner = false
        this.onClear()
      } else {
        alert(response.message)
        this.showSpinner = false
      }
    })
  }

  postEvent () {
    this.showSpinner = true
    const data = {
      event_name: this.eventName,
      event_date: this.startDate,
      website_Url: this.eventUrl,
      dltFeedDate: this.dltFeedDate,
      eventEndDate : this.eventEndDate
    }
    this.faService.insertEvent(data).subscribe((response: any) => {
      console.log('Form submitted:', response)
      if (response.status) {
        alert(response.message)
        this.showSpinner = false
        this.onClear()
      } else {
        alert(response.message)
        this.showSpinner = false
      }
    })
  }

  postTradeshow () {
    this.showSpinner = true
    const data = {
      title: this.eventName,
      website_Url: this.eventUrl
    }
    this.faService.insertTradeShow(data).subscribe((response: any) => {
      console.log('Form submitted:', response)
      if (response.status) {
        alert(response.message)
        this.showSpinner = false;
        this.onClear()
      } else {
        alert(response.message)
        this.showSpinner = false
      }
    })
  }


  onClear () {
    this.sender = ''
    this.title = ''
    this.description = ''
    this.eventName = ''
    this.eventUrl = ''    
    ;(this.link = ''), (this.startDate = null)
    ;(this.endDate = null), (this.dltFeedDate = '')
  }
}
