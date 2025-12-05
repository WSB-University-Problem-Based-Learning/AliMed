namespace API.Alimed.Entities
{
    public class ZaleceniaDokument
    {
        public Guid Id { get; set; }
        public string NazwaPliku { get; set; } = null!;
        public byte[] ZawartoscPliku { get; set; } = null!;
        public DateTime DataUtworzenia { get; set; }
    }
}
