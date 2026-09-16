using InventoryAPI.Interfaces;
using InventoryAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
   
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryIDetails _inventoryService;

        public InventoryController(IInventoryIDetails inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpGet("GetAllInventory")]
        public async Task<IActionResult> GetAllInventory()
        {
            var items = await _inventoryService.GetAllInventoryAsync();
            return Ok(items);
        }
        [HttpGet("GetInventoryById/{id}")]
        public async Task<IActionResult> GetInventoryById(int id)
        {
            var item = await _inventoryService.GetInventoryByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }

        [HttpPost("AddInventory")]
        public async Task<IActionResult> AddInventory([FromBody] InventoryItem item)
        {
            var addedItem = await _inventoryService.AddInventoryAsync(item);
            return CreatedAtAction(nameof(GetInventoryById), new { id = addedItem.ItemId }, addedItem);
        }

        [HttpPut("UpdateInventory")]
        public async Task<IActionResult> UpdateInventory(int id, [FromBody] InventoryItem item)
        {
            if (id != item.ItemId)
            {
                return BadRequest();
            }

            var updatedItem = await _inventoryService.UpdateInventoryAsync(item);
            if (updatedItem == null)
            {
                return NotFound();
            }

            return Ok(updatedItem);
        }

        [HttpDelete("DeleteInventory")]
        public async Task<IActionResult> DeleteInventory(int id)
        {
            var item = await _inventoryService.GetInventoryByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            var result = await _inventoryService.DeleteInventoryAsync(id);

            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpGet("InventoryReport")]
        public async Task<IActionResult> InventoryReport(DateTime? startDate, DateTime? endDate, string? category)
        {
            var report = await _inventoryService.InventoryReport(startDate, endDate, category);
            return Ok(report);
        }
    }
}
