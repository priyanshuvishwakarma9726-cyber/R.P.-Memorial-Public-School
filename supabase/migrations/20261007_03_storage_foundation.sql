-- =====================================================================
-- R.P. MEMORIAL PUBLIC SCHOOL — STORAGE BUCKET ARCHITECTURE & RLS
-- Migration: 20261007_03_storage_foundation.sql
-- =====================================================================

-- 1. CREATE STORAGE BUCKETS
-- Public Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('public-assets', 'public-assets', true),
  ('gallery', 'gallery', true),
  ('notices', 'notices', true)
ON CONFLICT (id) DO NOTHING;

-- Private / Sensitive Buckets (STRICTLY PRIVATE: public = false)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('student-documents', 'student-documents', false),
  ('admission-documents', 'admission-documents', false),
  ('faculty-assets', 'faculty-assets', false),
  ('report-cards', 'report-cards', false)
ON CONFLICT (id) DO NOTHING;

-- 2. STORAGE RLS POLICIES (on storage.objects)

-- A. PUBLIC BUCKETS READ ACCESS
CREATE POLICY "Storage: Public Read Access"
ON storage.objects FOR SELECT
USING (
    bucket_id IN ('public-assets', 'gallery', 'notices')
);

-- B. ADMIN FULL CONTROL ON ALL BUCKETS
CREATE POLICY "Storage: Admin Full Control"
ON storage.objects FOR ALL
USING (
    bucket_id IN (
        'public-assets', 'gallery', 'notices',
        'student-documents', 'admission-documents',
        'faculty-assets', 'report-cards'
    )
    AND public.is_admin_or_principal()
);

-- C. STUDENT DOCUMENTS: Private access for verified owner student or linked parent
CREATE POLICY "Storage: Student Document Access"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'student-documents'
    AND (
        -- Student matches path prefix (e.g., student-id/file.pdf)
        (storage.foldername(name))[1] = auth.uid()::text
        OR EXISTS (
            SELECT 1 FROM public.student_parents sp
            JOIN public.parents p ON p.id = sp.parent_id
            JOIN public.students s ON s.id = sp.student_id
            WHERE p.profile_id = auth.uid()
              AND s.profile_id::text = (storage.foldername(name))[1]
        )
    )
);

-- D. REPORT CARDS: Private access for verified owner student or linked parent
CREATE POLICY "Storage: Report Cards Access"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'report-cards'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR EXISTS (
            SELECT 1 FROM public.student_parents sp
            JOIN public.parents p ON p.id = sp.parent_id
            JOIN public.students s ON s.id = sp.student_id
            WHERE p.profile_id = auth.uid()
              AND s.profile_id::text = (storage.foldername(name))[1]
        )
    )
);

-- E. FACULTY ASSETS: Private access for staff/faculty
CREATE POLICY "Storage: Faculty Asset Access"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'faculty-assets'
    AND public.is_school_staff_or_teacher()
);
