using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Alimed.Controllers.Pacjenci
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PacjenciController : ControllerBase
    {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// GET Requests
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpGet]
        [Route("moj-profil")]
        [Authorize(Roles = "User")]
        public async Task<IResult> GetMojProfil()
        {
            // TODO
            // Implementacja logiki pobierania profilu pacjenta
            return Results.Ok(new { Message = "To jest Twój profil pacjenta." });
        }





        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// PUT Requests
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpPut]
        [Route("moj-profil")]
        [Authorize(Roles = "User")]
        public async Task<IResult> UpdateMojProfil()
        {
            // TODO
            return Results.Ok(new { Message = "Zaktualizowano twoje dane w profilu" });
        }




    }
}
