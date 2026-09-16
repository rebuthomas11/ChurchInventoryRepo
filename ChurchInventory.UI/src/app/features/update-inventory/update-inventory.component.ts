import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { IInventory } from 'src/app/core/models/inventory.model';

@Component({
  selector: 'app-update-inventory',
  templateUrl: './update-inventory.component.html',
  styleUrls: ['./update-inventory.component.css']
})
export class UpdateInventoryComponent {
  inventoryForm!: FormGroup;

  categories: string[] = [
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

  units: string[] = [
    'Pieces',
    'Boxes',
    'Packets',
    'Sets',
    'Kg',
    'Litres'
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public item: IInventory
  ) {}

  ngOnInit(): void {

    this.inventoryForm = this.fb.group({

      itemName: [
        this.item.itemName,
        [Validators.required, Validators.maxLength(100)]
      ],

      itemCategory: [
        this.item.itemCategory,
        Validators.required
      ],

      itemDescription: [
        this.item.itemDescription,
        Validators.maxLength(200)
      ],

      quantity: [
        this.item.quantity,
        [Validators.required, Validators.min(0)]
      ],

      unit: [
        this.item.unit,
        Validators.required
      ],

      minimumStock: [
        this.item.minimumStock,
        [Validators.required, Validators.min(0)]
      ],

      location: [
        this.item.location,
        Validators.maxLength(100)
      ],

     purchaseDate: [
  this.item.purchaseDate
    ? new Date(this.item.purchaseDate)
    : null
]

    });
  }

  onPurchaseDateChange(event: any): void {
  console.log('Date selected:', event.value);
  console.log(
    'Form control date:',
    this.inventoryForm.get('purchaseDate')?.value
  );
}

  update(): void {

    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }
const formValue = this.inventoryForm.value;

    const updatedItem: IInventory = {
    ...this.item,
    itemName: formValue.itemName,
    itemCategory: formValue.itemCategory,
    itemDescription: formValue.itemDescription,
    quantity: formValue.quantity,
    unit: formValue.unit,
    minimumStock: formValue.minimumStock,
    location: formValue.location,
    purchaseDate: formValue.purchaseDate
      ? this.formatDate(formValue.purchaseDate)
      : null
  };

    this.dialogRef.close(updatedItem);
  }

private formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

  cancel(): void {
    this.dialogRef.close();
  }

}
