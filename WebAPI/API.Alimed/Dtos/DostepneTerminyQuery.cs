using System;

namespace API.Alimed.Dtos;

public class DostepneTerminyQuery
{
    public int LekarzId { get; set; }
    public int PlacowkaId { get; set; }
    public DateTime From { get; set; }
    public DateTime To { get; set; }
}

