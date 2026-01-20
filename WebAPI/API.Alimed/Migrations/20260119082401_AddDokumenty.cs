using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Alimed.Migrations
{
    /// <inheritdoc />
    public partial class AddDokumenty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Dokumenty",
                columns: table => new
                {
                    DokumentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    NazwaPliku = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TypDokumentu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Opis = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DataUtworzenia = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Zawartosc = table.Column<byte[]>(type: "longblob", nullable: true),
                    TypMime = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    WizytaId = table.Column<int>(type: "int", nullable: false),
                    PacjentId = table.Column<int>(type: "int", nullable: false),
                    LekarzId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dokumenty", x => x.DokumentId);
                    table.ForeignKey(
                        name: "FK_Dokumenty_Lekarze_LekarzId",
                        column: x => x.LekarzId,
                        principalTable: "Lekarze",
                        principalColumn: "LekarzId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Dokumenty_Pacjenci_PacjentId",
                        column: x => x.PacjentId,
                        principalTable: "Pacjenci",
                        principalColumn: "PacjentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Dokumenty_Wizyty_WizytaId",
                        column: x => x.WizytaId,
                        principalTable: "Wizyty",
                        principalColumn: "WizytaId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "GodzinyPracyLekarzy",
                columns: new[] { "Id", "CzasWizytyMinuty", "DzienTygodnia", "GodzinaDo", "GodzinaOd", "LekarzId", "PlacowkaId" },
                values: new object[,]
                {
                    { 6, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 2, 1 },
                    { 7, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 2, 1 },
                    { 8, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 2, 1 },
                    { 9, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 2, 1 },
                    { 10, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 2, 1 },
                    { 11, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 3, 1 },
                    { 12, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 3, 1 },
                    { 13, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 3, 1 },
                    { 14, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 3, 1 },
                    { 15, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 3, 1 },
                    { 16, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 4, 2 },
                    { 17, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 4, 2 },
                    { 18, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 4, 2 },
                    { 19, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 4, 2 },
                    { 20, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 4, 2 },
                    { 21, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 5, 2 },
                    { 22, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 5, 2 },
                    { 23, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 5, 2 },
                    { 24, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 5, 2 },
                    { 25, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 5, 2 },
                    { 26, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 6, 2 },
                    { 27, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 6, 2 },
                    { 28, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 6, 2 },
                    { 29, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 6, 2 },
                    { 30, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 6, 2 },
                    { 31, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 7, 3 },
                    { 32, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 7, 3 },
                    { 33, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 7, 3 },
                    { 34, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 7, 3 },
                    { 35, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 7, 3 },
                    { 36, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 8, 3 },
                    { 37, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 8, 3 },
                    { 38, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 8, 3 },
                    { 39, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 8, 3 },
                    { 40, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 8, 3 },
                    { 41, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 9, 3 },
                    { 42, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 9, 3 },
                    { 43, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 9, 3 },
                    { 44, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 9, 3 },
                    { 45, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 9, 3 },
                    { 46, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 10, 3 },
                    { 47, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 10, 3 },
                    { 48, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 10, 3 },
                    { 49, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 10, 3 },
                    { 50, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 10, 3 },
                    { 51, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 11, 3 },
                    { 52, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 11, 3 },
                    { 53, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 11, 3 },
                    { 54, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 11, 3 },
                    { 55, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 11, 3 },
                    { 56, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 12, 3 },
                    { 57, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 12, 3 },
                    { 58, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 12, 3 },
                    { 59, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 12, 3 },
                    { 60, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 12, 3 },
                    { 61, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 13, 3 },
                    { 62, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 13, 3 },
                    { 63, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 13, 3 },
                    { 64, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 13, 3 },
                    { 65, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 13, 3 },
                    { 66, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 14, 3 },
                    { 67, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 14, 3 },
                    { 68, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 14, 3 },
                    { 69, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 14, 3 },
                    { 70, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 14, 3 },
                    { 71, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 15, 4 },
                    { 72, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 15, 4 },
                    { 73, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 15, 4 },
                    { 74, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 15, 4 },
                    { 75, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 15, 4 },
                    { 76, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 16, 4 },
                    { 77, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 16, 4 },
                    { 78, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 16, 4 },
                    { 79, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 16, 4 },
                    { 80, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 16, 4 },
                    { 81, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 17, 4 },
                    { 82, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 17, 4 },
                    { 83, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 17, 4 },
                    { 84, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 17, 4 },
                    { 85, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 17, 4 },
                    { 86, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 18, 4 },
                    { 87, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 18, 4 },
                    { 88, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 18, 4 },
                    { 89, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 18, 4 },
                    { 90, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 18, 4 },
                    { 91, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 19, 4 },
                    { 92, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 19, 4 },
                    { 93, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 19, 4 },
                    { 94, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 19, 4 },
                    { 95, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 19, 4 },
                    { 96, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 20, 4 },
                    { 97, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 20, 4 },
                    { 98, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 20, 4 },
                    { 99, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 20, 4 },
                    { 100, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 20, 4 },
                    { 101, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 21, 4 },
                    { 102, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 21, 4 },
                    { 103, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 21, 4 },
                    { 104, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 21, 4 },
                    { 105, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 21, 4 },
                    { 106, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 22, 4 },
                    { 107, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 22, 4 },
                    { 108, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 22, 4 },
                    { 109, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 22, 4 },
                    { 110, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 22, 4 },
                    { 111, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 23, 4 },
                    { 112, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 23, 4 },
                    { 113, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 23, 4 },
                    { 114, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 23, 4 },
                    { 115, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 23, 4 },
                    { 116, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 24, 4 },
                    { 117, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 24, 4 },
                    { 118, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 24, 4 },
                    { 119, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 24, 4 },
                    { 120, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 24, 4 },
                    { 121, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 25, 4 },
                    { 122, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 25, 4 },
                    { 123, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 25, 4 },
                    { 124, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 25, 4 },
                    { 125, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 25, 4 },
                    { 126, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 26, 4 },
                    { 127, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 26, 4 },
                    { 128, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 26, 4 },
                    { 129, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 26, 4 },
                    { 130, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 26, 4 },
                    { 131, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 27, 4 },
                    { 132, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 27, 4 },
                    { 133, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 27, 4 },
                    { 134, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 27, 4 },
                    { 135, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 27, 4 },
                    { 136, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 28, 4 },
                    { 137, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 28, 4 },
                    { 138, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 28, 4 },
                    { 139, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 28, 4 },
                    { 140, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 28, 4 },
                    { 141, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 29, 4 },
                    { 142, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 29, 4 },
                    { 143, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 29, 4 },
                    { 144, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 29, 4 },
                    { 145, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 29, 4 },
                    { 146, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 30, 4 },
                    { 147, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 30, 4 },
                    { 148, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 30, 4 },
                    { 149, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 30, 4 },
                    { 150, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 30, 4 },
                    { 151, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 31, 4 },
                    { 152, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 31, 4 },
                    { 153, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 31, 4 },
                    { 154, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 31, 4 },
                    { 155, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 31, 4 },
                    { 156, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 32, 4 },
                    { 157, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 32, 4 },
                    { 158, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 32, 4 },
                    { 159, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 32, 4 },
                    { 160, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 32, 4 },
                    { 161, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 33, 5 },
                    { 162, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 33, 5 },
                    { 163, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 33, 5 },
                    { 164, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 33, 5 },
                    { 165, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 33, 5 },
                    { 166, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 34, 5 },
                    { 167, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 34, 5 },
                    { 168, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 34, 5 },
                    { 169, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 34, 5 },
                    { 170, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 34, 5 },
                    { 171, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 35, 5 },
                    { 172, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 35, 5 },
                    { 173, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 35, 5 },
                    { 174, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 35, 5 },
                    { 175, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 35, 5 },
                    { 176, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 36, 5 },
                    { 177, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 36, 5 },
                    { 178, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 36, 5 },
                    { 179, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 36, 5 },
                    { 180, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 36, 5 },
                    { 181, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 37, 5 },
                    { 182, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 37, 5 },
                    { 183, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 37, 5 },
                    { 184, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 37, 5 },
                    { 185, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 37, 5 },
                    { 186, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 38, 5 },
                    { 187, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 38, 5 },
                    { 188, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 38, 5 },
                    { 189, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 38, 5 },
                    { 190, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 38, 5 },
                    { 191, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 39, 5 },
                    { 192, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 39, 5 },
                    { 193, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 39, 5 },
                    { 194, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 39, 5 },
                    { 195, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 39, 5 },
                    { 196, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 40, 5 },
                    { 197, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 40, 5 },
                    { 198, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 40, 5 },
                    { 199, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 40, 5 },
                    { 200, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 40, 5 },
                    { 201, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 41, 5 },
                    { 202, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 41, 5 },
                    { 203, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 41, 5 },
                    { 204, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 41, 5 },
                    { 205, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 41, 5 },
                    { 206, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 42, 5 },
                    { 207, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 42, 5 },
                    { 208, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 42, 5 },
                    { 209, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 42, 5 },
                    { 210, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 42, 5 },
                    { 211, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 43, 5 },
                    { 212, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 43, 5 },
                    { 213, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 43, 5 },
                    { 214, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 43, 5 },
                    { 215, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 43, 5 },
                    { 216, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 44, 5 },
                    { 217, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 44, 5 },
                    { 218, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 44, 5 },
                    { 219, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 44, 5 },
                    { 220, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 44, 5 },
                    { 221, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 45, 5 },
                    { 222, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 45, 5 },
                    { 223, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 45, 5 },
                    { 224, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 45, 5 },
                    { 225, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 45, 5 },
                    { 226, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 46, 5 },
                    { 227, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 46, 5 },
                    { 228, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 46, 5 },
                    { 229, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 46, 5 },
                    { 230, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 46, 5 },
                    { 231, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 47, 5 },
                    { 232, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 47, 5 },
                    { 233, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 47, 5 },
                    { 234, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 47, 5 },
                    { 235, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 47, 5 },
                    { 236, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 48, 5 },
                    { 237, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 48, 5 },
                    { 238, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 48, 5 },
                    { 239, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 48, 5 },
                    { 240, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 48, 5 },
                    { 241, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 49, 5 },
                    { 242, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 49, 5 },
                    { 243, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 49, 5 },
                    { 244, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 49, 5 },
                    { 245, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 49, 5 },
                    { 246, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 50, 5 },
                    { 247, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 50, 5 },
                    { 248, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 50, 5 },
                    { 249, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 50, 5 },
                    { 250, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 50, 5 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Dokumenty_LekarzId",
                table: "Dokumenty",
                column: "LekarzId");

            migrationBuilder.CreateIndex(
                name: "IX_Dokumenty_PacjentId_DataUtworzenia",
                table: "Dokumenty",
                columns: new[] { "PacjentId", "DataUtworzenia" });

            migrationBuilder.CreateIndex(
                name: "IX_Dokumenty_WizytaId",
                table: "Dokumenty",
                column: "WizytaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Dokumenty");

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 36);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 40);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 41);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 42);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 43);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 44);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 45);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 46);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 47);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 48);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 49);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 50);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 51);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 52);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 53);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 54);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 55);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 56);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 57);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 58);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 59);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 60);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 61);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 62);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 63);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 64);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 65);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 66);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 67);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 68);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 69);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 70);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 71);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 72);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 73);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 74);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 75);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 76);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 77);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 78);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 79);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 80);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 81);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 82);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 83);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 84);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 85);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 86);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 87);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 88);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 89);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 90);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 91);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 92);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 93);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 94);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 95);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 96);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 97);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 98);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 99);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 100);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 101);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 102);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 103);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 104);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 105);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 106);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 107);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 108);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 109);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 110);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 111);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 112);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 113);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 114);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 115);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 116);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 117);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 118);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 119);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 120);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 121);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 122);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 123);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 124);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 125);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 126);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 127);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 128);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 129);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 130);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 131);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 132);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 133);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 134);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 135);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 136);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 137);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 138);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 139);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 140);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 141);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 142);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 143);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 144);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 145);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 146);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 147);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 148);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 149);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 150);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 151);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 152);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 153);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 154);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 155);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 156);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 157);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 158);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 159);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 160);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 161);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 162);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 163);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 164);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 165);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 166);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 167);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 168);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 169);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 170);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 171);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 172);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 173);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 174);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 175);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 176);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 177);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 178);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 179);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 180);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 181);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 182);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 183);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 184);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 185);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 186);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 187);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 188);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 189);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 190);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 191);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 192);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 193);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 194);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 195);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 196);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 197);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 198);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 199);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 200);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 201);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 202);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 203);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 204);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 205);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 206);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 207);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 208);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 209);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 210);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 211);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 212);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 213);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 214);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 215);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 216);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 217);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 218);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 219);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 220);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 221);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 222);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 223);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 224);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 225);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 226);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 227);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 228);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 229);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 230);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 231);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 232);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 233);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 234);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 235);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 236);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 237);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 238);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 239);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 240);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 241);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 242);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 243);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 244);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 245);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 246);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 247);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 248);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 249);

            migrationBuilder.DeleteData(
                table: "GodzinyPracyLekarzy",
                keyColumn: "Id",
                keyValue: 250);
        }
    }
}
