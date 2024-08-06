import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { DownloadreportService } from 'src/app/services/downloadreport.service';

interface SavedRoom {
  roomType: string;
  quantity: number;
  price: number;
  total: number;
}

@Component({
  selector: 'app-budget-calculator',
  templateUrl: './budget-calculator.component.html',
  styleUrls: ['./budget-calculator.component.css']
})
export class BudgetCalculatorComponent implements OnInit {
  @Input() toolType: any;
  totalBudget: any;
  isBudgetCal: boolean = false;
  showRemoveIcon: boolean = true;
  showSpinner: boolean = false;
  showBudgetTable: boolean = false;
  roomType: string = 'Huddle Room';
  roomQuantity: number = 0;
  costPerRoom: number = 0;

  constructor(private renderer: Renderer2, public downloadReport: DownloadreportService) { }


  savedRooms: SavedRoom[] = [];

  roomTypes = [
    { type: 'Select Room' },
    { type: 'Huddle Room' },
    { type: 'Small Conference Room' },
    { type: 'Medium Conference Room' },
    { type: 'Large Conference Room' },
    { type: 'Boardroom' },
    { type: 'Specialty Spaces' },
    { type: 'Auditorium' },
    { type: 'Digital Signage' },
    { type: 'Music Server' },
    { type: 'Licenses' }
  ];

  budgetCalculator = [
    { roomType: '', quantity: '', cost: 0, total: 0 },
    { roomType: '', quantity: '', cost: 0, total: 0 }
  ];


  selectedRoomType = this.roomTypes[0].type;

  ngOnInit(): void {
    this.handleMessageChange();
  }

  handleMessageChange() {
    if (this.toolType === 'budgetCal') {
      this.isBudgetCal = true;
    }
  }

  removeRow() {
    if (this.budgetCalculator.length > 0) {
      this.savedRooms.pop();
      this.showRemoveIcon = this.budgetCalculator.length > 1;
      this.calculateTotalBudget();
    } else {
      this.showBudgetTable = false;
    }
  }

  getRowClass(index: number): string {
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }

  get totalCost(): number {
    return this.roomQuantity * this.costPerRoom;
  }

  saveRoomDetails() {
    const total = this.roomQuantity * this.costPerRoom;
    const roomDetail = {
      roomType: this.selectedRoomType,
      quantity: this.roomQuantity,
      price: this.costPerRoom,
      total: total
    };
    this.savedRooms.push(roomDetail);
    this.showBudgetTable = true;
    this.calculateTotalBudget();
  }

  calculateTotalBudget() {
    this.totalBudget = this.savedRooms.reduce((sum, room) => sum + room.total, 0);
  }


  refreshValues() {
    this.budgetCalculator = [
      { roomType: '', quantity: '', cost: 0, total: 0 },
      { roomType: '', quantity: '', cost: 0, total: 0 }
    ];
  }

  downloadCard(filename: any) {
    this.showSpinner = true;
    const icons = document.querySelector('.add_symbol') as HTMLElement;
    const contentContainer = document.querySelector('.results') as HTMLElement; // Use the correct selector

    if (icons) {
      this.renderer.setStyle(icons, 'display', 'none');
    }
    if (contentContainer) {
      this.renderer.setStyle(contentContainer, 'margin-top', '20px');
    }

    this.downloadReport.downloadCard(filename, () => {
      this.showSpinner = false;
      if (icons) {
        this.renderer.removeStyle(icons, 'display');
      }
    });
  }
}
