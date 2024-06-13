import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class DownloadreportService { 
  constructor() { }

  downloadCard(filename: string, callback: () => void) {
    const element = document.getElementById('pdfContent');
    const file = filename;
    if (element) {
      const originalBoxShadow = element.style.boxShadow;
      element.style.boxShadow = 'none';
      const options = {
        ignoreElements: (el: any) => el.classList.contains('exclude'),
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
        let yPosition = 10; 

        const imageYOffset = 0; 
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
        pdf.save(file);
        callback(); 
      }).catch((error) => {
        element.style.boxShadow = originalBoxShadow;
        console.error("Error generating PDF:", error);
        callback();
      });
    } else {
      console.error("Element with id 'pdfContent' not found.");
      callback();
    }
  } 

}
