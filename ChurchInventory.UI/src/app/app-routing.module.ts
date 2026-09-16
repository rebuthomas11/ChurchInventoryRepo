import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddInventoryComponent } from './features/add-inventory/add-inventory.component';
import { InventoryListComponent } from './features/list-inventory/list-inventory.component';
import { InventoryReportComponent } from './features/inventory-report/inventory-report.component';
const routes: Routes = [
 { path:'',component:InventoryListComponent},
 { path:'add-inventory',component:AddInventoryComponent},
 { path:'inventory-report', component:InventoryReportComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
