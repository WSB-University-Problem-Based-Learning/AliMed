using System.Net;
using System.Net.Http.Json;
using API.Alimed.Tests.Infrastructure;
using Xunit;

public class DostepneTerminyTests
    : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public DostepneTerminyTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetDostepneTerminy_Zwraca200IListęTerminów()
    {
        // ARRANGE
        var lekarzId = 1;
        var placowkaId = 1;

        var from = DateTime.Today.AddDays(1).ToString("yyyy-MM-dd");
        var to = DateTime.Today.AddDays(7).ToString("yyyy-MM-dd");

        var url =
            $"/api/wizyty/dostepne-terminy?" +
            $"lekarzId={lekarzId}&placowkaId={placowkaId}&from={from}&to={to}";

        // ACT
        var response = await _client.GetAsync(url);

        // ASSERT
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<ResponseDto>();

        Assert.NotNull(body);
        Assert.Equal(lekarzId, body!.lekarzId);
        Assert.Equal(placowkaId, body.placowkaId);
        Assert.NotNull(body.available);
    }

    // pomocniczy DTO do deserializacji
    private class ResponseDto
    {
        public int lekarzId { get; set; }
        public int placowkaId { get; set; }
        public DateTime[] available { get; set; } = [];
    }
}
