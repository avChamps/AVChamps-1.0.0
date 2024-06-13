import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'
import { ToWords } from 'to-words'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { DownloadreportService } from 'src/app/services/downloadreport.service'
@Component({
  selector: 'app-av-simulator',
  templateUrl: './av-simulator.component.html',
  styleUrls: ['./av-simulator.component.css']
})
export class AvSimulatorComponent implements OnInit {
  overallTotal = 0
  overallCGST = 0
  overallSGST = 0
  Total = 0
  selectedImage: any;
  grandTotalWords: any;
  seletedFile: any;
  isQuetation: boolean = false;
  isServiceReport : boolean = false;
  imgData: string | null = null
  fileSelected: boolean = false;
  showSpinner : boolean = false;
  toWordsInstance = new ToWords();
  @Input() toolType: any;
  @ViewChild('fileInput') fileInput!: ElementRef
  items = [
    {
      // item: '',
      discription: '',
      make: '',
      hsn : '',
      quantity: 0,
      unitCost: 0,
      total: 0,
      cgst: 0,
      sgst: 0,
      cgstAmount: 0,
      sgstAmount: 0
    }
  ]

constructor(public downloadReport: DownloadreportService) { }

  ngOnInit(): void {
    this.handleMessageChange()
  }

  handleMessageChange () {
    if(this.toolType === 'quatation') {
      this.isQuetation = true;
      } else if (this.toolType === 'serviceReport') {
        this.isServiceReport = true;
   } 
  }

  calculateAmount (company: any) {
    company.total = company.quantity * company.unitCost
    this.calculateGST(company)
    this.updateOverallTotal()
    this.updateTotal()
  }

  calculateGST (company: any) {
    company.cgstAmount = (company.cgst / 100) * company.total
    company.sgstAmount = (company.sgst / 100) * company.total
    this.updateOverallGST()
    this.updateTotal()
  }

  updateOverallTotal () {
    this.overallTotal = this.items.reduce(
      (total, company) => total + (company.total || 0),0)
  }

  updateOverallGST () {
    this.overallCGST = this.items.reduce(
      (total, company) => total + (company.cgstAmount || 0),0)
    this.overallSGST = this.items.reduce(
      (total, company) => total + (company.sgstAmount || 0),0)
  }

  updateTotal () {
    this.Total = this.items.reduce(
      (total, company) =>
        total + (company.total + company.cgstAmount + company.sgstAmount || 0),0)
    this.grandTotalWords = this.toWordsInstance.convert(this.Total)
  }

  addRow () {
    this.items.push({
      // item: '',
      discription: '',
      make: '',
      hsn : '',
      quantity: 0,
      unitCost: 0,
      sgst: 0,
      cgst: 0,
      total: 0,
      cgstAmount: 0,
      sgstAmount: 0 
    })
  }

  removeRow () {
    if (this.items.length > 1) {
      this.items.pop()
    }
    this.updateTotal();
    this.updateOverallTotal();
    this.updateOverallGST();
  }

  onFileSelected (event: any): void {
    const file: File = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        this.imgData = e.target?.result as string
        this.fileSelected = true
      }
      reader.readAsDataURL(file)
    }
  }

  openFileInput (): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click()
    }
  }

  adjustTextareaHeight(event: any) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  
  downloadCard(filename: any) {
    this.showSpinner = true;
    this.downloadReport.downloadCard(filename, () => {
      this.showSpinner = false;
    });
  }
  
}