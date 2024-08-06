import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  shuffledItems : any;

constructor(private router : Router) { }

  onLogin () {
      this.router.navigate(['/login-page', 'avEngineer-dashboard'])
  }

  carouselItems = [
    {
      title: 'AV KART',
      title_content: 'Your Ultimate AV Marketplace.',
      description: 'Dive into our vibrant AV(Audio Visual) marketplace, where enthusiasts gather to buy and sell high-quality, pre-owned AV(Audio Visual) products. By choosing pre-owned items, you secure great value and contribute to a more sustainable future.',
      link: '#'
    },
    {
      title: 'AV COMMUNITY',
      title_content : 'Empowering Every Voice',
      description: 'In today’s fast-paced, technology-driven world, the AV(Audio-Visual) community stands at the forefront of innovation, creativity, and connection. This vibrant community unites professionals, enthusiasts, and learners with a common passion for AV(Audio-Visual)technology.',
      link: '#'
    },
    {
      title: 'AV TOOLS',
      title_content: 'Simplify, Analyze, Decide with Data-Driven Tools',
      description : 'Enhance your productivity in the AV(Audio Visual) industry with our cutting-edge AV Tools. Streamlining complex calculations and simulations, our solutions empower professionals to design and optimize setups with unparalleled precision and ease.',
      link: '#'
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
