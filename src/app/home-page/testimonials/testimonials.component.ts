import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent {
  shuffledItems : any;

  carouselItems = [
    {
      name: 'Harish N',
      role: 'AV Engineer',
      description: 'The AV CHAMPS Group is a dynamic community consisting of seasoned professionals and experts from the AV industry. Within this group, members leverage their collective knowledge and diverse experiences. " HAPPY TO BE A PART OF THIS NETWORK" !',
      imageUrl: '/assets/img/testimonials/harish.jpeg'
    },
    {   
      name: 'Vishnu Vardhan',
      role: 'AV Engineer',
      description: 'Whether it’s discussing the latest AV innovations or troubleshooting technical challenges, the AV CHAMPS provides a supportive platform for professionals to learn, grow, and succeed in the dynamic world of audiovisual technology. "THANK YOU AV CHAMPS" !',
      imageUrl: '/assets/img/testimonials/vishnu.jpeg'
    },
  ];

  ngOnInit() {
    this.shuffledItems = this.carouselItems.slice();
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

}
