-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_levelId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherCourse" DROP CONSTRAINT "TeacherCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherCourse" DROP CONSTRAINT "TeacherCourse_teacherId_fkey";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherCourse" ADD CONSTRAINT "TeacherCourse_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherCourse" ADD CONSTRAINT "TeacherCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
