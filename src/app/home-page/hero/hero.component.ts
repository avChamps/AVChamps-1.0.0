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
      description: 'Dive into our vibrant AV marketplace, where enthusiasts come together to buy and sell high-quality, pre-loved audiovisual products. Explore a world of innovation and passion as you connect with like-minded individuals, all while unlocking incredible deals and opportunities to upgrade your AV setup.',
      link: '#'
    },
    {
      title: 'COMMUNITY',
      title_content : 'Collaborate, Contribute & Celebrate',
      description: 'Ascend your collaborative efforts with premier AV specialists. Share insights, stay updated on pioneering technologies, upcoming exhibitions, and training prospects. Amplify your collaboration with top-tier experts, enhancing your endeavors to unprecedented heights.',
      link: '#'
    },
    {
      title: 'TOOLS',
      title_content: 'Simplify, Analyze, Decide with Data-Driven Tools',
      description : 'Enhance your productivity in the audiovisual industry with our cutting-edge AV Tools. Streamlining complex calculations and simulations, our solutions empower professionals to design and optimize setups with unparalleled precision and ease.',
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
