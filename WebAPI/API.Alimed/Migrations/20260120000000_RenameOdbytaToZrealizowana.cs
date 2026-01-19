using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Alimed.Migrations
{
    /// <inheritdoc />
    public partial class RenameOdbytaToZrealizowana : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // This migration updates data but the enum value in code has already changed
            // The Status column stores integer values (0=Zaplanowana, 1=Odbyta/Zrealizowana, 2=Anulowana, 3=Nieobecnosc)
            // Since we're only renaming the enum value in C# code, no database changes are needed
            // The integer value 1 will now represent "Zrealizowana" instead of "Odbyta"
            // No SQL changes required - this is a code-level rename only
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // No database changes to revert
        }
    }
}
