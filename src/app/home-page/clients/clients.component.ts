import { Component } from '@angular/core';
import { an } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  shuffledItems: any;
  contactMail: string = 'hello@avchamps.com';

  images = [
    'assets/img/clients/zoapi_img.png',
    'assets/img/clients/root_tech.png',
    'assets/img/clients/At_img.png',
    'assets/img/clients/babbler_img.png'
  ];

  ngOnInit() {
    this.shuffledItems = this.images.slice();
    this.shuffleArray(this.shuffledItems);
    console.log("Shuffled Array:", this.shuffledItems);
  }

  shuffleArray(array: any[]) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  sendContact() {
    window.location.href = `mailto:${this.contactMail}`;
  }

}
