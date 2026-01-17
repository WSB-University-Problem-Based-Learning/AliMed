namespace API.Alimed.Interfaces
{
    public interface IPasswordService
    {
        (string hash, string salt) HashPassword(string password);
        bool Verify(string password, string hash, string salt);
    }
}
