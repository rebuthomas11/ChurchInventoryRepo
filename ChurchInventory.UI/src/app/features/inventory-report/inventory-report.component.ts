import { Component,OnInit } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { IInventory } from 'src/app/core/models/inventory.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.css']
})
export class InventoryReportComponent {
reportForm!: FormGroup;

  reportData: IInventory[] = [];

  categories: string[] = [
    'All',
    'Furniture',
    'Audio',
    'Books',
    'Kitchen',
    'Communion',
    'Electrical',
    'Cleaning',
    'Stationery',
    'Altar Item',
    'Other'
  ];

  displayedColumns: string[] = [
    'itemName',
    'itemCategory',
    'quantity',
    'unit',
    'location',
    'purchaseDate'
  ];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private router:Router
  ) {}

  ngOnInit(): void {

    this.reportForm = this.fb.group({
      fromDate: [null],
      toDate: [null],
      category: ['All']
    });
  }

  generateReport(): void {

    const fromDate = this.formatDate(
      this.reportForm.get('fromDate')?.value
    );

    const toDate = this.formatDate(
      this.reportForm.get('toDate')?.value
    );

    const category =
      this.reportForm.get('category')?.value;

    this.inventoryService.getInventoryReport(fromDate, toDate, category)
      .subscribe({
        next: data => {
          this.reportData = data;
        },
        error: error => {
          console.error('Report generation failed:', error);
        }
      });
  }

  resetReport(): void {

    this.reportForm.reset({
      fromDate: null,
      toDate: null,
      category: 'All'
    });

    this.reportData = [];
  }

  private formatDate(date: Date | null): string | null {

    if (!date) {
      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  downloadPdf(): void {

  if (this.reportData.length === 0) {
    return;
  }

  const doc = new jsPDF('landscape');

  // Title
  doc.setFontSize(18);
  doc.text('Inventory Report', 14, 15);

  // Report filters
  doc.setFontSize(10);

  const fromDate = this.reportForm.get('fromDate')?.value;
  const toDate = this.reportForm.get('toDate')?.value;
  const category = this.reportForm.get('category')?.value;

  const fromDateText = fromDate
    ? this.formatDate(fromDate)
    : 'All';

  const toDateText = toDate
    ? this.formatDate(toDate)
    : 'All';

  const categoryText = category || 'All';

  doc.text(
    `From: ${fromDateText}    To: ${toDateText}    Category: ${categoryText}`,
    14,
    23
  );

  // Table data
  const tableData = this.reportData.map(item => [
    item.itemName,
    item.itemCategory || '',
    item.quantity ?? '',
    item.unit || '',
    item.location || '',
    item.purchaseDate
      ? this.formatDate(new Date(item.purchaseDate))
      : ''
  ]);

  autoTable(doc, {
    startY: 30,

    head: [[
      'Item Name',
      'Category',
      'Quantity',
      'Unit',
      'Location',
      'Purchase Date'
    ]],

    body: tableData,

    theme: 'grid',

    styles: {
      fontSize: 9
    },

    headStyles: {
      fontSize: 9
    }
  });

  // Download
  doc.save('Inventory_Report.pdf');
}
gotoDashboard():void{
this.router.navigate(['/']);
}
}
