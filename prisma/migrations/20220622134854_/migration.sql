-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "CompanyID" INTEGER NOT NULL,
    "LeadName" TEXT NOT NULL
);
INSERT INTO "new_Team" ("CompanyID", "LeadName", "id") SELECT "CompanyID", "LeadName", "id" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
