using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Satrabel.OpenApp.Migrations
{
    public partial class Pages3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CmsModule",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    ExtensionData = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CmsModule", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CmsPage",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false),
                    TenantId = table.Column<int>(nullable: false),
                    ExtensionData = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CmsPage", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ModuleTranslations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    CoreId = table.Column<int>(nullable: false),
                    Language = table.Column<string>(maxLength: 5, nullable: true),
                    Title = table.Column<string>(maxLength: 256, nullable: true),
                    ExtensionData = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ModuleTranslations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ModuleTranslations_CmsModule_CoreId",
                        column: x => x.CoreId,
                        principalTable: "CmsModule",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CmsPageModule",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    PageId = table.Column<int>(nullable: false),
                    ModuleId = table.Column<int>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false),
                    ExtensionData = table.Column<string>(nullable: true),
                    PaneName = table.Column<string>(nullable: true),
                    ModuleOrder = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CmsPageModule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CmsPageModule_CmsModule_ModuleId",
                        column: x => x.ModuleId,
                        principalTable: "CmsModule",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CmsPageModule_CmsPage_PageId",
                        column: x => x.PageId,
                        principalTable: "CmsPage",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PageTranslations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    CoreId = table.Column<int>(nullable: false),
                    Language = table.Column<string>(maxLength: 5, nullable: true),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    Slug = table.Column<string>(maxLength: 20, nullable: true),
                    ExtensionData = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageTranslations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PageTranslations_CmsPage_CoreId",
                        column: x => x.CoreId,
                        principalTable: "CmsPage",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CmsPageModule_ModuleId",
                table: "CmsPageModule",
                column: "ModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_CmsPageModule_PageId",
                table: "CmsPageModule",
                column: "PageId");

            migrationBuilder.CreateIndex(
                name: "IX_ModuleTranslations_CoreId",
                table: "ModuleTranslations",
                column: "CoreId");

            migrationBuilder.CreateIndex(
                name: "IX_PageTranslations_CoreId",
                table: "PageTranslations",
                column: "CoreId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CmsPageModule");

            migrationBuilder.DropTable(
                name: "ModuleTranslations");

            migrationBuilder.DropTable(
                name: "PageTranslations");

            migrationBuilder.DropTable(
                name: "CmsModule");

            migrationBuilder.DropTable(
                name: "CmsPage");
        }
    }
}
