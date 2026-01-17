using API.Alimed.Interfaces;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;

namespace API.Alimed.Services
{
    public class PasswordService : IPasswordService
    {
        public (string hash, string salt) HashPassword(string password)
        {
            byte[] saltBytes = RandomNumberGenerator.GetBytes(128 / 8);
            string salt = Convert.ToBase64String(saltBytes);

            string hash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password,
                saltBytes,
                KeyDerivationPrf.HMACSHA256,
                100000,
                256 / 8
            ));

            return (hash, salt);
        }

        public bool Verify(string password, string hash, string salt)
        {
            byte[] saltBytes = Convert.FromBase64String(salt);

            string newHash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password,
                saltBytes,
                KeyDerivationPrf.HMACSHA256,
                100000,
                256 / 8
            ));

            return newHash == hash;
        }
    }
}
