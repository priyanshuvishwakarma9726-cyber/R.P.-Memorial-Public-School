import type { Metadata } from "next";
import StudentHistoryView from "@/components/admin/StudentHistoryView";

export const metadata: Metadata = {
  title: "Student Academic History | Admin Control Center",
  description: "Chronological academic history timeline and enrollment records for R.P. Memorial Public School.",
};

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <StudentHistoryView studentId={resolvedParams.id} />;
}
