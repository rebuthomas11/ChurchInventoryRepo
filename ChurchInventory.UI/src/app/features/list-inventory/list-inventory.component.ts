import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IInventory } from 'src/app/core/models/inventory.model';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ViewInventoryComponent } from '../view-inventory/view-inventory.component';
import { UpdateInventoryComponent } from '../update-inventory/update-inventory.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.component.html',
  styleUrls: ['./list-inventory.component.css']
})
export class InventoryListComponent implements OnInit,AfterViewInit {

  inventoryList: IInventory[] = [];
  filteredInventoryList: IInventory[] = [];
  isLoading=false;
  dataSource = new MatTableDataSource<IInventory>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchText:string = '';

  displayedColumns: string[] = [
    'itemName',
    'itemCategory',
    'quantity',
    'unit',
    'minimumStock',
    'location',
    'purchaseDate',
    'status',
    'actions'
  ];

  constructor(
    private inventoryService: InventoryService,
    private snackBar: MatSnackBar,
    private route:Router,
    private dialog:MatDialog,
    private authService:AuthService
  ) {}
totalItems = 0;
inStockItems = 0;
lowStockItems = 0;
outOfStockItems = 0;
  ngOnInit(): void {
    this.loadInventory();
    this.dataSource.filterPredicate = (item: IInventory, filter: string) => {

  const search = filter.toLowerCase();

  return (
    item.itemName?.toLowerCase().includes(search) ||
    item.itemCategory?.toLowerCase().includes(search) ||
    item.location?.toLowerCase().includes(search)
      );
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator=this.paginator;

  }

  loadInventory(): void {
    this.isLoading=true;
    this.inventoryService.getAllInventory().subscribe({
      next: (response: IInventory[]) => {
         setTimeout(() => {
        this.inventoryList = response;
        //this.filteredInventoryList = response;
        this.dataSource.data=response;
        this.dashboardStats();
        this.isLoading = false;
      }, 2000);
      },
      error: (error) => {
        console.error(error);
        this.isLoading=false;
        this.snackBar.open(
          'Failed to load inventory.',
          'Close',
          { duration: 4000 }
        );
      }
    });
  }
dashboardStats():void{
 this.totalItems = this.inventoryList.length;

  this.inStockItems = this.inventoryList.filter(
    item => this.getStockStatus(item) === 'In Stock'
  ).length;

  this.lowStockItems = this.inventoryList.filter(
    item => this.getStockStatus(item) === 'Low Stock'
  ).length;

  this.outOfStockItems = this.inventoryList.filter(
    item => this.getStockStatus(item) === 'Out of Stock'
  ).length;
}
  applyFilter(): void {

    const search = this.searchText.toLowerCase().trim();

    /*if (!search) {
      this.filteredInventoryList = this.inventoryList;
      return;
    }

    this.filteredInventoryList = this.inventoryList.filter(item =>
      item.itemName?.toLowerCase().includes(search) ||
      item.itemCategory?.toLowerCase().includes(search) ||
      item.location?.toLowerCase().includes(search)
    );*/
    this.dataSource.filter = search;

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
  }

  getStockStatus(item: IInventory): string {

    if ((item.quantity ?? 0) === 0) {
      return 'Out of Stock';
    }

    if ((item.quantity ?? 0) <= (item.minimumStock ?? 0)) {
      return 'Low Stock';
    }

    return 'In Stock';
  }

  viewItem(item: IInventory): void {
    this.dialog.open(ViewInventoryComponent,{
      width:'550px',
      data:item

    });
  }

  editItem(item: IInventory): void {

  const dialogRef = this.dialog.open(UpdateInventoryComponent, {
    width: '650px',
    data: item
  });

  dialogRef.afterClosed().subscribe(result => {

    if (!result) {
      return;
    }
console.log('Dialog result purchase date:', result.purchaseDate);
    this.inventoryService.updateInventory(item!.itemId,result)
      .subscribe({
        next: () => {

         this.snackBar.open(
          'Inventory item updated successfully.',
          'Close',
          { duration: 3000,
            horizontalPosition:'right',
            verticalPosition:'top'
           }
        );

          this.loadInventory();

        },
        error: (error) => {

          console.error('Update failed:', error);

          this.snackBar.open(
          'Failed to update inventory.',
          'Close',
          { duration: 3000,
            horizontalPosition:'right',
            verticalPosition:'top'
           }
        );

        }
      });

  });
}

  
  deleteItem(item: IInventory): void {

    const confirmed = confirm(
      `Are you sure you want to delete "${item.itemName}"?`
    );

    if (!confirmed) {
      return;
    }

    this.inventoryService.deleteInventory(item.itemId!).subscribe({
      next: () => {

        this.snackBar.open(
          'Inventory item deleted successfully.',
          'Close',
          { duration: 3000,
            horizontalPosition:'right',
            verticalPosition:'top'
           }
        );

        this.loadInventory();
      },

      error: (error) => {

        console.error(error);

        this.snackBar.open(
          'Failed to delete inventory item.',
          'Close',
          { duration: 4000,
            horizontalPosition:'right',
            verticalPosition:'top'
           }
        );
      }
    });
  } 
  logout(): void {

  this.authService.logout();

  this.route.navigate(['/']);
}
}