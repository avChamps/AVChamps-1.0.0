import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { PopupService } from '../services/popup.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-video-simulator',
  templateUrl: './video-simulator.component.html',
  styleUrls: ['./video-simulator.component.css']
})
export class VideoSimulatorComponent {
  roomLength: number = 0;
  roomWidth: number = 0;
  currentGraphIndex = 0;
  make: any;
  model: any;
  fov: any;
  spl: any;
  unit: string = 'feet';
  microphone: number = 0;
  splOption: number = 1;
  isRoomLength: any;
  isRoomWidth: any;
  boxWidth: any;
  boxHeight: any;
  roomLengthInMts: any;
  showBox: boolean = false;
  showMicrophoneCoverage: boolean = false;
  showCameraCoverage: boolean = false;
  showloudSpeaker: boolean = false;
  currentCoverage: any;
  @ViewChild('fovCanvas', { static: false }) fovCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fovCoverageCanvas', { static: false }) fovCoverageCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('splCanvas', { static: false }) splCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('microphoneCanvas', { static: true }) microphoneCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myDialog') myDialog!: TemplateRef<any>

  constructor(private cdr: ChangeDetectorRef, private popup: PopupService, private dialog: MatDialog) { }

  coverages = ['DISCLAIMER', 'Camera Coverage', 'Microphone Coverage', 'Loud Speaker Coverage', 'Cabling Diagram'];

  nextCoverage() {
    const currentIndex = this.coverages.indexOf(this.currentCoverage);
    const nextIndex = (currentIndex + 1) % this.coverages.length;
    this.currentCoverage = this.coverages[nextIndex];
    this.cdr.detectChanges(); // Trigger change detection
    setTimeout(() => this.drawCurrentCoverage(), 0); // Ensure the view is updated
  }

  previousCoverage() {
    const currentIndex = this.coverages.indexOf(this.currentCoverage);
    const prevIndex = (currentIndex - 1 + this.coverages.length) % this.coverages.length;
    this.currentCoverage = this.coverages[prevIndex];
    this.cdr.detectChanges(); // Trigger change detection
    setTimeout(() => this.drawCurrentCoverage(), 0); // Ensure the view is updated
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }




  drawCurrentCoverage() {
    this.generateUnits();
    switch (this.currentCoverage) {
      case 'DISCLAIMER':
        break;
      case 'Camera Coverage':
        this.drawCoverage();
        break;
      case 'Microphone Coverage':
        this.drawFOV();
        break;
      case 'Loud Speaker Coverage':
        this.drawSPL();
        break;
      case 'Cabling Diagram':
        break;
    }
  }

  createBox(coverage: any) {
    const dialogRef = this.dialog.open(this.myDialog);
    dialogRef.afterOpened().subscribe(() => {
      this.generateUnits();
      this.showBox = true;
      this.boxWidth = this.roomWidth;
      this.boxHeight = this.roomLength;
      this.cdr.detectChanges();
      if (coverage === 'cameraCoverage') {
        this.currentCoverage = 'Camera Coverage';
        this.showCameraCoverage = true;
        this.showMicrophoneCoverage = false;
        this.showloudSpeaker = false;
        setTimeout(() => { this.drawCoverage(); }, 0);
      } else if (coverage === 'microphoneCoverage') {
        this.currentCoverage = 'Microphone Coverage';
        this.showMicrophoneCoverage = true;
        this.showCameraCoverage = false;
        this.showloudSpeaker = false;
        setTimeout(() => { this.drawFOV(); }, 0);
      }
      else if (coverage === 'loudSpeakerCoverage') {
        this.currentCoverage = 'Loud Speaker Coverage';
        this.showMicrophoneCoverage = false;
        this.showCameraCoverage = false;
        this.showloudSpeaker = true;
        setTimeout(() => { this.drawSPL(); }, 0);
      }
    });
  }




  get canvasWidth(): number {
    if (this.boxHeight <= 15) {
      return this.boxHeight * 30;
    } else if (this.boxHeight <= 20) {
      return this.boxHeight * 25;
    } else {
      return this.boxHeight * 20;
    }
  }

  get canvasHeight(): number {
    if (this.boxWidth <= 15) {
      return this.boxWidth * 30;
    } else if (this.boxWidth <= 20) {
      return this.boxWidth * 25;
    } else {
      return this.boxWidth * 20;
    }
  }



  generateUnits() {
    this.roomLengthInMts = this.roomLength * 0.3048;
    this.isRoomLength = this.roomLength + 'f' + '/' + this.roomLengthInMts.toFixed(2) + 'm'
    let roomWidth = this.roomWidth * 0.3048;
    this.isRoomWidth = this.roomWidth + 'f' + '/' + roomWidth.toFixed(2) + 'm';
  }

  drawFOV() {
    if (this.fovCanvas) {
      const canvas = this.fovCanvas.nativeElement;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate the scaling factors
        const scaleX = canvas.width / this.roomLength; // Scaling factor for length
        const scaleY = canvas.height / this.roomWidth; // Scaling factor for width
        const coverageWidth = Math.min(this.microphone, this.roomLength); // Coverage based on length

        // Calculate the actual width to be covered
        const coveredWidthInPixels = coverageWidth * scaleX;

        // Create a gradient for the green color
        const gradient = ctx.createLinearGradient(0, 0, coveredWidthInPixels, 0);
        gradient.addColorStop(0, 'green');
        gradient.addColorStop(1, 'rgba(0, 255, 0, 0)'); // Fading to transparent

        // Draw the green rectangle for the covered area with gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, coveredWidthInPixels, canvas.height);

        // Draw the red rectangle for the uncovered area
        ctx.fillStyle = '#ff000061';
        ctx.fillRect(coveredWidthInPixels, 0, canvas.width - coveredWidthInPixels, canvas.height);

        // Load and draw the icon at the center of the green area
        const icon = new Image();
        // icon.src = './assets/img/av-profile/speaker-icon.png';

        icon.onload = () => {
          console.log('Icon loaded successfully');
          const desiredWidth = 25;
          const desiredHeight = 25;

          const iconX = coveredWidthInPixels / 2 - desiredWidth / 2;
          const iconY = canvas.height / 2 - desiredHeight / 2;
          console.log(`Drawing icon at: (${iconX}, ${iconY}) with size: (${desiredWidth}x${desiredHeight})`);
          ctx.drawImage(icon, iconX, iconY, desiredWidth, desiredHeight);
        };

        icon.onerror = (error) => {
          console.error('Error loading icon:', error);
        };

        // Draw a small rectangle at the center instead of a circle
        const centerX = 0;
        const centerY = canvas.height / 2;
        const rectWidth = 20; // Width of the rectangle
        const rectHeight = 70; // Height of the rectangle
        ctx.beginPath();
        ctx.rect(centerX - rectWidth / 2, centerY - rectHeight / 2, rectWidth, rectHeight);
        ctx.fillStyle = 'black';
        ctx.fill();
      }
    }
  }

  drawCoverage() {
    const canvas = document.getElementById('cameraCoverage') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = this.canvasWidth; // Scale factor to fit canvas size
      canvas.height = this.canvasHeight;

      const centerX = 0; // Align exactly at the left edge
      const centerY = canvas.height / 2; // Center vertically
      const radius = this.fov * 20; // Scale factor to fit canvas size
      const step = 10; // Distance between arcs

      // Convert degrees to radians
      const startAngle = (Math.PI / 180) * (this.fov / 2);
      const endAngle = (Math.PI / 180) * (-this.fov / 2);

      // Create a linear gradient decreasing from left to right
      const gradient = ctx.createLinearGradient(centerX, centerY, canvas.width, centerY);
      gradient.addColorStop(0, 'green'); // Solid green at the start
      gradient.addColorStop(0.5, '#90ee9059'); // Intermediate color stop for smoother transition
      gradient.addColorStop(1, '#90ee90'); // Solid light green at the end

      ctx.fillStyle = gradient;

      for (let r = radius; r > 0; r -= step) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, r, -startAngle, -endAngle, false);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#00b5ad';
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(-startAngle), centerY + radius * Math.sin(-startAngle));
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(-endAngle), centerY + radius * Math.sin(-endAngle));
      ctx.strokeStyle = 'black';
      ctx.stroke();

      // Draw the small indicator line
      const indicatorLength = 20; // Length of the indicator line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX - indicatorLength, centerY);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2; // Thickness of the indicator line
      ctx.stroke();

      // Draw a small rectangle at the center instead of a circle
      const rectWidth = 20; // Width of the rectangle
      const rectHeight = 70; // Height of the rectangle (increased)
      ctx.beginPath();
      ctx.rect(centerX - rectWidth / 2, centerY - rectHeight / 2, rectWidth, rectHeight);
      ctx.fillStyle = 'black';
      ctx.fill();

      ctx.font = '12px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(this.fov + ' FOV', centerX + 10, centerY - 10);
    }
  }


  drawSPL() {
    const canvas = this.splCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create a linear gradient from thick green to light green
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, 'green'); // Start with thick green
      gradient.addColorStop(1, 'lightgreen'); // End with light green

      // Fill the canvas with the gradient background
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const enteredSPL = this.roomLengthInMts; // Assuming enteredSPL is a property holding the SPL value entered by the user
      const maxMarkerValue = Math.log2(enteredSPL);
      const numMarkers = Math.floor(maxMarkerValue) + 1;
      const markerInterval = canvas.width / (numMarkers + 1);
      const splValues = this.getSPLValues(this.spl, numMarkers); // Generate SPL values dynamically

      // Function to generate dynamic marker labels
      const generateMarkerLabels = (start: number, count: number): string[] => {
        const labels = [];
        for (let i = 0; i < count; i++) {
          labels.push((start * Math.pow(2, i)).toString() + 'M');
        }
        return labels;
      };

      const markerLabels = generateMarkerLabels(1, numMarkers);

      // Define rainbow colors for markers
      const rainbowColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

      // Draw the midline
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.strokeStyle = 'black';
      ctx.stroke();

      // Draw the markers
      for (let i = 0; i < numMarkers; i++) {
        const x = markerInterval * (i + 1);
        console.log(`Drawing marker at position: ${x}`);

        // Choose the color for this marker
        const color = rainbowColors[i % rainbowColors.length];

        ctx.beginPath();
        ctx.moveTo(x, canvas.height / 2 - 10);
        ctx.lineTo(x, canvas.height / 2 + 10);
        ctx.strokeStyle = color; // Apply the rainbow color
        ctx.stroke();

        ctx.font = '12px Arial';
        ctx.fillStyle = color; // Apply the rainbow color
        ctx.fillText(markerLabels[i], x - 10, canvas.height / 2 - 20);
        ctx.fillText(splValues[i].toString(), x - 10, canvas.height / 2 + 30);
      }

      // Draw a small rectangle at the center instead of a circle
      const centerX = 0;
      const centerY = canvas.height / 2;
      const rectWidth = 20; // Width of the rectangle
      const rectHeight = 70; // Height of the rectangle
      ctx.beginPath();
      ctx.rect(centerX - rectWidth / 2, centerY - rectHeight / 2, rectWidth, rectHeight);
      ctx.fillStyle = 'black';
      ctx.fill();
    } else {
      console.error('Canvas context is null');
    }
  }


  getSPLValues(initialSPL: number, numMarkers: number): number[] {
    const splValues = [];
    const decrement = 6; // SPL decrement per distance marker

    if (this.splOption !== 1) {
      for (let i = 0; i < numMarkers; i++) {
        splValues.push(initialSPL - i * decrement - 6);
      }
    } else {
      for (let i = 0; i < numMarkers; i++) {
        splValues.push(initialSPL - i * decrement);
      }
    }
    return splValues;
  }


  validateInput(event: KeyboardEvent) {
    const pattern = /^[0-9]$/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar) || (event.target as HTMLInputElement).value.length >= 2) {
      event.preventDefault();
    }
  }

  restrictLength(field: 'roomLength' | 'roomWidth' | 'spl') {
    if (this[field] && this[field].toString().length > 2) {
      this[field] = Number(this[field].toString().slice(0, 2));
    }
  }

  validateRange(event: Event, option: any) {
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value, 10);
    if (option === 'roomLength') {
      if (value < 8 || value > 28) {
        alert('Room Length must be between 8 and 28');
        inputElement.value = this.roomLength ? this.roomLength.toString() : '';
        this.roomLength = 0;
      } else {
        this.roomLength = value;
      }
    }
    else {
      if (value < 8 || value > 18) {
        alert('Room Width must be between 8 and 18');
        inputElement.value = this.roomWidth ? this.roomWidth.toString() : '';
        this.roomWidth = 0;
      } else {
        this.roomWidth = value;
      }
    }
  }
}