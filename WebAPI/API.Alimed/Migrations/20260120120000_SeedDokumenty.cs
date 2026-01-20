using System;
using API.Alimed.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Alimed.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260120120000_SeedDokumenty")]
    public partial class SeedDokumenty : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Dokumenty",
                columns: new[] { "DokumentId", "NazwaPliku", "TypDokumentu", "Opis", "DataUtworzenia", "RozmiarPliku", "WizytaId", "PacjentId", "LekarzId" },
                values: new object[] { 100000, "przyklad.pdf", "Inny", "Przykładowy dokument", new DateTime(2026, 1, 20, 0, 0, 0, DateTimeKind.Utc), 123L, 1, 1, 1 }
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Dokumenty",
                keyColumn: "DokumentId",
                keyValue: 100000
            );
        }
    }
}
