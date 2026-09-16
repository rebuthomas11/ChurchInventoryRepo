using InventoryAPI.Data;
using InventoryAPI.Interfaces;
using InventoryAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace InventoryAPI.Services
{
    public class InventoryService : IInventoryIDetails
    {
        private readonly ApplicationDbContext _dbContext;
        public InventoryService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<InventoryItem>> GetAllInventoryAsync()
        {
            return await Task.FromResult(_dbContext.InventoryItems);
        }

        public async Task<InventoryItem?> GetInventoryByIdAsync(int id)
        {
            return await Task.FromResult(_dbContext.InventoryItems.FirstOrDefault(i => i.ItemId == id));
        }

        public async Task<InventoryItem> AddInventoryAsync(InventoryItem item)
        {
            try
            {
                _dbContext.InventoryItems.Add(item);
                await _dbContext.SaveChangesAsync();
                return item;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Error occurred while adding inventory item.", ex);
            }

        }

        public async Task<InventoryItem?> UpdateInventoryAsync(InventoryItem item)
        {
            try
            {
                var existingItem = _dbContext.InventoryItems.FirstOrDefault(i => i.ItemId == item.ItemId);
                if (existingItem == null)
                {
                    return null;
                }
                existingItem.ItemName = item.ItemName;
                existingItem.ItemCategory=item.ItemCategory;
                existingItem.ItemDescription = item.ItemDescription;
                existingItem.Quantity = item.Quantity;
                existingItem.Unit = item.Unit;
                existingItem.Location = item.Location;
                existingItem.PurchaseDate = item.PurchaseDate;
                await _dbContext.SaveChangesAsync();
                return existingItem;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Error occurred while updating inventory item.", ex);
            }
        }

        public async Task<bool> DeleteInventoryAsync(int id)
        {
            try
            {
                var item = _dbContext.InventoryItems.FirstOrDefault(i => i.ItemId == id);
                if (item == null)
                {
                    return false;
                }
                _dbContext.InventoryItems.Remove(item);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Error occurred while deleting inventory item.", ex);
            }
        }

        public async Task<IEnumerable<InventoryItem>> InventoryReport(DateTime? startDate, DateTime? endDate, string? category)
        {
            var query = _dbContext.InventoryItems
        .AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(x =>
                    x.PurchaseDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                var toDate = endDate.Value.Date.AddDays(1);

                query = query.Where(x =>
                    x.PurchaseDate < toDate);
            }

            if (!string.IsNullOrWhiteSpace(category) &&
                category != "All")
            {
                query = query.Where(x =>
                    x.ItemCategory == category);
            }

            return await query
                .OrderBy(x => x.PurchaseDate)
                .ToListAsync();
        }

    }
}
