import { Component } from '@angular/core'
import { Tooltip } from 'chart.js';

@Component({
  selector: 'app-av-calculator',
  templateUrl: './av-calculator.component.html',
  styleUrls: ['./av-calculator.component.css']
})
export class AvCalculatorComponent {
  searchTool : any;
  isSimulator: boolean = false;
  isBtu: boolean = false;
  isBtuCalculator: boolean = false;
  isBussinessCard: boolean = false;
  isReports  : boolean = false;
  ispowerCal : boolean = false;
  isSpl : boolean = false;
  isMacFinder : boolean = false
  cards: boolean = true;
  isCalender : boolean = false;
  isTradeshow : boolean = false;
  isAspectratio : boolean = false;
  isdiagonalScreen : boolean = false;
  isthrowDistance : boolean = false;
  isServiceReport : boolean = false;
  isAvrack : boolean = false;
  showSpinner : boolean = false;
  displaySelector : boolean = false;
  videoSimulator : boolean = false;
  toolType: string = '';

  // tools = [
  //   { id: 'isCard', imgSrc: 'assets/img/av-profile/id-card.png', name: 'Business Card', description: 'Design a personalized E-Business card and connect with your network in a flash.' },
  //   { id: 'btu', imgSrc: 'assets/img/av-profile/british-thermal-unit.png', name: 'BTU Calculator', description: 'Calculate how much heat is produced by all electronic equipment within an AV rack.' },
  //   { id: 'ispowerCal', imgSrc: 'assets/img/av-profile/power-claculator.png', name: 'Power Calculator', description: 'Calculate the total power required for all AV equipment within an AV rack.' },
  //   { id: 'macFinder', imgSrc: 'assets/img/av-profile/mac_finder.png', name: 'Mac Finder', description: 'Find the vendor/manufacturer of a device by its MAC Address with Mac vendor tool.' },
  //   { id: 'isSpl', imgSrc: 'assets/img/av-profile/spl-calculator.png', name: 'SPL Calculator', description: 'This tool lets you calculate the sound pressure level (SPL) at the listening position.' },
  //   { id: 'quatation', imgSrc: 'assets/img/av-profile/quotation.png', name: 'Quotation', description: 'Save precious time and effort by utilizing quotation tool and automate math.' },
  //   { id: 'calender', imgSrc: 'assets/img/av-profile/event-calender.png', name: 'Events', description: 'Stay informed about trade shows, training webinars, and new product launches.' },
  //   { id: 'aspectRatio', imgSrc: 'assets/img/av-profile/aspect-ratio.png', name: 'Aspect Ratio', description: 'Calculate the aspect ratio and know shape of a screen\'s display/image area.' },
  //   { id: 'diagonalScreen', imgSrc: 'assets/img/av-profile/ratio.png', name: 'Screen Size', description: 'Calculate the dimensions and screen area of a TV, monitor, or projector.' },
  //   { id: 'throwDistance', imgSrc: 'assets/img/av-profile/projector.png', name: 'Throw Distance', description: 'Calculate projector\'s distance from the lens to the screen surface.' },
  //   { id: 'serviceReport', imgSrc: 'assets/img/av-profile/service-report.jpg', name: 'Service Report', description: 'Share the service report with the customer to showcase the tech teams capabilities.' },
  //   { id: 'avRack', imgSrc: 'assets/img/av-profile/av-rack.jpg', name: 'Rack Layout', description: 'Simply add the product, and your rack layouts will be ready within seconds.' },
  //   // { id: 'displaySelector', imgSrc: 'assets/img/av-profile/display-selection.jpg', name: 'Display Selection', description: 'Calculate projector\'s distance from the lens to the screen surface.' },
  //   { id: 'videoSimulator', imgSrc: 'assets/img/av-profile/display-selection.jpg', name: 'Video bar simulator', description: 'Calculate projector\'s distance from the lens to the screen surface.' }
  // ];


  basicTools = [
    { id: 'isCard', imgSrc: 'assets/img/av-profile/id-card.png', name: 'Business Card', description: 'Design a personalized E-Business card and connect with your network in a flash.' },
  //  { id: 'quatation', imgSrc: 'assets/img/av-profile/quotation.png', name: 'Quotation', description: 'Save precious time and effort by utilizing quotation tool and automate math.' },
    // { id: 'serviceReport', imgSrc: 'assets/img/av-profile/service-report.jpg', name: 'Service Report', description: 'Share the service report with the customer to showcase the tech teams capabilities.' }
  ];



 audioTools = [
   { id: 'btu', imgSrc: 'assets/img/av-profile/british-thermal-unit.png', name: 'BTU Calculator', description: 'Calculate how much heat is produced by all electronic equipment within an AV rack.' },
    { id: 'ispowerCal', imgSrc: 'assets/img/av-profile/power-claculator.png', name: 'Power Calculator', description: 'Calculate the total power required for all AV equipment within an AV rack.' },
  //   { id: 'macFinder', imgSrc: 'assets/img/av-profile/mac_finder.png', name: 'Mac Finder', description: 'Find the vendor/manufacturer of a device by its MAC Address with Mac vendor tool.' },
    { id: 'isSpl', imgSrc: 'assets/img/av-profile/spl-calculator.png', name: 'SPL Calculator', description: 'This tool lets you calculate the sound pressure level (SPL) at the listening position.' },
  ];


  videoTools = [
    { id: 'aspectRatio', imgSrc: 'assets/img/av-profile/aspect-ratio.png', name: 'Aspect Ratio', description: 'Calculate the aspect ratio and know shape of a screen\'s display/image area.' },
    { id: 'diagonalScreen', imgSrc: 'assets/img/av-profile/ratio.png', name: 'Screen Size', description: 'Calculate the dimensions and screen area of a TV, monitor, or projector.' },
    { id: 'throwDistance', imgSrc: 'assets/img/av-profile/projector.png', name: 'Throw Distance', description: 'Calculate projector\'s distance from the lens to the screen surface.' },
  ]


  advancedTools = [
    { id: 'avRack', imgSrc: 'assets/img/av-profile/av-rack.jpg', name: 'Rack Layout', description: 'Simply add the product, and your rack layouts will be ready within seconds.' },
    { id: 'macFinder', imgSrc: 'assets/img/av-profile/mac_finder.png', name: 'Mac Finder', description: 'Find the vendor/manufacturer of a device by its MAC Address with Mac vendor tool.' },
    // { id: 'displaySelector', imgSrc: 'assets/img/av-profile/display-selection.jpg', name: 'Display Selection', description: 'Calculate projector\'s distance from the lens to the screen surface.' },
  ]

ucTools = [
  { id: 'videoSimulator', imgSrc: 'assets/img/av-profile/Video-Img.png', name: 'VC BAR Simulator', description: 'Visualize the video, microphone, and speaker coverage of an All-In-One VC Bar.' }
]

eventTools = [
  { id: 'calender', imgSrc: 'assets/img/av-profile/event-calender.png', name: 'Events', description: 'Stay informed about trade shows, training webinars, and new product launches.' },
]

toolCategories = [
  { name: 'Basic Tools', tools: this.basicTools },
  { name: 'Audio Tools', tools: this.audioTools },
  { name: 'Video Tools', tools: this.videoTools },
  { name: 'Advanced Tools', tools: this.advancedTools },
  { name: 'UC Tools', tools: this.ucTools },
  { name: 'Events', tools: this.eventTools }
];


filteredTools(tools: any[]) {
  if (!this.searchTool) {
    return tools;
  }
  return tools.filter(tool => tool.name.toLowerCase().includes(this.searchTool.toLowerCase()));
}

allToolsFilteredOut(): boolean {
  return this.toolCategories.every(category => this.filteredTools(category.tools).length === 0);
}
  

  onClick (type: any) {
    // this.showSpinner = true;
    this.toolType = type;
    setTimeout(() => {
      this.isSimulator = this.toolType === 'quatation'
      this.isBtuCalculator = this.toolType === 'btu'
      this.isBussinessCard = this.toolType === 'isCard'
      this.cards = this.toolType === 'cards';
      this.isReports = this.toolType === 'reports';
      this.ispowerCal = this.toolType === 'ispowerCal';
      this.isSpl = this.toolType === 'isSpl';
      this.isMacFinder = this.toolType === 'macFinder';
      this.isCalender = this.toolType === 'calender';
      this.isTradeshow = this.toolType === 'tradeShow';
      this.isAspectratio = this.toolType === 'aspectRatio';
      this.isdiagonalScreen = this.toolType === 'diagonalScreen';
      this.isthrowDistance = this.toolType === 'throwDistance';
      this.isServiceReport = this.toolType === 'serviceReport';
      this.isAvrack = this.toolType === 'avRack';
      this.displaySelector = this.toolType === 'displaySelector';
      this.videoSimulator = this.toolType === 'videoSimulator';
      this.showSpinner = false;
    }, 0);
  }
}
