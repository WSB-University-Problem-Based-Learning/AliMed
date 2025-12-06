using API.Alimed.Data;
using API.Alimed.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Alimed.Controllers
{
    public class AuthorizedEndpoint
    {
        [Authorize]
        [ApiController]
        [Route("api/[controller]")]
        public class AuthorizedEndpointController : ControllerBase
        {
            [HttpGet]
            public IActionResult GetProtectedData()
            {
                // pobiera ID user (ID GitHub)
                var githubIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (githubIdClaim == null)
                {
                    return Unauthorized();
                }

                // id na int usera
                if (int.TryParse(githubIdClaim, out int githubId))
                {
                    return Ok($"Witaj, użytkowniku GitHub o ID: {githubId}. Te dane są chronione.");
                }

                return StatusCode(500, "Błąd parsowania identyfikatora użytkownika.");
            }

            // tylko dla usera z rola Admin z Bazy Danych
            // path -> /api/authorizedendpoint/pacjenci
            [HttpGet("pacjenci")]
            [Authorize(Roles = "Admin")]
            public async Task<IResult> GetAllPacjenci(AppDbContext db)
            => Results.Ok(await db.Pacjenci.ToListAsync());

            // dostepny dla kazdego zalogowanego usera
            // path -> /api/authorizedendpoint/lekarze
            [HttpGet("lekarze")]
            [Authorize(Roles = "User")]
            public async Task<IResult> GetAllLekarze(AppDbContext db)
                => Results.Ok(await db.Lekarze.ToListAsync());

        }
    }
}
