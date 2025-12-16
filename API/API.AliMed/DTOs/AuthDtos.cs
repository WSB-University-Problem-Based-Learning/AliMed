using System.ComponentModel.DataAnnotations;
using API.AliMed.Entities;

namespace API.AliMed.DTOs
{
    public record RegisterRequest(
        [EmailAddress] string Email,
        string Username,
        string Password,
        string? FirstName,
        string? LastName,
        string? Pesel,
        string? DataUrodzenia,
        string? Ulica,
        string? NumerDomu,
        string? KodPocztowy,
        string? Miasto,
        string? Kraj
    );

    public record LoginRequest([EmailAddress] string Email, string Password);

    public record AuthResponse(string Token, string RefreshToken, UserDto User);

    public record UserDto(
        string UserId,
        string? Email,
        string? FirstName,
        string? LastName,
        UserRole Role
    );
}
