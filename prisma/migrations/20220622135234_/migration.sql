-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "CompanyID" INTEGER,
    "LeadName" TEXT NOT NULL,
    CONSTRAINT "Team_CompanyID_fkey" FOREIGN KEY ("CompanyID") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("CompanyID", "LeadName", "id") SELECT "CompanyID", "LeadName", "id" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
