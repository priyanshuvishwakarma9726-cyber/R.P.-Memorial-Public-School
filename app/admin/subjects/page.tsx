import type { Metadata } from "next";
import SubjectsView from "@/components/admin/SubjectsView";

export const metadata: Metadata = {
  title: "Subject Catalog | Admin Control Center",
  description: "Curriculum subject catalog and unique subject code management for R.P. Memorial Public School.",
};

export default function SubjectsPage() {
  return <SubjectsView />;
}
