using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Alimed.Migrations
{
    [DbContext(typeof(API.Alimed.Data.AppDbContext))]
    [Migration("20260120123000_AddZawartoscToDokumenty")]
    public partial class AddZawartoscToDokumenty : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "Zawartosc",
                table: "Dokumenty",
                type: "longblob",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TypMime",
                table: "Dokumenty",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Zawartosc",
                table: "Dokumenty");

            migrationBuilder.DropColumn(
                name: "TypMime",
                table: "Dokumenty");
        }
    }
}
