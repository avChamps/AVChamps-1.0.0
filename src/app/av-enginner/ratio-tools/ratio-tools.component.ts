import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ratio-tools',
  templateUrl: './ratio-tools.component.html',
  styleUrls: ['./ratio-tools.component.css']
})
export class RatioToolsComponent implements OnInit {
  width: number = 0;
  height: number = 0;
  diagonalResult: number = 0;
  diagonalScreen: number = 0;
  aspectRatio: string = '0 : 0';
  dimensions: string = '0 * 0';
  mode: any;
  diagonalSize: number = 0;
  isaspectRatio : boolean = false;
  isdiagonalScreen : boolean = false;
  isthrowDistance : boolean= false;
  @Input() toolType: any;
  
  ngOnInit (): void {
    this.handleMessageChange()
  }

  calculateAspectRatio(): void {
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b);
    };

    const divisor = gcd(this.width, this.height);
    const aspectRatioWidth = this.width / divisor;
    const aspectRatioHeight = this.height / divisor;

    this.aspectRatio = `${aspectRatioWidth} : ${aspectRatioHeight}`;
    this.dimensions = `${this.width} × ${this.height}`;

    if (this.width > this.height) {
      this.mode = 'Landscape';
    } else if (this.width < this.height) {
      this.mode = 'Portrait';
    } else {
      this.mode = 'Square';
    }
  }

  calculateDiagonalSize() {
    if (this.width > 0 && this.height > 0) {
      this.diagonalSize = Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
    } else {
      this.diagonalSize = 0;
    }
  }

  calculatethrowDistance() {
    this.diagonalResult = this.width * this.height;
  }

  handleMessageChange () {
    if(this.toolType === 'aspectRatio') {
      this.isaspectRatio = true;
    }
    else if(this.toolType === 'diagonalScreen') {
      this.isdiagonalScreen = true;
    }
    else if(this.toolType === 'throwDistance') {
      this.isthrowDistance = true;
    }
  }

  onReset() {
    this.width = 0;
    this.height = 0;
    this.aspectRatio = '';
    this.aspectRatio = '0 : 0';
    this.dimensions = '0 * 0';
    this.mode = '';
    this.diagonalSize = 0;
    this.diagonalResult = 0;
  }
}