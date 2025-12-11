using API.Alimed.Data;
using API.Alimed.Dtos;
using API.Alimed.Entities;
using API.Alimed.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Alimed.Controllers.Wizyty
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class WizytyController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IUserService _userService;
        public WizytyController(AppDbContext db, IUserService userService)
        {
            _db = db;
            _userService = userService;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// GET Requests
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        [HttpGet]
        [Route("{id}")]
        [Authorize(Roles = "User")]
        public async Task<IResult> GetWizytaById(int id)
        {
            // TODO
            // Implementacja logiki pobierania wizyty po ID
            return Results.Ok(new { Message = $"To jest wizyta o ID: {id}." });
        }

        [HttpGet]
        [Route("moje-wizyty")]
        [Authorize(Roles = "User")]
        public async Task<IResult> GetMojeWizyty()
        {
            // TODO
            // Implementacja logiki pobierania wizyt użytkownika
            return Results.Ok(new { Message = "To są Twoje wizyty." });
        }

        [HttpGet]
        [Route("dostepne")]
        [Authorize(Roles = "User")]
        public async Task<IResult> GetDostepneWizyty()
        {
            // TODO
            // Implementacja logiki pobierania dostępnych wizyt
            //return Results.Ok(new { Message = "To są dostępne wizyty." });
            return Results.Ok(await _db.Wizyty.ToListAsync());
        }

        //[HttpGet]
        //[Route("{id}/status")]
        //[Authorize(Roles = "User")]
        //public async Task<IResult> GetWizytaStatus(int id)
        //{
        //    // TODO
        //    // Implementacja logiki pobierania statusu wizyty po ID
        //    return Results.Ok(new { Message = $"Status wizyty o ID: {id}." });
        //}








        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// POST Requests
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        [HttpPost]
        [Route("umow-wizyte")]
        [Authorize(Roles = "User")]
        public async Task<IResult> UmowWizyte([FromBody] WizytaCreateDto dto)
        {
            // TODO
            // Implementacja logiki umawiania wizyty
            //return Results.Ok(new { Message = "Wizyta została umówiona.", Data = wizytaData });

            if(!ModelState.IsValid)
            {
                return Results.BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
            {
                return Results.Unauthorized();
            }

            var localUserId = Guid.Parse(userIdClaim);

            var pacjent = await _db.Pacjenci
                .FirstOrDefaultAsync(p => p.UserId == localUserId);

            if (pacjent == null)
                return Results.BadRequest("Nie znaleziono pacjenta powiązanego z użytkownikiem.");

            // walidacja: czy lekarz istnieje
            if (dto.LekarzId != null)
            {
                bool lekarzExists = await _db.Lekarze.AnyAsync(l => l.LekarzId == dto.LekarzId);
                if (!lekarzExists)
                    return Results.BadRequest("Podany lekarz nie istnieje.");
            }

            // walidacja: czy placówka istnieje
            if (dto.PlacowkaId != null)
            {
                bool placowkaExists = await _db.Placowki.AnyAsync(p => p.PlacowkaId == dto.PlacowkaId);
                if (!placowkaExists)
                    return Results.BadRequest("Podana placówka nie istnieje.");
            }

            // tworzymy nową wizytę
            var nowaWizyta = new Wizyta
            {
                DataWizyty = dto.DataWizyty,
                Diagnoza = dto.Diagnoza,
                PacjentId = pacjent.PacjentId,
                LekarzId = dto.LekarzId,
                PlacowkaId = dto.PlacowkaId,
                CzyOdbyta = false
            };

            _db.Wizyty.Add(nowaWizyta);
            await _db.SaveChangesAsync();

            return Results.Ok(new
            {
                Message = "Wizyta została poprawnie umówiona.",
                WizytaId = nowaWizyta.WizytaId
            });

        }







        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// PUT Requests
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        [HttpPut]
        [Route("{id}/moje-wizyty")]
        [Authorize(Roles = "Admin")]
        public async Task<IResult> UpdateMojeWizyty(int id, [FromBody] object updatedWizytaData)
        {
            // TODO
            // Implementacja logiki aktualizacji wizyty użytkownika po ID
             return Results.Ok(new { Message = $"Wizyta o ID: {id} została zaktualizowana.", Data = updatedWizytaData });
        }






        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// DELETE Requests
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IResult> DeleteWizyta(int id)
        {
            // TODO
            // Implementacja logiki usuwania wizyty po ID
            return Results.Ok(new { Message = $"Wizyta o ID: {id} została usunięta." });
        }


    }
}
