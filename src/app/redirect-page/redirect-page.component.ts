import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FaServiceService } from '../services/fa-service.service'

@Component({
  selector: 'app-redirect-page',
  templateUrl: './redirect-page.component.html',
  styleUrls: ['./redirect-page.component.css']
})
export class RedirectPageComponent implements OnInit {
  receivedValue: any

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private faService: FaServiceService,
    private http: HttpClient
  ) {}

  ngOnInit (): void {
    this.route.params.subscribe(params => {
      this.receivedValue = params['value']
    })
    this.setSession();
  }

  setSession () {
    this.faService.getSession().subscribe(response => {
      const token = response.session[0].jwtToken
      const userName = response.session[0].firstName;
      const emailId = response.session[0].emailId;
      this.faService.setSession(token,userName,emailId);
      this.redirectedPath()
    })
  }

  redirectedPath () {
    if (this.receivedValue === 'avEngineer-dashboard') {
      this.router.navigate(['/avEngineer-dashboard'])
    } else if (this.receivedValue === 'ekart-page') {
      this.router.navigate(['/ekart-page'])
    } else if (this.receivedValue === 'av-community') {
      this.router.navigate(['/av-community'])
    }
  }
}
