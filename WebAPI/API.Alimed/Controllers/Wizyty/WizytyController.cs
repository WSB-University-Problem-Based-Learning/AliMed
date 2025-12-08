using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Alimed.Controllers.Wizyty
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class WizytyController : ControllerBase
    {

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// GET Requests
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        [HttpGet]
        [Route("{id}")]
        //[Authorize(Roles = "User")]
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
            return Results.Ok(new { Message = "To są dostępne wizyty." });
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
        public async Task<IResult> UmowWizyte([FromBody] object wizytaData)
        {
            // TODO
            // Implementacja logiki umawiania wizyty
            return Results.Ok(new { Message = "Wizyta została umówiona.", Data = wizytaData });
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
