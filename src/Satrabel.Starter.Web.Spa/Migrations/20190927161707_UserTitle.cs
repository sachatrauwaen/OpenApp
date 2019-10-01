using Microsoft.EntityFrameworkCore.Migrations;

namespace Satrabel.OpenApp.Migrations
{
    public partial class UserTitle : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "AbpUsers",
                maxLength: 256,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "AbpUsers");
        }
    }
}
