import { Component,ElementRef, OnInit,TemplateRef,ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { FaServiceService } from 'src/app/services/fa-service.service'
import { PopupService } from 'src/app/services/popup.service'
import { UserServicesService } from 'src/app/services/user-services.service'

@Component({
  selector: 'app-av-header',
  templateUrl: './av-header.component.html',
  styleUrls: ['./av-header.component.css']
})
export class AvHeaderComponent implements OnInit {
  dialogRef: any
  activeMenuItem: any
  CickedsocialMedia: any
  userName: any
  emailId: any
  showChatbot: boolean = false
  showChatbotIcon: boolean = true
  isDialogOpen: boolean = false
  isCommunity: boolean = false
  isDirectory: boolean = false
  isKnowledge: boolean = false
  panelOpenState = false
  isKnowledgeBaseExpanded: boolean = false
  showSpinner: boolean = false
  isSimultor: boolean = false
  isAbout: boolean = false;
  isProfile: boolean = false
  isFeed: boolean = false
  products: any[] = []
  profileWeight!: number
  inputValue!: string
  twitterUrl!: string
  facebookUrl!: string
  instagramUrl!: string
  insertionType!: string
  linkedInUrl!: string
  profileImageType!: string
  socialMediaUrls: { [key: string]: string } = {}
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>
  @ViewChild('myDialog') myDialog!: TemplateRef<any>

  constructor (
    private router: Router,
    private popup: PopupService,
    private userService: UserServicesService,
    private faService: FaServiceService
  ) {

  }

  ngOnInit (): void {
    this.userName = localStorage.getItem('userName')
    this.emailId = localStorage.getItem('emailId')
    // this.userName = 'Disendra';
    // this.emailId = 'disendra889@gmail.com';
    this.showSpinner = true
    this.onClick('feed');
    this.getProfile()
    this.userService
      .getProfileWeight(this.emailId)
      .subscribe((response: any) => {
        this.profileWeight = response.profileWeight
        console.log(response)
        this.showSpinner = false
      })
  }

  onClick (type: any) {
    if (type === 'community') {
      window.open('/av-community', '_blank');
      type = 'feed';
    }
    else if( type === 'ekart') {
     window.open('/ekart-page', '_blank');
     type = 'feed';
    }
    this.activeMenuItem = type
    this.isSimultor = type === 'simulator'
    this.isAbout = type === 'about'
    this.isProfile = type === 'profile'
    this.isKnowledge = type === 'knowledge'
    this.isDirectory = type === 'directory'
    this.isFeed = type === 'feed'
  }

  getProfile () {
    this.showSpinner = true
    this.userService
      .getSocialMediaProfile(this.emailId)
      .subscribe((response: any) => {
        this.showSpinner = false
        this.userService.refreshData()
        console.log(response)
        if (response.records.length !== 0) {
          const record = response.records[0]
          this.insertionType = 'updateProfile'
          this.linkedInUrl = record.linkedIn
          this.instagramUrl = record.instagram
          this.facebookUrl = record.faceBook
          this.twitterUrl = record.twitter
        } else {
          this.insertionType = 'saveProfile'
        }
      })
    this.userService
      .getProfileImage(this.emailId)
      .subscribe((response: any) => {
        this.showSpinner = false
        this.products = response.records
        console.log(response)
      })
  }

  getImageSource (): string {
    if (this.products && this.products.length > 0) {
      this.profileImageType = 'updateImage'
      return this.products[0].imagePath
    } else {
      this.profileImageType = 'insertImage'
      return 'assets/img/empty_Image.png'
    }
  }

  openFileInput () {
    this.fileInput.nativeElement.click()
  }

  onFileSelected (event: any) {
    this.showSpinner = true
    const file = event.target.files[0]
    const profileData = new FormData()
    if (this.emailId) profileData.append('emailId', this.emailId)
    if (file) profileData.append('image', file)
    if (this.profileImageType === 'insertImage') {
      this.userService
        .uploadProfileImage(profileData)
        .subscribe((response: any) => {
          this.userService.refreshData()
          console.log(response)
          this.showSpinner = false
          window.location.reload()
        })
    } else {
      this.userService
        .updateProfileImage(profileData)
        .subscribe((response: any) => {
          console.log(response)
          this.userService.refreshData()
          this.showSpinner = false
          window.location.reload()
        })
    }
    // this.getProfile()
  }

  shareOnSocialMedia (media: string) {
    if (!this.isDialogOpen) {
      this.CickedsocialMedia = media
      this.popup.openDialogWithTemplateRef(this.myDialog)
      if (this.CickedsocialMedia === 'twitter') {
        this.inputValue = this.twitterUrl
      } else if (this.CickedsocialMedia === 'facebook') {
        this.inputValue = this.facebookUrl
      } else if (this.CickedsocialMedia === 'instagram') {
        this.inputValue = this.instagramUrl
      } else if (this.CickedsocialMedia === 'linkedin') {
        this.inputValue = this.linkedInUrl
      }
    }
  }

  saveSocialMediaUrl () {
    let urlRegex: RegExp
    switch (this.CickedsocialMedia) {
      case 'twitter':
        urlRegex =
        /^(https?:\/\/)?(www\.)?x\.com\/[a-zA-Z0-9_]{1,15}(\/\w+)*\/?$/
        break
      case 'facebook':
        urlRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/(?:[^/]+|pages\/\w+)$/
        break
      case 'instagram':
        urlRegex =
        /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.\-]+(\/\w+)*\/?$/
        break
      case 'linkedin':
        urlRegex =
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_.]+(\/\w+)*\/?$/
        break
      default:
        alert('Invalid social media platform')
        return
    }

    if (!this.inputValue || !urlRegex.test(this.inputValue)) {
      alert('Invalid URL')
      return
    }

    this.socialMediaUrls[this.CickedsocialMedia] = this.inputValue
    switch (this.CickedsocialMedia) {
      case 'twitter':
        this.twitterUrl = this.inputValue
        break
      case 'facebook':
        this.facebookUrl = this.inputValue
        break
      case 'instagram':
        this.instagramUrl = this.inputValue
        break
      case 'linkedin':
        this.linkedInUrl = this.inputValue
        break
    }

    this.onSubmit()
  }

  onSubmit () {
    // this.showSpinner = true
    const profileData = new FormData()
    if (this.emailId) profileData.append('emailId', this.emailId)
    if (this.twitterUrl) profileData.append('twitter', this.twitterUrl)
    if (this.facebookUrl) profileData.append('faceBook', this.facebookUrl)
    if (this.linkedInUrl) profileData.append('linkedIn', this.linkedInUrl)
    if (this.instagramUrl) profileData.append('instagram', this.instagramUrl)
    console.log(profileData)
    if (this.insertionType === 'saveProfile') {
      this.userService.uploadSocialMedia(profileData).subscribe(
        (response: any) => {
          // this.showSpinner = false
          console.log(response.message)
          this.userService.refreshData()
          window.location.reload()
        },
        (error: any) => {
          // this.showSpinner = false
          console.error('Error occurred while saving profile:', error)
        }
      )
    } else {
      this.userService.updateSocialMedia(profileData).subscribe(
        (response: any) => {
          // this.showSpinner = false
          console.log(response.message)
          this.userService.refreshData()
          window.location.reload()
        },
        (error: any) => {
          // this.showSpinner = false
          console.error('Error occurred while updating profile:', error)
        }
      )
    }
    this.getProfile()
  }

  closePopup() {
   this.popup.closeDialog();
  }

  logOut () {
    this.closePopup();
    this.faService.clearSession()
    this.router.navigate(['/home-page'])
  }

  toggleKnowledgeBase () {
    this.isKnowledgeBaseExpanded = !this.isKnowledgeBaseExpanded
  }

  stopKnowledge () {
    this.isKnowledgeBaseExpanded = false
  }

  // ChatBot
  toggleChatbot () {
    this.showChatbot = true
  }

  onClose () {
    alert()
    this.showChatbotIcon = true
    this.showChatbot = false
  }

  onClear () {}

  showBot () {
    this.showChatbot = true
    this.showChatbotIcon = false
  }
}
