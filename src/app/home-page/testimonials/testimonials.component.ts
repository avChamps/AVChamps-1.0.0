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
      name: 'Uday P',
      role: 'AV Engineer',
      description: 'The VC BAR SIMULATOR is one of the best tools I’ve encountered and used on the AV Champs website. It helps me visualize camera coverage, microphone coverage, and loudspeaker distribution. This tool has been instrumental in selecting the right All-In-One VC bar for our conference room.',
      imageUrl: '/assets/img/testimonials/pday.jpg'
    },
    {   
      name: 'Vishnu Vardhan',
      role: 'AV Engineer',
      description: 'Whether it’s discussing the latest AV innovations or troubleshooting technical challenges, the AV CHAMPS provides a supportive platform for professionals to learn, grow, and succeed in the dynamic world of audiovisual technology. "THANK YOU AV CHAMPS" !',
      imageUrl: '/assets/img/testimonials/vishnu.jpeg'
    },
    {   
      name: 'Bharath Dhane',
      role: 'AV Engineer',
      description: 'The EVENTS Calendar on the AV CHAMPS website is one of the best features I have encountered. It allows me to track trade shows, events, webinars, and training sessions for all products in one place, saving me time and effort.',
      imageUrl: '/assets/img/testimonials/dbharath.jpeg'
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
