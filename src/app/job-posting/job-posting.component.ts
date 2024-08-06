import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';
import { AuthServiceService } from '../services/auth-service.service';
import { FaServiceService } from '../services/fa-service.service';
import { PopupService } from '../services/popup.service';
import { UserServicesService } from '../services/user-services.service';

@Component({
  selector: 'app-job-posting',
  templateUrl: './job-posting.component.html',
  styleUrls: ['./job-posting.component.css']
})
export class JobPostingComponent {
  emailId: any;
  userName: any;
  showSearchBox: boolean = true;
  showContactForm: boolean = false
  showViewMOre: boolean = true;
  searchText: any;
  showSpinner: boolean = false;
  profileImg: any[] = []
  @ViewChild('myDialog') myDialog!: TemplateRef<any>

  constructor(
    private popup: PopupService,
    private userService: UserServicesService,
    private router: Router,
    private faService: FaServiceService,
    private authService: AuthServiceService,
    private authGuard: AuthGuardService
  ) { }
  ngOnInit(): void {
    this.emailId = localStorage.getItem('emailId')
    this.userName = localStorage.getItem('userName')
    // this.getCartData(this.offset)
    this.getProfileImage()
  }

  jobs = [
    { title: 'Web Designer', company: 'Bootdey.com LLC.', location: 'USA', type: 'Full time',salary:938435543, emailID: 'abc@gmail.com', phoneNo: 9943444343, companyUrl: 'https://www.geeksforgeeks.org/json-to-excel-converter/' },
    { title: 'Front-end Developer', company: 'Bootdey.com LLC.', location: 'USA', type: 'Remote' },
    { title: 'Web Developer', company: 'Bootdey.com LLC.', location: 'USA', type: 'Contract' },
    { title: 'Back-end Developer', company: 'Bootdey.com LLC.', location: 'USA', type: 'WFH',emailID: 'abc@gmail.com', phoneNo: 9943444343},
    { title: 'UX / UI Designer', company: 'Bootdey.com LLC.', location: 'USA', type: 'Full time',emailID: 'abc@gmail.com', phoneNo: 9943444343 },
    { title: 'Tester', company: 'Bootdey.com LLC.', location: 'USA', type: 'Remote',emailID: 'abc@gmail.com', phoneNo: 9943444343 },
  ];



  onSearch() {

  }

  getProfileImage() {
    this.showSpinner = true
    this.userService
      .getProfileImage(this.emailId)
      .subscribe((response: any) => {
        console.log(response)
        this.showSpinner = false
        this.profileImg = response.records
      })
  }


  getImageSource(): string {
    if (this.profileImg && this.profileImg.length > 0) {
      return this.profileImg[0].imagePath
    } else {
      return '../assets/img/blank-user-directory.png'
    }
  }
  
  postJob() {
  this.popup.openDialogWithTemplateRef(this.myDialog);
  }

  onSelect(option: any): void {
    if (option === 'contact') {
      this.showSearchBox = false;
      this.showContactForm = true;
    } else {
      this.logOut()
    }
  }
  onBack() {
    window.location.reload();
  }

  logOut() {
    this.faService.clearSession();
    this.router.navigate(['/home-page']);
    window.location.reload();
  }
}
