using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Alimed.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusWizyty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Placowki",
                columns: table => new
                {
                    PlacowkaId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Nazwa = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AdresPlacowki_Ulica = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AdresPlacowki_NumerDomu = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AdresPlacowki_KodPocztowy = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AdresPlacowki_Miasto = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AdresPlacowki_Kraj = table.Column<string>(type: "longtext", nullable: true, defaultValue: "Polska")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NumerKonta = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Placowki", x => x.PlacowkaId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    GithubId = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GithubName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Username = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Token = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Role = table.Column<int>(type: "int", nullable: false),
                    Email = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordSalt = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsGithubUser = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Lekarze",
                columns: table => new
                {
                    LekarzId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Imie = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Nazwisko = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Specjalizacja = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PlacowkaId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lekarze", x => x.LekarzId);
                    table.ForeignKey(
                        name: "FK_Lekarze_Placowki_PlacowkaId",
                        column: x => x.PlacowkaId,
                        principalTable: "Placowki",
                        principalColumn: "PlacowkaId");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Pacjenci",
                columns: table => new
                {
                    PacjentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Imie = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Nazwisko = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Pesel = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AdresZamieszkania_Ulica = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AdresZamieszkania_NumerDomu = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AdresZamieszkania_KodPocztowy = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AdresZamieszkania_Miasto = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AdresZamieszkania_Kraj = table.Column<string>(type: "longtext", nullable: true, defaultValue: "Polska")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DataUrodzenia = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pacjenci", x => x.PacjentId);
                    table.ForeignKey(
                        name: "FK_Pacjenci_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "RefreshToken",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Token = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ExpiresOnUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IsRevoked = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshToken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshToken_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Wizyty",
                columns: table => new
                {
                    WizytaId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DataWizyty = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Diagnoza = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status = table.Column<int>(type: "int", nullable: false),
                    PacjentId = table.Column<int>(type: "int", nullable: true),
                    LekarzId = table.Column<int>(type: "int", nullable: true),
                    PlacowkaId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Wizyty", x => x.WizytaId);
                    table.ForeignKey(
                        name: "FK_Wizyty_Lekarze_LekarzId",
                        column: x => x.LekarzId,
                        principalTable: "Lekarze",
                        principalColumn: "LekarzId");
                    table.ForeignKey(
                        name: "FK_Wizyty_Pacjenci_PacjentId",
                        column: x => x.PacjentId,
                        principalTable: "Pacjenci",
                        principalColumn: "PacjentId");
                    table.ForeignKey(
                        name: "FK_Wizyty_Placowki_PlacowkaId",
                        column: x => x.PlacowkaId,
                        principalTable: "Placowki",
                        principalColumn: "PlacowkaId");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Placowki",
                columns: new[] { "PlacowkaId", "Nazwa", "NumerKonta", "AdresPlacowki_KodPocztowy", "AdresPlacowki_Kraj", "AdresPlacowki_Miasto", "AdresPlacowki_NumerDomu", "AdresPlacowki_Ulica" },
                values: new object[,]
                {
                    { 1, "Przychodnia Zdrowie", "12 3456 7890 1234 5678 0000", "00-001", "Polska", "Warszawa", "10", "Lipowa" },
                    { 2, "Szpital Miejski", "98 7654 3210 9876 5432 0000", "01-234", "Polska", "Kraków", "5A", "Kwiatowa" },
                    { 3, "Centrum Rehabilitacji", "37 1020 5555 1234 5678 9012 0000", "80-800", "Polska", "Gdańsk", "21B/3", "Słoneczna" },
                    { 4, "Novum Centrum Diagnostyki", "61 1140 2000 0000 1111 2222 3333", "60-900", "Polska", "Poznań", "77", "Przemysłowa" },
                    { 5, "VitaMed Klinika", "85 2490 0000 0000 4567 8901 2345", "50-101", "Polska", "Wrocław", "4", "Leśna Aleja" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Email", "GithubId", "GithubName", "IsGithubUser", "PasswordHash", "PasswordSalt", "Role", "Token", "Username" },
                values: new object[,]
                {
                    { new Guid("a0000000-0000-0000-0000-000000000001"), null, null, null, false, null, null, 2, null, "admin_alimed" },
                    { new Guid("b0000000-0000-0000-0000-000000000001"), null, null, null, false, null, null, 0, null, "pacjent1" },
                    { new Guid("b0000000-0000-0000-0000-000000000002"), null, null, null, false, null, null, 0, null, "pacjent2" },
                    { new Guid("b0000000-0000-0000-0000-000000000003"), null, null, null, false, null, null, 0, null, "pacjent3" },
                    { new Guid("b0000000-0000-0000-0000-000000000004"), null, null, null, false, null, null, 0, null, "pacjent4" },
                    { new Guid("b0000000-0000-0000-0000-000000000005"), null, null, null, false, null, null, 0, null, "pacjent5" }
                });

            migrationBuilder.InsertData(
                table: "Lekarze",
                columns: new[] { "LekarzId", "Imie", "Nazwisko", "PlacowkaId", "Specjalizacja" },
                values: new object[,]
                {
                    { 1, "Jan", "Kowalski", 1, "Internista" },
                    { 2, "Anna", "Nowak", 1, "Pediatra" },
                    { 3, "Piotr", "Zieliński", 1, "Kardiolog" },
                    { 4, "Marta", "Wójcik", 2, "Dermatolog" },
                    { 5, "Krzysztof", "Kowalczyk", 2, "Ortopeda" },
                    { 6, "Ewa", "Lewandowska", 2, "Ginekolog" },
                    { 7, "Tomasz", "Kaczmarek", 3, "Neurolog" },
                    { 8, "Magdalena", "Mazur", 3, "Endokrynolog" },
                    { 9, "Robert", "Więckowski", 3, "Urolog" },
                    { 10, "Joanna", "Borkowska", 3, "Okulista" },
                    { 11, "Adam", "Gajewski", 3, "Pulmonolog" },
                    { 12, "Natalia", "Wróbel", 3, "Reumatolog" },
                    { 13, "Michał", "Jankowski", 3, "Hematolog" },
                    { 14, "Monika", "Zając", 3, "Psychiatra" },
                    { 15, "Andrzej", "Pietrzak", 4, "Internista" },
                    { 16, "Barbara", "Sikora", 4, "Pediatra" },
                    { 17, "Cezary", "Kruk", 4, "Chirurg" },
                    { 18, "Daria", "Lis", 4, "Anestezjolog" },
                    { 19, "Filip", "Wysocki", 4, "Kardiolog" },
                    { 20, "Gabriela", "Mazurek", 4, "Dermatolog" },
                    { 21, "Hubert", "Kołodziej", 4, "Ortopeda" },
                    { 22, "Irena", "Bąk", 4, "Ginekolog" },
                    { 23, "Jerzy", "Kalinowski", 4, "Neurolog" },
                    { 24, "Kinga", "Kwiatkowska", 4, "Endokrynolog" },
                    { 25, "Lech", "Wiśniewski", 4, "Urolog" },
                    { 26, "Mariola", "Jasińska", 4, "Okulista" },
                    { 27, "Norbert", "Olszewski", 4, "Pulmonolog" },
                    { 28, "Olimpia", "Pająk", 4, "Reumatolog" },
                    { 29, "Paweł", "Czarnecki", 4, "Hematolog" },
                    { 30, "Renata", "Górska", 4, "Psychiatra" },
                    { 31, "Sebastian", "Wróblewski", 4, "Geriatra" },
                    { 32, "Teresa", "Maciejewska", 4, "Onkolog" },
                    { 33, "Urszula", "Sobczak", 5, "Internista" },
                    { 34, "Wiktor", "Michalski", 5, "Pediatra" },
                    { 35, "Zuzanna", "Adamczyk", 5, "Chirurg" },
                    { 36, "Bartosz", "Szewczyk", 5, "Anestezjolog" },
                    { 37, "Dagmara", "Walczak", 5, "Kardiolog" },
                    { 38, "Fryderyk", "Zieliński", 5, "Dermatolog" },
                    { 39, "Grażyna", "Baranowska", 5, "Ortopeda" },
                    { 40, "Igor", "Szymański", 5, "Ginekolog" },
                    { 41, "Jolanta", "Wojciechowska", 5, "Neurolog" },
                    { 42, "Kamil", "Krupa", 5, "Endokrynolog" },
                    { 43, "Lidia", "Piotrowska", 5, "Urolog" },
                    { 44, "Marek", "Grabowski", 5, "Okulista" },
                    { 45, "Nina", "Rutkowska", 5, "Pulmonolog" },
                    { 46, "Oskar", "Kowalski", 5, "Reumatolog" },
                    { 47, "Patrycja", "Zaręba", 5, "Hematolog" },
                    { 48, "Rafał", "Barański", 5, "Psychiatra" },
                    { 49, "Sandra", "Konieczna", 5, "Geriatra" },
                    { 50, "Wiktor", "Krawczyk", 5, "Onkolog" }
                });

            migrationBuilder.InsertData(
                table: "Pacjenci",
                columns: new[] { "PacjentId", "DataUrodzenia", "Imie", "Nazwisko", "Pesel", "UserId", "AdresZamieszkania_KodPocztowy", "AdresZamieszkania_Kraj", "AdresZamieszkania_Miasto", "AdresZamieszkania_NumerDomu", "AdresZamieszkania_Ulica" },
                values: new object[,]
                {
                    { 1, new DateTime(1990, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Alicja", "Bąk", "90050112345", new Guid("b0000000-0000-0000-0000-000000000001"), "00-010", "Polska", "Warszawa", "3/1", "Długa" },
                    { 2, new DateTime(1985, 11, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Robert", "Cygan", "85112054321", new Guid("b0000000-0000-0000-0000-000000000002"), "30-011", "Polska", "Kraków", "15", "Krótka" },
                    { 3, new DateTime(1975, 2, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Karolina", "Duda", "75021598765", new Guid("b0000000-0000-0000-0000-000000000003"), "80-123", "Polska", "Gdańsk", "2A", "Wodna" },
                    { 4, new DateTime(2001, 8, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Maksymilian", "Falkowski", "01081033344", new Guid("b0000000-0000-0000-0000-000000000004"), "60-700", "Polska", "Poznań", "88B", "Rzeczna" },
                    { 5, new DateTime(1968, 9, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Zofia", "Górecka", "68092288899", new Guid("b0000000-0000-0000-0000-000000000005"), "50-400", "Polska", "Wrocław", "45", "Północna" }
                });

            migrationBuilder.InsertData(
                table: "Wizyty",
                columns: new[] { "WizytaId", "DataWizyty", "Diagnoza", "LekarzId", "PacjentId", "PlacowkaId", "Status" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 15, 10, 0, 0, 0, DateTimeKind.Unspecified), "Grypa sezonowa", 1, 1, 1, 1 },
                    { 2, new DateTime(2025, 2, 20, 11, 30, 0, 0, DateTimeKind.Unspecified), "Kontrola ciśnienia", 7, 1, 3, 1 },
                    { 3, new DateTime(2025, 3, 5, 14, 0, 0, 0, DateTimeKind.Unspecified), "Badanie okresowe", 15, 1, 4, 1 },
                    { 4, new DateTime(2025, 4, 1, 9, 0, 0, 0, DateTimeKind.Unspecified), "Wizyta u kardiologa", 37, 1, 5, 1 },
                    { 5, new DateTime(2025, 5, 10, 15, 30, 0, 0, DateTimeKind.Unspecified), "Badanie krwi (planowana)", 4, 1, 2, 0 },
                    { 6, new DateTime(2025, 1, 25, 8, 30, 0, 0, DateTimeKind.Unspecified), "Ból pleców", 5, 2, 2, 1 },
                    { 7, new DateTime(2025, 2, 1, 16, 0, 0, 0, DateTimeKind.Unspecified), "Skręcenie kostki", 21, 2, 4, 1 },
                    { 8, new DateTime(2025, 3, 15, 12, 0, 0, 0, DateTimeKind.Unspecified), "Kontrola po urazie", 39, 2, 5, 1 },
                    { 9, new DateTime(2025, 4, 10, 10, 0, 0, 0, DateTimeKind.Unspecified), "Wizyta u dermatologa", 20, 2, 4, 1 },
                    { 10, new DateTime(2025, 5, 25, 11, 0, 0, 0, DateTimeKind.Unspecified), "Wizyta kontrolna (planowana)", 1, 2, 1, 0 },
                    { 11, new DateTime(2025, 1, 5, 13, 0, 0, 0, DateTimeKind.Unspecified), "Wizyta u endokrynologa", 8, 3, 3, 1 },
                    { 12, new DateTime(2025, 2, 28, 9, 30, 0, 0, DateTimeKind.Unspecified), "Problemy ze snem", 30, 3, 4, 1 },
                    { 13, new DateTime(2025, 3, 22, 17, 0, 0, 0, DateTimeKind.Unspecified), "Badania hormonalne", 42, 3, 5, 1 },
                    { 14, new DateTime(2025, 4, 18, 11, 0, 0, 0, DateTimeKind.Unspecified), "Konsultacja psychiatryczna", 48, 3, 5, 1 },
                    { 15, new DateTime(2025, 5, 1, 13, 0, 0, 0, DateTimeKind.Unspecified), "Konsultacja ginekologiczna (planowana)", 6, 3, 2, 0 },
                    { 16, new DateTime(2025, 1, 1, 10, 0, 0, 0, DateTimeKind.Unspecified), "Ból głowy", 23, 4, 4, 1 },
                    { 17, new DateTime(2025, 2, 14, 14, 30, 0, 0, DateTimeKind.Unspecified), "Kontrola okulistyczna", 10, 4, 3, 1 },
                    { 18, new DateTime(2025, 3, 30, 8, 0, 0, 0, DateTimeKind.Unspecified), "Wizyta u pulmonologa", 27, 4, 4, 1 },
                    { 19, new DateTime(2025, 4, 25, 12, 0, 0, 0, DateTimeKind.Unspecified), "Zapalenie spojówek", 44, 4, 5, 1 },
                    { 20, new DateTime(2025, 5, 8, 14, 0, 0, 0, DateTimeKind.Unspecified), "Szczepienie (planowane)", 2, 4, 1, 0 },
                    { 21, new DateTime(2025, 1, 10, 11, 0, 0, 0, DateTimeKind.Unspecified), "Ból stawów", 12, 5, 3, 1 },
                    { 22, new DateTime(2025, 2, 5, 13, 30, 0, 0, DateTimeKind.Unspecified), "Zalecenia reumatologiczne", 28, 5, 4, 1 },
                    { 23, new DateTime(2025, 3, 1, 10, 0, 0, 0, DateTimeKind.Unspecified), "Kontrola geriatryczna", 31, 5, 4, 1 },
                    { 24, new DateTime(2025, 4, 14, 9, 30, 0, 0, DateTimeKind.Unspecified), "Konsultacja onkologiczna", 50, 5, 5, 1 },
                    { 25, new DateTime(2025, 5, 20, 16, 0, 0, 0, DateTimeKind.Unspecified), "Kontrola (planowana)", 3, 5, 1, 0 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Lekarze_PlacowkaId",
                table: "Lekarze",
                column: "PlacowkaId");

            migrationBuilder.CreateIndex(
                name: "IX_Pacjenci_Pesel",
                table: "Pacjenci",
                column: "Pesel",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Pacjenci_UserId",
                table: "Pacjenci",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RefreshToken_UserId",
                table: "RefreshToken",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_GithubId",
                table: "Users",
                column: "GithubId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Wizyty_LekarzId_PlacowkaId_DataWizyty",
                table: "Wizyty",
                columns: new[] { "LekarzId", "PlacowkaId", "DataWizyty" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Wizyty_PacjentId",
                table: "Wizyty",
                column: "PacjentId");

            migrationBuilder.CreateIndex(
                name: "IX_Wizyty_PlacowkaId",
                table: "Wizyty",
                column: "PlacowkaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RefreshToken");

            migrationBuilder.DropTable(
                name: "Wizyty");

            migrationBuilder.DropTable(
                name: "Lekarze");

            migrationBuilder.DropTable(
                name: "Pacjenci");

            migrationBuilder.DropTable(
                name: "Placowki");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
