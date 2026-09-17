using InventoryAPI.DTOs;
using InventoryAPI.Interfaces;
using InventoryAPI.Models;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace InventoryAPI.Services;

public class AuthService : IAuthService
{
    private readonly ChurchInventoryContext _dbContext;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<object> _passwordHasher;

    public AuthService(
        ChurchInventoryContext dbContext,
        IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
        _passwordHasher = new PasswordHasher<object>();
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(x =>
                x.LoginName == request.LoginName &&
                x.IsActive==true);

        if (user == null)
        {
            return null;
        }

        var passwordResult = _passwordHasher.VerifyHashedPassword(
            null!,
            user.LoginPassword,
            request.LoginPassword);

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            return null;
        }

        var token = GenerateJwtToken(user);

        return new LoginResponse
        {
            Token = token,
            UserId = user.UserId,
            Username = user.UserName,
            LoginName = user.LoginName,
            UserRole = user.UserRole
        };
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration
            .GetSection("JwtSettings");

        var key = jwtSettings["Key"]
            ?? throw new InvalidOperationException(
                "JWT Key is not configured.");

        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];

        var duration = int.Parse(
            jwtSettings["DurationInMinutes"] ?? "60");

        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                user.UserId.ToString()),

            new Claim(
                ClaimTypes.Name,
                user.LoginName),

            new Claim(
                ClaimTypes.Role,
                user.UserRole)
        };

        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(key));

        var credentials = new SigningCredentials(
            securityKey,
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(duration),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}