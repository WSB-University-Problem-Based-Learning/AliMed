using System.ComponentModel.DataAnnotations;

namespace API.Alimed.Dtos
{
    public class LoginDto
    {
        [Required]
        [MinLength(3)]
        [MaxLength(256)]
        public string Email { get; set; } = null!;

        [Required]
        [MinLength(8)]
        [MaxLength(128)]
        public string Password { get; set; } = null!;
    }
}
