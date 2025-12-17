

using API.Alimed.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Alimed.Controllers.Admin;


[Authorize]
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


    [HttpPut]
    [Route("user-role")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUserRole()
    {
        return Ok("Here admin user role method");
    }




}