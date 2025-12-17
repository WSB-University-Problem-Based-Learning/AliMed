using API.Alimed.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Alimed.Controllers.Admin;

//[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminController(AppDbContext db)
    {
        _db = db;
    }


    [HttpGet]
    [Route("admin-profile")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAdminDashboard()
    {
        return Ok("Admin profile here");
    }


    [HttpGet]
    [Route("users")]
    // [Authorize(Roles = "Admin")]
    public async Task <IActionResult> GetAllUsersFromDbAdminDashboard()
    {
        var usersList = await _db.Users.ToListAsync();
        return Ok(usersList);
    }

    [HttpGet]
    [Route("users/{userId}/role")]
    // [Authorize(Roles = "Admin")]
    public async Task <IActionResult> GetUserRole(string userId)
    {
        var userRole = await _db.Users
            .Where(u => u.UserId.ToString() == userId)
            .Select(u => u.Role)
            .FirstOrDefaultAsync();

        if (userRole == null)
            return NotFound();

        return Ok(userRole);
    }



    //[HttpPut]
    //[Route("user-role/{id}")]
    //[Authorize(Roles = "Admin")]
    //public async Task<IResult> UpdateUserRole(int id)
    //{
    //    var userId = await _db.Users
    //        .Where(u => u.UserId == userId)

    //    if (userId == null)
    //        return Results.BadRequest("User not found - UpdateUserRole");
        
    //    var userRole = await _db.Users.
    //    if(user)


    //    //return Ok("Here admin user role method");
    //}




}