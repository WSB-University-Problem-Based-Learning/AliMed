using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Alimed.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminSeedAndAdminTools : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: new Guid("a0000000-0000-0000-0000-000000000001"),
                columns: new[] { "Email", "PasswordHash", "PasswordSalt" },
                values: new object[] { "admin_alimed", "+vh4KTHWlJkQCfFV5mqYitJZMdjRN7NfLpQAksOX/Lw=", "j/mq42W01uUykBVkWe/PBw==" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: new Guid("a0000000-0000-0000-0000-000000000001"),
                columns: new[] { "Email", "PasswordHash", "PasswordSalt" },
                values: new object[] { null, null, null });
        }
    }
}
