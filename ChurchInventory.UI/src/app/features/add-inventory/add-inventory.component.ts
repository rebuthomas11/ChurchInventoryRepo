import { Component,OnInit } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,FormGroupDirective,NgForm,Validators } from '@angular/forms';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IInventory,IInventoryCreate } from 'src/app/core/models/inventory.model';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css']
})
export class AddInventoryComponent implements OnInit {
  matcher = new CustomErrorStateMatcher();
  inventoryForm!:FormGroup;
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
constructor(private fb:FormBuilder,private inventoryService:InventoryService, private snackBar:MatSnackBar, private router:Router){}
ngOnInit():void{
  this.createForm();
}

private createForm() : void{
   this.inventoryForm = this.fb.group({
      itemName: ['', [ Validators.required,Validators.maxLength(100)]],
      itemCategory: ['', Validators.required],
      itemDescription: ['', Validators.maxLength(200)],
      quantity: [0, [Validators.required,Validators.min(0)]],
      unit: ['Pieces', Validators.required],
      minimumStock: [0, [Validators.required,Validators.min(0)]],
      location: ['', Validators.maxLength(100)],
      purchaseDate: [null]
    });
}

get itemName() {
    return this.inventoryForm.get('itemName');
  }

  get itemCategory() {
    return this.inventoryForm.get('itemCategory');
  }

  get quantity() {
    return this.inventoryForm.get('quantity');
  }

  get unit() {
    return this.inventoryForm.get('unit');
  }

  get minimumStock() {
    return this.inventoryForm.get('minimumStock');
  }

//Save inventory to Db
save(): void {

    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }

   // const inventoryItem = this.inventoryForm.value;
   const inventoryItem: IInventoryCreate = {
    itemName: this.inventoryForm.value.itemName,
    itemCategory: this.inventoryForm.value.itemCategory,
    itemDescription: this.inventoryForm.value.itemDescription,
    quantity: this.inventoryForm.value.quantity,
    unit: this.inventoryForm.value.unit,
    minimumStock: this.inventoryForm.value.minimumStock,
    location: this.inventoryForm.value.location,
    purchaseDate: this.inventoryForm.value.purchaseDate 
    ? this.formatDate(this.inventoryForm.value.purchaseDate)
    : null
  };

this.inventoryService.addInventory(inventoryItem).subscribe({
    next: (response) => {
      console.log('Inventory item saved successfully', response);

       this.snackBar.open(
        'Inventory item added successfully!',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        }
      );

     this.resetForm();
    },

    error: (error) => {
      console.error('Error saving inventory item', error);

       this.snackBar.open(
        'Failed to save inventory item!',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        }
      );
    }
  });
    
  }

private formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

  //To reset form values
  cancel(): void {
   this.resetForm();
  }

  private resetForm(): void {
  this.inventoryForm.reset({
    itemName: '',
    itemCategory: '',
    itemDescription: '',
    quantity: 0,
    unit: 'Pieces',
    minimumStock: 0,
    location: '',
    purchaseDate: null
  });

  this.inventoryForm.markAsPristine();
  this.inventoryForm.markAsUntouched();
}
gotoDashboard():void{
this.router.navigate(['dashboard']);
}
}
export class CustomErrorStateMatcher implements ErrorStateMatcher {

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(
      control &&
      control.invalid &&
      control.touched
    );
  }
}
