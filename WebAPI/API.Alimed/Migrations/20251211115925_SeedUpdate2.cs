using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Alimed.Migrations
{
    /// <inheritdoc />
    public partial class SeedUpdate2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pacjenci_Users_UserId1",
                table: "Pacjenci");

            migrationBuilder.DropIndex(
                name: "IX_Pacjenci_UserId1",
                table: "Pacjenci");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Pacjenci");

            migrationBuilder.AlterColumn<string>(
                name: "AdresPlacowki_Kraj",
                table: "Placowki",
                type: "longtext",
                nullable: true,
                defaultValue: "Polska",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "AdresZamieszkania_Kraj",
                table: "Pacjenci",
                type: "longtext",
                nullable: true,
                defaultValue: "Polska",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Lekarze",
                columns: new[] { "LekarzId", "Imie", "Nazwisko", "PlacowkaId", "Specjalizacja" },
                values: new object[,]
                {
                    { 2, "Anna", "Nowak", 1, "Pediatra" },
                    { 3, "Piotr", "Zieliński", 1, "Kardiolog" }
                });

            migrationBuilder.InsertData(
                table: "Placowki",
                columns: new[] { "PlacowkaId", "Nazwa", "NumerKonta", "AdresPlacowki_KodPocztowy", "AdresPlacowki_Kraj", "AdresPlacowki_Miasto", "AdresPlacowki_NumerDomu", "AdresPlacowki_Ulica" },
                values: new object[,]
                {
                    { 2, "Szpital Miejski", "98 7654 3210 9876 5432 0000", "01-234", "Polska", "Kraków", "5A", "Kwiatowa" },
                    { 3, "Centrum Rehabilitacji", "37 1020 5555 1234 5678 9012 0000", "80-800", "Polska", "Gdańsk", "21B/3", "Słoneczna" },
                    { 4, "Novum Centrum Diagnostyki", "61 1140 2000 0000 1111 2222 3333", "60-900", "Polska", "Poznań", "77", "Przemysłowa" },
                    { 5, "VitaMed Klinika", "85 2490 0000 0000 4567 8901 2345", "50-101", "Polska", "Wrocław", "4", "Leśna Aleja" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "GithubId", "GithubName", "Role", "Token", "Username" },
                values: new object[,]
                {
                    { new Guid("a0000000-0000-0000-0000-000000000001"), null, null, 2, null, "admin_alimed" },
                    { new Guid("b0000000-0000-0000-0000-000000000001"), null, null, 0, null, "pacjent1" },
                    { new Guid("b0000000-0000-0000-0000-000000000002"), null, null, 0, null, "pacjent2" },
                    { new Guid("b0000000-0000-0000-0000-000000000003"), null, null, 0, null, "pacjent3" },
                    { new Guid("b0000000-0000-0000-0000-000000000004"), null, null, 0, null, "pacjent4" },
                    { new Guid("b0000000-0000-0000-0000-000000000005"), null, null, 0, null, "pacjent5" }
                });

            migrationBuilder.InsertData(
                table: "Lekarze",
                columns: new[] { "LekarzId", "Imie", "Nazwisko", "PlacowkaId", "Specjalizacja" },
                values: new object[,]
                {
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
                columns: new[] { "WizytaId", "CzyOdbyta", "DataWizyty", "Diagnoza", "LekarzId", "PacjentId", "PlacowkaId" },
                values: new object[,]
                {
                    { 1, true, new DateTime(2025, 1, 15, 10, 0, 0, 0, DateTimeKind.Unspecified), "Grypa sezonowa", 1, 1, 1 },
                    { 2, true, new DateTime(2025, 2, 20, 11, 30, 0, 0, DateTimeKind.Unspecified), "Kontrola ciśnienia", 7, 1, 3 },
                    { 3, true, new DateTime(2025, 3, 5, 14, 0, 0, 0, DateTimeKind.Unspecified), "Badanie okresowe", 15, 1, 4 },
                    { 4, true, new DateTime(2025, 4, 1, 9, 0, 0, 0, DateTimeKind.Unspecified), "Wizyta u kardiologa", 37, 1, 5 },
                    { 5, false, new DateTime(2025, 5, 10, 15, 30, 0, 0, DateTimeKind.Unspecified), "Badanie krwi (planowana)", 4, 1, 2 },
                    { 6, true, new DateTime(2025, 1, 25, 8, 30, 0, 0, DateTimeKind.Unspecified), "Ból pleców", 5, 2, 2 },
                    { 7, true, new DateTime(2025, 2, 1, 16, 0, 0, 0, DateTimeKind.Unspecified), "Skręcenie kostki", 21, 2, 4 },
                    { 8, true, new DateTime(2025, 3, 15, 12, 0, 0, 0, DateTimeKind.Unspecified), "Kontrola po urazie", 39, 2, 5 },
                    { 9, true, new DateTime(2025, 4, 10, 10, 0, 0, 0, DateTimeKind.Unspecified), "Wizyta u dermatologa", 20, 2, 4 },
                    { 10, false, new DateTime(2025, 5, 25, 11, 0, 0, 0, DateTimeKind.Unspecified), "Wizyta kontrolna (planowana)", 1, 2, 1 },
                    { 11, true, new DateTime(2025, 1, 5, 13, 0, 0, 0, DateTimeKind.Unspecified), "Wizyta u endokrynologa", 8, 3, 3 },
                    { 12, true, new DateTime(2025, 2, 28, 9, 30, 0, 0, DateTimeKind.Unspecified), "Problemy ze snem", 30, 3, 4 },
                    { 13, true, new DateTime(2025, 3, 22, 17, 0, 0, 0, DateTimeKind.Unspecified), "Badania hormonalne", 42, 3, 5 },
                    { 14, true, new DateTime(2025, 4, 18, 11, 0, 0, 0, DateTimeKind.Unspecified), "Konsultacja psychiatryczna", 48, 3, 5 },
                    { 15, false, new DateTime(2025, 5, 1, 13, 0, 0, 0, DateTimeKind.Unspecified), "Konsultacja ginekologiczna (planowana)", 6, 3, 2 },
                    { 16, true, new DateTime(2025, 1, 1, 10, 0, 0, 0, DateTimeKind.Unspecified), "Ból głowy", 23, 4, 4 },
                    { 17, true, new DateTime(2025, 2, 14, 14, 30, 0, 0, DateTimeKind.Unspecified), "Kontrola okulistyczna", 10, 4, 3 },
                    { 18, true, new DateTime(2025, 3, 30, 8, 0, 0, 0, DateTimeKind.Unspecified), "Wizyta u pulmonologa", 27, 4, 4 },
                    { 19, true, new DateTime(2025, 4, 25, 12, 0, 0, 0, DateTimeKind.Unspecified), "Zapalenie spojówek", 44, 4, 5 },
                    { 20, false, new DateTime(2025, 5, 8, 14, 0, 0, 0, DateTimeKind.Unspecified), "Szczepienie (planowane)", 2, 4, 1 },
                    { 21, true, new DateTime(2025, 1, 10, 11, 0, 0, 0, DateTimeKind.Unspecified), "Ból stawów", 12, 5, 3 },
                    { 22, true, new DateTime(2025, 2, 5, 13, 30, 0, 0, DateTimeKind.Unspecified), "Zalecenia reumatologiczne", 28, 5, 4 },
                    { 23, true, new DateTime(2025, 3, 1, 10, 0, 0, 0, DateTimeKind.Unspecified), "Kontrola geriatryczna", 31, 5, 4 },
                    { 24, true, new DateTime(2025, 4, 14, 9, 30, 0, 0, DateTimeKind.Unspecified), "Konsultacja onkologiczna", 50, 5, 5 },
                    { 25, false, new DateTime(2025, 5, 20, 16, 0, 0, 0, DateTimeKind.Unspecified), "Kontrola (planowana)", 3, 5, 1 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 36);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 40);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 41);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 43);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 45);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 46);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 47);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 49);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: new Guid("a0000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Wizyty",
                keyColumn: "WizytaId",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 42);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 44);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 48);

            migrationBuilder.DeleteData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 50);

            migrationBuilder.DeleteData(
                table: "Pacjenci",
                keyColumn: "PacjentId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Pacjenci",
                keyColumn: "PacjentId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Pacjenci",
                keyColumn: "PacjentId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Pacjenci",
                keyColumn: "PacjentId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Pacjenci",
                keyColumn: "PacjentId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Placowki",
                keyColumn: "PlacowkaId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Placowki",
                keyColumn: "PlacowkaId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Placowki",
                keyColumn: "PlacowkaId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Placowki",
                keyColumn: "PlacowkaId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: new Guid("b0000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: new Guid("b0000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: new Guid("b0000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: new Guid("b0000000-0000-0000-0000-000000000004"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: new Guid("b0000000-0000-0000-0000-000000000005"));

            migrationBuilder.AlterColumn<string>(
                name: "AdresPlacowki_Kraj",
                table: "Placowki",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true,
                oldDefaultValue: "Polska")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "AdresZamieszkania_Kraj",
                table: "Pacjenci",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true,
                oldDefaultValue: "Polska")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "Pacjenci",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_Pacjenci_UserId1",
                table: "Pacjenci",
                column: "UserId1",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Pacjenci_Users_UserId1",
                table: "Pacjenci",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "UserId");
        }
    }
}
