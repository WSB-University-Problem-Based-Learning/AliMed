using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Alimed.Migrations
{
    /// <inheritdoc />
    public partial class Zmiany11122025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ZaleceniaDokument");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ZaleceniaDokument",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    DataUtworzenia = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    NazwaPliku = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PacjentId = table.Column<int>(type: "int", nullable: true),
                    ZawartoscPliku = table.Column<byte[]>(type: "longblob", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZaleceniaDokument", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ZaleceniaDokument_Pacjenci_PacjentId",
                        column: x => x.PacjentId,
                        principalTable: "Pacjenci",
                        principalColumn: "PacjentId");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ZaleceniaDokument_PacjentId",
                table: "ZaleceniaDokument",
                column: "PacjentId");
        }
    }
}
