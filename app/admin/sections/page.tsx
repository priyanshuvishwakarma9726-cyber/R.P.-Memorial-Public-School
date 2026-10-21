import type { Metadata } from "next";
import SectionsView from "@/components/admin/SectionsView";

export const metadata: Metadata = {
  title: "Section Management | Admin Control Center",
  description: "Configure sections with class-bound unique naming for R.P. Memorial Public School.",
};

export default function SectionsPage() {
  return <SectionsView />;
}
