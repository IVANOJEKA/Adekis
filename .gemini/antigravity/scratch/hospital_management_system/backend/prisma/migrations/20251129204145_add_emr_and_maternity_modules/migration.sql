/*
  Warnings:

  - You are about to drop the column `notes` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `recordDate` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `recordedBy` on the `MedicalRecord` table. All the data in the column will be lost.
  - The `attachments` column on the `MedicalRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `description` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorId` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorName` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalId` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_patientId_fkey";

-- DropIndex
DROP INDEX "MedicalRecord_recordDate_idx";

-- AlterTable
ALTER TABLE "MedicalRecord" DROP COLUMN "notes",
DROP COLUMN "recordDate",
DROP COLUMN "recordedBy",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "doctorId" TEXT NOT NULL,
ADD COLUMN     "doctorName" TEXT NOT NULL,
ADD COLUMN     "hospitalId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "vitals" JSONB,
DROP COLUMN "attachments",
ADD COLUMN     "attachments" JSONB;

-- CreateTable
CREATE TABLE "ClinicalNote" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "noteType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorRole" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaternityPatient" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "lmp" TIMESTAMP(3) NOT NULL,
    "edd" TIMESTAMP(3) NOT NULL,
    "gravida" INTEGER NOT NULL,
    "para" INTEGER NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL DEFAULT 'Low',
    "status" TEXT NOT NULL DEFAULT 'Antenatal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaternityPatient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ANCVisit" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "maternityPatientId" TEXT NOT NULL,
    "visitNumber" INTEGER NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gestationalAge" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION,
    "bloodPressure" TEXT,
    "fundalHeight" TEXT,
    "fetalHeartRate" INTEGER,
    "complaints" TEXT,
    "examination" TEXT,
    "investigations" JSONB,
    "medications" JSONB,
    "nextVisitDate" TIMESTAMP(3),
    "attendedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ANCVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "maternityPatientId" TEXT NOT NULL,
    "admissionDate" TIMESTAMP(3) NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "deliveryType" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "laborDuration" INTEGER,
    "complications" TEXT,
    "bloodLoss" INTEGER,
    "attendedBy" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newborn" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "name" TEXT,
    "gender" TEXT NOT NULL,
    "birthWeight" DOUBLE PRECISION NOT NULL,
    "birthLength" DOUBLE PRECISION,
    "headCircumference" DOUBLE PRECISION,
    "apgarScore1" INTEGER,
    "apgarScore5" INTEGER,
    "complications" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Stable',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newborn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PNCVisit" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "maternityPatientId" TEXT NOT NULL,
    "visitNumber" INTEGER NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "daysPostpartum" INTEGER NOT NULL,
    "maternalCondition" TEXT,
    "breastfeedingStatus" TEXT,
    "familyPlanningAdvice" TEXT,
    "complications" TEXT,
    "attendedBy" TEXT NOT NULL,
    "nextVisitDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PNCVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClinicalNote_hospitalId_idx" ON "ClinicalNote"("hospitalId");

-- CreateIndex
CREATE INDEX "ClinicalNote_patientId_idx" ON "ClinicalNote"("patientId");

-- CreateIndex
CREATE INDEX "ClinicalNote_date_idx" ON "ClinicalNote"("date");

-- CreateIndex
CREATE UNIQUE INDEX "MaternityPatient_patientId_key" ON "MaternityPatient"("patientId");

-- CreateIndex
CREATE INDEX "MaternityPatient_hospitalId_idx" ON "MaternityPatient"("hospitalId");

-- CreateIndex
CREATE INDEX "MaternityPatient_patientId_idx" ON "MaternityPatient"("patientId");

-- CreateIndex
CREATE INDEX "MaternityPatient_status_idx" ON "MaternityPatient"("status");

-- CreateIndex
CREATE INDEX "ANCVisit_hospitalId_idx" ON "ANCVisit"("hospitalId");

-- CreateIndex
CREATE INDEX "ANCVisit_maternityPatientId_idx" ON "ANCVisit"("maternityPatientId");

-- CreateIndex
CREATE INDEX "ANCVisit_visitDate_idx" ON "ANCVisit"("visitDate");

-- CreateIndex
CREATE INDEX "Delivery_hospitalId_idx" ON "Delivery"("hospitalId");

-- CreateIndex
CREATE INDEX "Delivery_maternityPatientId_idx" ON "Delivery"("maternityPatientId");

-- CreateIndex
CREATE INDEX "Delivery_deliveryDate_idx" ON "Delivery"("deliveryDate");

-- CreateIndex
CREATE INDEX "Newborn_hospitalId_idx" ON "Newborn"("hospitalId");

-- CreateIndex
CREATE INDEX "Newborn_deliveryId_idx" ON "Newborn"("deliveryId");

-- CreateIndex
CREATE INDEX "PNCVisit_hospitalId_idx" ON "PNCVisit"("hospitalId");

-- CreateIndex
CREATE INDEX "PNCVisit_maternityPatientId_idx" ON "PNCVisit"("maternityPatientId");

-- CreateIndex
CREATE INDEX "PNCVisit_visitDate_idx" ON "PNCVisit"("visitDate");

-- CreateIndex
CREATE INDEX "MedicalRecord_hospitalId_idx" ON "MedicalRecord"("hospitalId");

-- CreateIndex
CREATE INDEX "MedicalRecord_doctorId_idx" ON "MedicalRecord"("doctorId");

-- CreateIndex
CREATE INDEX "MedicalRecord_date_idx" ON "MedicalRecord"("date");

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNote" ADD CONSTRAINT "ClinicalNote_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaternityPatient" ADD CONSTRAINT "MaternityPatient_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ANCVisit" ADD CONSTRAINT "ANCVisit_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ANCVisit" ADD CONSTRAINT "ANCVisit_maternityPatientId_fkey" FOREIGN KEY ("maternityPatientId") REFERENCES "MaternityPatient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_maternityPatientId_fkey" FOREIGN KEY ("maternityPatientId") REFERENCES "MaternityPatient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Newborn" ADD CONSTRAINT "Newborn_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Newborn" ADD CONSTRAINT "Newborn_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PNCVisit" ADD CONSTRAINT "PNCVisit_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PNCVisit" ADD CONSTRAINT "PNCVisit_maternityPatientId_fkey" FOREIGN KEY ("maternityPatientId") REFERENCES "MaternityPatient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
