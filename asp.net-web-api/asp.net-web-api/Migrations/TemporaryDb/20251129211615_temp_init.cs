using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace asp.net_web_api.Migrations.TemporaryDb
{
    /// <inheritdoc />
    public partial class temp_init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Logs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Text = table.Column<string>(type: "TEXT", nullable: false),
                    RecordedTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Important = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Logs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WebVisits",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    LongitudeCoord = table.Column<double>(type: "REAL", nullable: true),
                    LatitudeCoord = table.Column<double>(type: "REAL", nullable: true),
                    RecordedTime = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebVisits", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Logs");

            migrationBuilder.DropTable(
                name: "WebVisits");
        }
    }
}
