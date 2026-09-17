namespace InventoryAPI.DTOs
{
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;

        public int UserId { get; set; }

        public string Username { get; set; } = string.Empty;

        public string LoginName { get; set; } = string.Empty;

        public string UserRole { get; set; } = string.Empty;
    }
}
