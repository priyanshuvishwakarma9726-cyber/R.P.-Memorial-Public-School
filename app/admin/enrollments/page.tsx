import type { Metadata } from "next";
import EnrollmentsView from "@/components/admin/EnrollmentsView";

export const metadata: Metadata = {
  title: "Student Enrollments | Admin Control Center",
  description: "Manage student enrollments across academic years, classes, and sections for R.P. Memorial Public School.",
};

export default function EnrollmentsPage() {
  return <EnrollmentsView />;
}
