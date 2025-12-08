using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Alimed.Controllers.Lekarze
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]

    public class LekarzeController : ControllerBase
    {

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// GET Requests
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpGet]
        [Route("moj-profil")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> GetLekarzProfil()
        {
          // TODO
          // Implementacja logiki pobierania wszystkich lekarzy
          return Results.Ok(new { Message = "To są wszyscy lekarze." });
        }

        [HttpGet]
        [Route("wizyty/moje-wizyty")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> GetLekarzMojeWizyty()
        {
            // TODO
            // Implementacja logiki pobierania wizyt lekarza
            return Results.Ok(new { Message = "To są Twoje wizyty jako lekarza." });
        }




        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// PUT Requests
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        [HttpPut]
        [Route("/moj-profil")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> UpdateLekarzMojProfil()
        {
            // TODO
            return Results.Ok(new { Message = "Zaktualizowano twoje dane w profilu lekarza" });
        }

        [HttpPut]
        [Route("wizyty/{id}/status")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> UpdateLekarzWizyty()
        {
            // TODO
            return Results.Ok(new { Message = "Zaktualizowano status wizyty " });
        }
    }
}
