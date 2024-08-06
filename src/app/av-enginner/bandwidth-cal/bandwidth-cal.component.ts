import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bandwidth-cal',
  templateUrl: './bandwidth-cal.component.html',
  styleUrls: ['./bandwidth-cal.component.css']
})
export class BandwidthCalComponent {
  resolution: string = '';
  selectedResolution: string = '';
  horizontalPixels: number = 0;
  verticalPixels: number = 0;
  frameRate: number = 0;
  bitDepth: number = 0;
  channels: number = 3;
  resultPerChannel : number = 0;
  chromaFactor: number = 1;
  overhead: boolean = true;
  isOverheadEnabled: boolean = true;
  bandWidthCal : boolean = false;
  isSwitcher : boolean = false;
  showResult: boolean = false;
  overheadValue: number = 1.25;
  overhValue: number = 1.25;
  finalResult: any;
  frameRates: number[] = [24, 25, 30, 50, 60, 120];
  bitDepths: number[] = [8, 10, 12, 16];
  @Input() toolType: any

   resolutions = [
    { label: '1280 x 720 (HD)', value: '1280x720' },
    { label: '1920 x 1080 (FHD)', value: '1920x1080' },
    { label: '2560 x 1440 (HD)', value: '2560x1440' },
    { label: '3840 x 2160 (4K)', value: '3840x2160' },
    { label: '8192 x 4320 (8K)', value: '8192x4320' }
  ];

  ngOnInit(): void {
    this.handleMessageChange()
  }

  handleMessageChange() {
    if (this.toolType === 'bandWidthCal') {
      this.bandWidthCal = true;
    } else if (this.toolType === 'switcher') {
      this.isSwitcher = true;
    }
  }
  
    toggleOverhead() {
      if (this.isOverheadEnabled) {
        this.overheadValue = 1.25;
        this.overhValue = 1.25;
      } else {
        this.overheadValue = 0;
        this.overhValue = 1;
      }
    }
  onChromaChange() {
    console.log(this.chromaFactor);
  }


  onResolutionChange() {
    const [horizontal, vertical] = this.selectedResolution.split('x').map(Number);
    this.horizontalPixels = horizontal;
    this.verticalPixels = vertical;
  }


  onCalculate() {
    this.showResult = true;
    this.finalResult = this.horizontalPixels * this.verticalPixels * this.frameRate * this.bitDepth * 3 * this.chromaFactor * this.overhValue / 1000000000;
    this.resultPerChannel = this.finalResult/3;
  }

  selectedBox: string | null = null;

  selectBox(letter: string) {
    this.selectedBox = letter;
  }

}
