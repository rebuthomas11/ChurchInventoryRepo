using InventoryAPI.DTOs;
using InventoryAPI.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace InventoryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        //To get hashed password for 123 for testing purpose only, remove this in production
        [HttpGet("password")]
        public IActionResult Password()
        {
            var hasher = new PasswordHasher<object>();

            var hash = hasher.HashPassword(
                null!,
                "123"
            );

            return Ok(hash);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.LoginName) ||
            string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(
                    "Login name and password are required.");
            }

            var result = await _authService.LoginAsync(request);

            if (result == null)
            {
                return Unauthorized(
                    "Invalid login name or password.");
            }

            return Ok(result);
        }
    }
}
