using InventoryAPI.Models;

namespace InventoryAPI.Interfaces
{
    public interface IInventoryIDetails
    {
        Task<IEnumerable<InventoryItem>> GetAllInventoryAsync();
        Task<InventoryItem?> GetInventoryByIdAsync(int id);
        Task<InventoryItem> AddInventoryAsync(InventoryItem item);
        Task<InventoryItem?> UpdateInventoryAsync(InventoryItem item);
        Task<bool> DeleteInventoryAsync(int id);
        Task<IEnumerable<InventoryItem>> InventoryReport(DateTime? startDate, DateTime? endDate, string? category);
    } 
}
