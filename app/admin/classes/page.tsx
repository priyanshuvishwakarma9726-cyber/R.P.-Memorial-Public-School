import type { Metadata } from "next";
import ClassesView from "@/components/admin/ClassesView";

export const metadata: Metadata = {
  title: "Class Management | Admin Control Center",
  description: "Configure classes, ordering, and archive settings for R.P. Memorial Public School.",
};

export default function ClassesPage() {
  return <ClassesView />;
}
