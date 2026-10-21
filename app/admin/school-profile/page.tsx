import AdminHeader from "@/components/admin/AdminHeader";
import SchoolProfileView from "@/components/admin/SchoolProfileView";
import { getSchoolProfile } from "@/lib/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminSchoolProfilePage() {
  const res = await getSchoolProfile();
  const school = res.school as any;
  const canEdit = res.canEdit ?? false;

  return (
    <>
      <AdminHeader
        title="Institutional School Profile"
        subtitle="Manage verified identity, contact details, and institutional branding."
      />

      <main style={{ padding: "1.75rem", flex: 1 }}>
        <SchoolProfileView school={school} canEdit={canEdit} />
      </main>
    </>
  );
}
