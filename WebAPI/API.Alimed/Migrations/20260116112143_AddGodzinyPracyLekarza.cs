using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Alimed.Migrations
{
    /// <inheritdoc />
    public partial class AddGodzinyPracyLekarza : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lekarze_Placowki_PlacowkaId",
                table: "Lekarze");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Lekarze",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateTable(
                name: "GodzinyPracyLekarzy",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    LekarzId = table.Column<int>(type: "int", nullable: false),
                    PlacowkaId = table.Column<int>(type: "int", nullable: false),
                    DzienTygodnia = table.Column<int>(type: "int", nullable: false),
                    GodzinaOd = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    GodzinaDo = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    CzasWizytyMinuty = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GodzinyPracyLekarzy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GodzinyPracyLekarzy_Lekarze_LekarzId",
                        column: x => x.LekarzId,
                        principalTable: "Lekarze",
                        principalColumn: "LekarzId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GodzinyPracyLekarzy_Placowki_PlacowkaId",
                        column: x => x.PlacowkaId,
                        principalTable: "Placowki",
                        principalColumn: "PlacowkaId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "GodzinyPracyLekarzy",
                columns: new[] { "Id", "CzasWizytyMinuty", "DzienTygodnia", "GodzinaDo", "GodzinaOd", "LekarzId", "PlacowkaId" },
                values: new object[,]
                {
                    { 1, 30, 1, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 1, 1 },
                    { 2, 30, 2, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 1, 1 },
                    { 3, 30, 3, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 1, 1 },
                    { 4, 30, 4, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 1, 1 },
                    { 5, 30, 5, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), 1, 1 }
                });

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 1,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 2,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 3,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 4,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 5,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 6,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 7,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 8,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 9,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 10,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 11,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 12,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 13,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 14,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 15,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 16,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 17,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 18,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 19,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 20,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 21,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 22,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 23,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 24,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 25,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 26,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 27,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 28,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 29,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 30,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 31,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 32,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 33,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 34,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 35,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 36,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 37,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 38,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 39,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 40,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 41,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 42,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 43,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 44,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 45,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 46,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 47,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 48,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 49,
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Lekarze",
                keyColumn: "LekarzId",
                keyValue: 50,
                column: "UserId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_Lekarze_UserId",
                table: "Lekarze",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GodzinyPracyLekarzy_LekarzId",
                table: "GodzinyPracyLekarzy",
                column: "LekarzId");

            migrationBuilder.CreateIndex(
                name: "IX_GodzinyPracyLekarzy_PlacowkaId",
                table: "GodzinyPracyLekarzy",
                column: "PlacowkaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lekarze_Placowki_PlacowkaId",
                table: "Lekarze",
                column: "PlacowkaId",
                principalTable: "Placowki",
                principalColumn: "PlacowkaId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Lekarze_Users_UserId",
                table: "Lekarze",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lekarze_Placowki_PlacowkaId",
                table: "Lekarze");

            migrationBuilder.DropForeignKey(
                name: "FK_Lekarze_Users_UserId",
                table: "Lekarze");

            migrationBuilder.DropTable(
                name: "GodzinyPracyLekarzy");

            migrationBuilder.DropIndex(
                name: "IX_Lekarze_UserId",
                table: "Lekarze");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Lekarze");

            migrationBuilder.AddForeignKey(
                name: "FK_Lekarze_Placowki_PlacowkaId",
                table: "Lekarze",
                column: "PlacowkaId",
                principalTable: "Placowki",
                principalColumn: "PlacowkaId");
        }
    }
}
