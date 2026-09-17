using InventoryAPI.DTOs;

namespace InventoryAPI.Interfaces
{
    public interface IAuthService
    {
       Task<LoginResponse> LoginAsync(LoginRequest request);
    }
}
