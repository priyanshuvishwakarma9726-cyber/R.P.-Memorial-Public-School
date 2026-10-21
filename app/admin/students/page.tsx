import AdminHeader from "@/components/admin/AdminHeader";
import StudentsManagementView from "@/components/admin/StudentsManagementView";
import { getStudentsList, getParentsList } from "@/lib/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const [studRes, parRes] = await Promise.all([
    getStudentsList(),
    getParentsList(),
  ]);

  return (
    <>
      <AdminHeader
        title="Student Management"
        subtitle="Manage registered students, enrollment records, and parent/guardian relationships."
      />

      <main style={{ padding: "1.75rem", flex: 1 }}>
        <StudentsManagementView
          initialStudents={studRes.students || []}
          initialParents={parRes.parents || []}
          initialLinkages={studRes.linkages || []}
        />
      </main>
    </>
  );
}
