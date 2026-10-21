import type { Metadata } from "next";
import AcademicsOverviewView from "@/components/admin/AcademicsOverviewView";

export const metadata: Metadata = {
  title: "Academic Structure Dashboard | Admin Control Center",
  description: "Academic year management, class hierarchy, curriculum, and enrollment analytics for R.P. Memorial Public School.",
};

export default function AcademicsPage() {
  return <AcademicsOverviewView />;
}
