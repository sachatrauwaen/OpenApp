using Microsoft.EntityFrameworkCore.Migrations;

namespace Satrabel.OpenApp.Migrations
{
    public partial class PageParent : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentId",
                table: "CmsPage",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CmsPage_ParentId",
                table: "CmsPage",
                column: "ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_CmsPage_CmsPage_ParentId",
                table: "CmsPage",
                column: "ParentId",
                principalTable: "CmsPage",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CmsPage_CmsPage_ParentId",
                table: "CmsPage");

            migrationBuilder.DropIndex(
                name: "IX_CmsPage_ParentId",
                table: "CmsPage");

            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "CmsPage");
        }
    }
}
