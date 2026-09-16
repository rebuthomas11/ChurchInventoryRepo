using System;
using System.Collections.Generic;

namespace InventoryAPI.Models;

public partial class InventoryItem
{
    public int ItemId { get; set; }

    public string ItemName { get; set; } = null!;

    public string? ItemCategory { get; set; }

    public string? ItemDescription { get; set; }

    public int? Quantity { get; set; }

    public string? Unit { get; set; }

    public string? Location { get; set; }

    public DateTime? PurchaseDate { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public int? MinimumStock { get; set; }
}
