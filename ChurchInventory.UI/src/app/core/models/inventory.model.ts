export interface IInventory {
    itemId:number;
    itemName:string;
    itemCategory:string;
    itemDescription:string;
    quantity:number;
    unit:string;
    location:string;
    purchaseDate?:string | null;
    createdDate?:Date | null;
    updatedDate?:Date | null;
    minimumStock:number;
}
export type IInventoryCreate = Omit<IInventory, 'itemId'>;