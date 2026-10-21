import type { Metadata } from "next";
import AcademicYearsView from "@/components/admin/AcademicYearsView";

export const metadata: Metadata = {
  title: "Academic Years Management | Admin Control Center",
  description: "Configure academic sessions and enforce single active session for R.P. Memorial Public School.",
};

export default function AcademicYearsPage() {
  return <AcademicYearsView />;
}
