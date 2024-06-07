import { Component, ElementRef, ViewChild } from '@angular/core'
import { ToWords } from 'to-words'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
@Component({
  selector: 'app-av-simulator',
  templateUrl: './av-simulator.component.html',
  styleUrls: ['./av-simulator.component.css']
})
export class AvSimulatorComponent {
  selectedImage: any
  isQuetation: boolean = true;
  grandTotalWords: any;
  toWordsInstance = new ToWords()
  @ViewChild('fileInput') fileInput!: ElementRef
  // Add an array to store your invoice items
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

  overallTotal = 0 // Overall total for the Amount
  overallCGST = 0 // Overall total for CGST
  overallSGST = 0 // Overall total for SGST
  Total = 0
  calculateAmount (company: any) {
    // Assuming quantity and unitCost are numbers
    company.total = company.quantity * company.unitCost
    this.calculateGST(company)
    this.updateOverallTotal()
    this.updateTotal()
  }

  calculateGST (company: any) {
    // Assuming cgst and sgst are numbers
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
    // Add a new item to the invoiceItems array
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
      cgstAmount: 0, // Add cgstAmount property
      sgstAmount: 0 // Add sgstAmount property
    })
  }

  removeRow () {
    // Remove the last item from the invoiceItems array
    if (this.items.length > 1) {
      this.items.pop()
    }
    this.updateTotal();
    this.updateOverallTotal();
    this.updateOverallGST();

  }

  imgData: string | null = null
  seletedFile: any
  fileSelected: boolean = false

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
    // Trigger the file input when the image is clicked
    if (this.fileInput) {
      this.fileInput.nativeElement.click()
    }
  }

  adjustTextareaHeight(event: any) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  
   downloadCard() {
    const element = document.getElementById('pdfContent');
    if (element) {
      const originalBoxShadow = element.style.boxShadow;
      element.style.boxShadow = 'none';
  
      const options = {
        ignoreElements: (el:any) => el.classList.contains('exclude'),
      };
  
      html2canvas(element, options).then((canvas) => {
        element.style.boxShadow = originalBoxShadow;
  
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 200;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const xPosition = (pageWidth - imgWidth) / 2;
        let yPosition = 10; // Initial position
  
        // Adjust this value to move the image higher or lower
        const imageYOffset = 0; // Move the image 5 units higher
        yPosition += imageYOffset;
  
        const fontWeight = 'normal';
  
        pdf.setFont('helvetica', fontWeight);
        pdf.setTextColor(0);
        pdf.setFont('helvetica', 'normal');
  
        const borderOffset = 4;
  
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.rect(
          borderOffset,
          borderOffset,
          pageWidth - 2 * borderOffset,
          pageHeight - 2 * borderOffset,
          'S'
        );
        pdf.addImage(imgData, 'PNG', xPosition, yPosition, imgWidth, imgHeight);
        pdf.save('Quotation.pdf');
      });
    } else {
      console.error("Element with id 'pdfContent' not found.");
    }
  }
  
}