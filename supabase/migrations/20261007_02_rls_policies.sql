-- =====================================================================
-- R.P. MEMORIAL PUBLIC SCHOOL — ROW LEVEL SECURITY POLICIES
-- Migration: 20261007_02_rls_policies.sql
-- =====================================================================

-- 1. SECURITY DEFINER HELPER FUNCTIONS
-- These prevent recursion and ensure role lookups are authenticated securely.

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role TEXT;
BEGIN
    SELECT role INTO v_role
    FROM public.profiles
    WHERE id = auth.uid() AND status = 'active';
    RETURN v_role;
END;
$$;

CREATE OR REPLACE FUNCTION public.current_user_school_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_school_id UUID;
BEGIN
    SELECT school_id INTO v_school_id
    FROM public.profiles
    WHERE id = auth.uid() AND status = 'active';
    RETURN v_school_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_principal()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('admin', 'principal')
          AND status = 'active'
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_school_staff_or_teacher()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('admin', 'principal', 'teacher', 'staff', 'accountant', 'librarian')
          AND status = 'active'
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_parent_of_student(p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.student_parents sp
        JOIN public.parents p ON p.id = sp.parent_id
        WHERE sp.student_id = p_student_id
          AND p.profile_id = auth.uid()
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_student_user(p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.students s
        WHERE s.id = p_student_id
          AND s.profile_id = auth.uid()
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_parent_user(p_parent_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.parents p
        WHERE p.id = p_parent_id
          AND p.profile_id = auth.uid()
    );
END;
$$;

-- 2. ENABLE RLS ON ALL TABLES
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES: schools
-- Public may read verified school information
CREATE POLICY "Schools: public read"
ON public.schools FOR SELECT
USING (true);

CREATE POLICY "Schools: admin insert"
ON public.schools FOR INSERT
WITH CHECK (public.is_admin_or_principal());

CREATE POLICY "Schools: admin update"
ON public.schools FOR UPDATE
USING (public.is_admin_or_principal() AND id = public.current_user_school_id());

CREATE POLICY "Schools: admin delete"
ON public.schools FOR DELETE
USING (public.is_admin_or_principal() AND id = public.current_user_school_id());

-- 4. POLICIES: branches
CREATE POLICY "Branches: public read active"
ON public.branches FOR SELECT
USING (is_active = true OR public.is_school_staff_or_teacher());

CREATE POLICY "Branches: admin manage"
ON public.branches FOR ALL
USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- 5. POLICIES: academic_years
CREATE POLICY "AcademicYears: public read"
ON public.academic_years FOR SELECT
USING (true);

CREATE POLICY "AcademicYears: admin manage"
ON public.academic_years FOR ALL
USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- 6. POLICIES: profiles
-- User can read own profile; Staff/Admins can read profiles in same school
CREATE POLICY "Profiles: user read own"
ON public.profiles FOR SELECT
USING (
    id = auth.uid()
    OR (
        public.is_school_staff_or_teacher()
        AND school_id = public.current_user_school_id()
    )
);

-- Users can update only their own non-privileged details (phone, avatar)
CREATE POLICY "Profiles: user update own"
ON public.profiles FOR UPDATE
USING (id = auth.uid())
WITH CHECK (
    id = auth.uid()
    -- Ordinary users cannot elevate their own role or status
    AND (
        public.is_admin_or_principal()
        OR (role = (SELECT role FROM public.profiles WHERE id = auth.uid())
            AND status = (SELECT status FROM public.profiles WHERE id = auth.uid()))
    )
);

-- Admin can manage school profiles
CREATE POLICY "Profiles: admin insert"
ON public.profiles FOR INSERT
WITH CHECK (
    public.is_admin_or_principal()
    OR auth.uid() = id -- handled by provisioning / trigger
);

CREATE POLICY "Profiles: admin update"
ON public.profiles FOR UPDATE
USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

CREATE POLICY "Profiles: admin delete"
ON public.profiles FOR DELETE
USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- 7. POLICIES: students
-- Student can see own; Linked parent can see own child; Staff/Admin can see school students
CREATE POLICY "Students: view own or linked child"
ON public.students FOR SELECT
USING (
    profile_id = auth.uid()
    OR public.is_parent_of_student(id)
    OR (
        public.is_school_staff_or_teacher()
        AND school_id = public.current_user_school_id()
    )
);

CREATE POLICY "Students: admin manage"
ON public.students FOR ALL
USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- 8. POLICIES: parents
CREATE POLICY "Parents: view own"
ON public.parents FOR SELECT
USING (
    profile_id = auth.uid()
    OR (
        public.is_school_staff_or_teacher()
        AND school_id = public.current_user_school_id()
    )
);

CREATE POLICY "Parents: admin manage"
ON public.parents FOR ALL
USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- 9. POLICIES: student_parents
CREATE POLICY "StudentParents: view own linkage"
ON public.student_parents FOR SELECT
USING (
    public.is_student_user(student_id)
    OR public.is_parent_user(parent_id)
    OR public.is_school_staff_or_teacher()
);
CREATE POLICY "StudentParents: admin manage"
ON public.student_parents FOR ALL
USING (public.is_admin_or_principal());

-- 10. POLICIES: teachers
-- Public can read verified faculty roster for website
CREATE POLICY "Teachers: public read roster"
ON public.teachers FOR SELECT
USING (true);

CREATE POLICY "Teachers: admin manage"
ON public.teachers FOR ALL
USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- 11. POLICIES: staff
CREATE POLICY "Staff: authenticated read in school"
ON public.staff FOR SELECT
USING (
    public.is_school_staff_or_teacher()
    AND school_id = public.current_user_school_id()
);

CREATE POLICY "Staff: admin manage"
ON public.staff FOR ALL
USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- 12. POLICIES: classes, sections, subjects
CREATE POLICY "Classes: public read"
ON public.classes FOR SELECT
USING (true);

CREATE POLICY "Classes: admin manage"
ON public.classes FOR ALL
USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

CREATE POLICY "Sections: public read"
ON public.sections FOR SELECT
USING (true);

CREATE POLICY "Sections: admin manage"
ON public.sections FOR ALL
USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- Subjects
CREATE POLICY "Subjects: public read"
ON public.subjects FOR SELECT
USING (true);

CREATE POLICY "Subjects: admin manage"
ON public.subjects FOR ALL
USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- 13. POLICIES: enrollments
-- Student sees own enrollment; Parent sees child enrollment; Staff/Admin see school enrollments
CREATE POLICY "Enrollments: student or parent read"
ON public.enrollments FOR SELECT
USING (
    public.is_student_user(student_id)
    OR public.is_parent_of_student(student_id)
    OR public.is_school_staff_or_teacher()
);

CREATE POLICY "Enrollments: admin manage"
ON public.enrollments FOR ALL
USING (public.is_admin_or_principal());

-- 14. POLICIES: audit_logs (Strict immutable security boundary)
CREATE POLICY "AuditLogs: admin read only"
ON public.audit_logs FOR SELECT
USING (
    public.is_admin_or_principal()
    AND (school_id = public.current_user_school_id() OR school_id IS NULL)
);

CREATE POLICY "AuditLogs: authenticated append"
ON public.audit_logs FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE and DELETE are NOT granted (Append-only audit trail)

-- 15. POLICIES: site_settings
CREATE POLICY "SiteSettings: public read enabled settings"
ON public.site_settings FOR SELECT
USING (
    is_public = true
    OR (
        public.is_admin_or_principal()
        AND school_id = public.current_user_school_id()
    )
);

CREATE POLICY "SiteSettings: admin manage"
ON public.site_settings FOR ALL
USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());
