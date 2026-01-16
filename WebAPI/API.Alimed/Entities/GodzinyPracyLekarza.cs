namespace API.Alimed.Entities;

    public class GodzinyPracyLekarza
    {
        public int Id { get; set; }

        public int LekarzId { get; set; }
        public Lekarz Lekarz { get; set; } = null!;

        public int PlacowkaId { get; set; }
        public Placowka Placowka { get; set; } = null!;

        public DayOfWeek DzienTygodnia { get; set; }

        public TimeSpan GodzinaOd { get; set; }
        public TimeSpan GodzinaDo { get; set; }

        public int CzasWizytyMinuty { get; set; } = 30;
    }
