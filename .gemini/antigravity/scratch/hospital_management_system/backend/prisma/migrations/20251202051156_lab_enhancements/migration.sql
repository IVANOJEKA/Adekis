/*
  Warnings:

  - You are about to drop the column `investigations` on the `ANCVisit` table. All the data in the column will be lost.
  - You are about to drop the column `medications` on the `ANCVisit` table. All the data in the column will be lost.
  - The `fundalHeight` column on the `ANCVisit` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `admissionDate` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `bloodLoss` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `laborDuration` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `lmp` on the `MaternityPatient` table. All the data in the column will be lost.
  - You are about to drop the column `birthLength` on the `Newborn` table. All the data in the column will be lost.
  - You are about to drop the column `birthWeight` on the `Newborn` table. All the data in the column will be lost.
  - You are about to drop the column `complications` on the `Newborn` table. All the data in the column will be lost.
  - You are about to drop the column `headCircumference` on the `Newborn` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Newborn` table. All the data in the column will be lost.
  - You are about to drop the column `breastfeedingStatus` on the `PNCVisit` table. All the data in the column will be lost.
  - You are about to drop the column `familyPlanningAdvice` on the `PNCVisit` table. All the data in the column will be lost.
  - You are about to drop the column `maternalCondition` on the `PNCVisit` table. All the data in the column will be lost.
  - You are about to drop the column `nextVisitDate` on the `PNCVisit` table. All the data in the column will be lost.
  - You are about to drop the column `visitNumber` on the `PNCVisit` table. All the data in the column will be lost.
  - Added the required column `weight` to the `Newborn` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ANCVisit_visitDate_idx";

-- DropIndex
DROP INDEX "Delivery_deliveryDate_idx";

-- DropIndex
DROP INDEX "MaternityPatient_status_idx";

-- DropIndex
DROP INDEX "PNCVisit_visitDate_idx";

-- AlterTable
ALTER TABLE "ANCVisit" DROP COLUMN "investigations",
DROP COLUMN "medications",
DROP COLUMN "fundalHeight",
ADD COLUMN     "fundalHeight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "admissionDate",
DROP COLUMN "bloodLoss",
DROP COLUMN "laborDuration",
ALTER COLUMN "deliveryDate" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "LabTest" ADD COLUMN     "accessLog" JSONB,
ADD COLUMN     "orderedByRole" TEXT,
ADD COLUMN     "printedAt" TIMESTAMP(3),
ADD COLUMN     "printedBy" TEXT,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'Normal',
ADD COLUMN     "resultsValidatedAt" TIMESTAMP(3),
ADD COLUMN     "resultsValidatedBy" TEXT;

-- AlterTable
ALTER TABLE "MaternityPatient" DROP COLUMN "lmp",
ALTER COLUMN "bloodGroup" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Newborn" DROP COLUMN "birthLength",
DROP COLUMN "birthWeight",
DROP COLUMN "complications",
DROP COLUMN "headCircumference",
DROP COLUMN "name",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Healthy';

-- AlterTable
ALTER TABLE "PNCVisit" DROP COLUMN "breastfeedingStatus",
DROP COLUMN "familyPlanningAdvice",
DROP COLUMN "maternalCondition",
DROP COLUMN "nextVisitDate",
DROP COLUMN "visitNumber",
ADD COLUMN     "babyCondition" TEXT,
ADD COLUMN     "motherCondition" TEXT;

-- CreateTable
CREATE TABLE "LabInventory" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "minimumLevel" INTEGER NOT NULL,
    "supplier" TEXT,
    "expiryDate" TIMESTAMP(3),
    "costPerUnit" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabInventoryTransaction" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LabInventoryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TriageRecord" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "visitId" TEXT,
    "vitals" JSONB NOT NULL,
    "chiefComplaint" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Normal',
    "notes" TEXT,
    "nurseId" TEXT NOT NULL,
    "nurseName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Completed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TriageRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LabInventory_itemCode_key" ON "LabInventory"("itemCode");

-- CreateIndex
CREATE INDEX "LabInventory_hospitalId_idx" ON "LabInventory"("hospitalId");

-- CreateIndex
CREATE INDEX "LabInventory_itemCode_idx" ON "LabInventory"("itemCode");

-- CreateIndex
CREATE INDEX "LabInventory_category_idx" ON "LabInventory"("category");

-- CreateIndex
CREATE INDEX "LabInventoryTransaction_hospitalId_idx" ON "LabInventoryTransaction"("hospitalId");

-- CreateIndex
CREATE INDEX "LabInventoryTransaction_inventoryId_idx" ON "LabInventoryTransaction"("inventoryId");

-- CreateIndex
CREATE INDEX "TriageRecord_hospitalId_idx" ON "TriageRecord"("hospitalId");

-- CreateIndex
CREATE INDEX "TriageRecord_patientId_idx" ON "TriageRecord"("patientId");

-- CreateIndex
CREATE INDEX "TriageRecord_createdAt_idx" ON "TriageRecord"("createdAt");

-- CreateIndex
CREATE INDEX "LabTest_status_idx" ON "LabTest"("status");

-- CreateIndex
CREATE INDEX "LabTest_priority_idx" ON "LabTest"("priority");

-- AddForeignKey
ALTER TABLE "LabInventory" ADD CONSTRAINT "LabInventory_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabInventoryTransaction" ADD CONSTRAINT "LabInventoryTransaction_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabInventoryTransaction" ADD CONSTRAINT "LabInventoryTransaction_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "LabInventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaternityPatient" ADD CONSTRAINT "MaternityPatient_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriageRecord" ADD CONSTRAINT "TriageRecord_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriageRecord" ADD CONSTRAINT "TriageRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
