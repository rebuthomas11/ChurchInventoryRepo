import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IInventory } from 'src/app/core/models/inventory.model';

@Component({
  selector: 'app-view-inventory',
  templateUrl: './view-inventory.component.html',
  styleUrls: ['./view-inventory.component.css']
})
export class ViewInventoryComponent {
  constructor(public dialogRef:MatDialogRef<ViewInventoryComponent>,@Inject(MAT_DIALOG_DATA)public item:IInventory){}

  close():void{
    this.dialogRef.close();
  }
}
