import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-av-calculator',
  templateUrl: './av-calculator.component.html',
  styleUrls: ['./av-calculator.component.css']
})
export class AvCalculatorComponent {
  searchTool: any;
  isSimulator: boolean = false;
  isBtu: boolean = false;
  isBtuCalculator: boolean = false;
  isBussinessCard: boolean = false;
  isReports: boolean = false;
  ispowerCal: boolean = false;
  isSpl: boolean = false;
  isMacFinder: boolean = false
  cards: boolean = true;
  isCalender: boolean = false;
  isTradeshow: boolean = false;
  isAspectratio: boolean = false;
  isdiagonalScreen: boolean = false;
  isthrowDistance: boolean = false;
  isServiceReport: boolean = false;
  isAvrack: boolean = false;
  showSpinner: boolean = false;
  displaySelector: boolean = false;
  videoSimulator: boolean = false;
  switcher: boolean = false;
  bandWidthCal: boolean = false;
  isLoudSpeaker: boolean = false;
  budgetCal: boolean = false;
  audioDelay: boolean = false;
  toolType: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  basicTools = [
    { id: 'isCard', imgSrc: 'assets/img/av-profile/id-card.png', name: 'Business Card', description: 'Design a personalized E-Business card and connect with your network in a flash.' },
  ];

  audioTools = [
    { id: 'btu', imgSrc: 'assets/img/av-profile/british-thermal-unit.png', name: 'BTU Calculator', description: 'Calculate how much heat is produced by all electronic equipment within an AV rack.' },
    { id: 'ispowerCal', imgSrc: 'assets/img/av-profile/power-claculator.png', name: 'Power Calculator', description: 'Calculate the total power required for all AV equipment within an AV rack.' },
    { id: 'isSpl', imgSrc: 'assets/img/av-profile/spl-calculator.png', name: 'SPL Calculator', description: 'This tool lets you calculate the sound pressure level (SPL) at the listening position.' },
    { id: 'isLoudSpeaker', imgSrc: 'assets/img/av-profile/speaker_Img.png', name: 'Speaker Impedance Calculator', description: 'Calculate total impedence of a loud speaker.' },
    { id: 'audioDelay', imgSrc: 'assets/img/av-profile/audio_Img.png', name: 'Audio Delay Calculator', description: 'Calculator the delay needed between two sets of loudspeakers.' },
  ];

  videoTools = [
    { id: 'aspectRatio', imgSrc: 'assets/img/av-profile/aspect-ratio.png', name: 'Aspect Ratio', description: 'Calculate the aspect ratio and know shape of a screen\'s display/image area.' },
    { id: 'diagonalScreen', imgSrc: 'assets/img/av-profile/ratio.png', name: 'Screen Size', description: 'Calculate the dimensions and screen area of a TV, monitor, or projector.' },
    { id: 'throwDistance', imgSrc: 'assets/img/av-profile/projector.png', name: 'Throw Distance', description: 'Calculate projector\'s distance from the lens to the screen surface.' },
    { id: 'bandWidthCal', imgSrc: 'assets/img/av-profile/bandwidth_Img.png', name: 'Bandwidth Calculator', description: 'Easily identify the max bandwidth required to transfer the AV signals' }
  ]

  advancedTools = [
    { id: 'avRack', imgSrc: 'assets/img/av-profile/av-rack.jpg', name: 'Rack Layout', description: 'Simply add the product, and your rack layouts will be ready within seconds.' },
    { id: 'macFinder', imgSrc: 'assets/img/av-profile/mac_finder.png', name: 'Mac Finder', description: 'Find the vendor/manufacturer of a device by its MAC Address with Mac vendor tool.' },
    { id: 'hdBase', imgSrc: 'assets/img/av-profile/hdbase_Img.png', name: 'HDBaseT Certified Product List', description: 'Click here to find certified HDBaseT products.' },
    { id: 'budgetCal', imgSrc: 'assets/img/av-profile/budget_cal.png', name: 'Budget Calculator', description: 'Calculate total impedence of a loud speaker.' }
    
  ]

  ucTools = [
    { id: 'videoSimulator', imgSrc: 'assets/img/av-profile/Video-Img.png', name: 'VC BAR Simulator', description: 'Visualize the video, microphone, and speaker coverage of an All-In-One VC Bar. '}
  ]

  eventTools = [
    { id: 'calender', imgSrc: 'assets/img/av-profile/event-calender.png', name: 'Events', description: 'Stay informed about trade shows, training webinars, and new product launches.' },
  ]

  toolCategories = [
    { name: 'Basic Tools', tools: this.basicTools, expanded: false },
    { name: 'Audio Tools', tools: this.audioTools, expanded: false },
    { name: 'Video Tools', tools: this.videoTools, expanded: false },
    { name: 'Advanced Tools', tools: this.advancedTools, expanded: false },
    { name: 'UC Tools', tools: this.ucTools, expanded: false },
    { name: 'Events', tools: this.eventTools, expanded: false }
  ];

  filteredCategories() {
    if (!this.searchTool) {
      return this.toolCategories;
    }

    return this.toolCategories
      .map(category => ({
        ...category,
        tools: category.tools.filter(tool =>
          tool.name.toLowerCase().includes(this.searchTool.toLowerCase())
        )
      }))
      .filter(category => category.tools.length > 0);
  }

  allToolsFilteredOut(): boolean {
    return this.toolCategories.length === 0;
  }

  toggleCategory(index: number) {
    this.toolCategories[index].expanded = !this.toolCategories[index].expanded;
    this.cdr.detectChanges(); // Explicitly mark for change detection
  }

  onClick(type: any) {
    this.toolType = type;
    if (this.toolType === 'hdBase') {
      window.open('https://products.hdbaset.org/avcat/ctl18927/index.cfm', '_blank');
    } else {
      this.updateToolState(type);
    }
  }

  updateToolState(type: string) {
    this.isSimulator = type === 'quatation';
    this.isBtuCalculator = type === 'btu';
    this.isBussinessCard = type === 'isCard';
    this.cards = type === 'cards';
    this.isReports = type === 'reports';
    this.ispowerCal = type === 'ispowerCal';
    this.isSpl = type === 'isSpl';
    this.isMacFinder = type === 'macFinder';
    this.isCalender = type === 'calender';
    this.isTradeshow = type === 'tradeShow';
    this.isAspectratio = type === 'aspectRatio';
    this.isdiagonalScreen = type === 'diagonalScreen';
    this.isthrowDistance = type === 'throwDistance';
    this.isServiceReport = type === 'serviceReport';
    this.isAvrack = type === 'avRack';
    this.displaySelector = type === 'displaySelector';
    this.videoSimulator = type === 'videoSimulator';
    this.bandWidthCal = type === 'bandWidthCal';
    this.switcher = type === 'switcher';
    this.isLoudSpeaker = type === 'isLoudSpeaker';
    this.budgetCal = type === 'budgetCal';
    this.audioDelay = type === 'audioDelay';
    this.cdr.detectChanges();  // Explicitly mark for change detection
  }
}
