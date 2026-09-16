import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IInventory,IInventoryCreate } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})

export class InventoryService {
  private baseApiUrl="https://localhost:7242";

  constructor(private http:HttpClient) { }

  getAllInventory(): Observable<any>{
   return this.http.get(`${this.baseApiUrl}/api/Inventory/GetAllInventory`);
  }

  getInventoryById(id:string): Observable<any>{
    let params = new HttpParams().set('id', id.toString());
    return this.http.get(`${this.baseApiUrl}/api/Inventory/GetInventoryById`,{params});
   }

   addInventory(inventoryItems: IInventoryCreate): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseApiUrl}/api/Inventory/AddInventory`, inventoryItems, { headers });
  }

  updateInventory(id:number,inventoryItems: IInventory): Observable<any> {
    console.log('Inventory items in service',inventoryItems);
    let params=new HttpParams().set('id',id.toString());
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseApiUrl}/api/Inventory/UpdateInventory`, inventoryItems, {params, headers });
  }

  deleteInventory(id:number): Observable<any>{
    let params = new HttpParams().set('id', id.toString());
    return this.http.delete(`${this.baseApiUrl}/api/Inventory/DeleteInventory`,{params});
   }

    getInventoryReport(
      startDate:string | null,
      endDate:string | null,
      category:string | null): Observable<any>{
    let params = new HttpParams();
    if(startDate)
      params=params.set('startDate',startDate);
    if(endDate)
      params=params.set('endDate',endDate);
    if(category && category!='ALL')
      params=params.set('category',category)
    return this.http.get(`${this.baseApiUrl}/api/Inventory/InventoryReport`,{params});
   }
}
