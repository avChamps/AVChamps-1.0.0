import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FaServiceService } from 'src/app/services/fa-service.service'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  footertxt: any;
  constructor(private router: Router, private faService: FaServiceService) { }


  ngOnInit(): void {
    this.faService.getFooterTxt().subscribe(
      (response) => {
        if (response.status && response.records) {
          const quotes = response.records.quotes;
          this.footertxt = this.getRandomQuote(quotes);
        } else {
          console.error('Failed to fetch footer text:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching footer text:', error);
      }
    );
  }

  getRandomQuote(quotes: string[]): string {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  onClick(value: any) {
    this.router.navigate(['/guideLines', value])
  }

  socialLinks(type: any) {
    if (type === 'twitter') {
      window.open('https://twitter.com/rgbaudiovideo', '_blank')
    } else if (type === 'faceBook') {
      window.open('https://www.facebook.com/profile.php?id=61558649983492', '_blank')
    } else if (type === 'instagram') {
      window.open('https://www.instagram.com/av.champs/', '_blank')
    } else if (type === 'linkedin') {
      window.open('https://www.linkedin.com/in/avchamps/', '_blank')
    } else {
      window.open(' https://www.youtube.com/@AVChamps', '_blank')
    }
  }
}
