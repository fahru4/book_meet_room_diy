/*
  Warnings:

  - You are about to drop the column `endTime` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `bookings` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `status` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - Added the required column `end_time` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "bookings_room_id_status_startTime_endTime_idx";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "end_time" TIMESTAMPTZ(3) NOT NULL,
ADD COLUMN     "start_time" TIMESTAMPTZ(3) NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "status" SET DATA TYPE VARCHAR(20);

-- CreateIndex
CREATE INDEX "bookings_room_id_status_start_time_end_time_idx" ON "bookings"("room_id", "status", "start_time", "end_time");
