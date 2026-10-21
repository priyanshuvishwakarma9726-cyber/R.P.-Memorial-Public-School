-- =====================================================================
-- R.P. MEMORIAL PUBLIC SCHOOL — COMPLETE PHASE 2 DATABASE SETUP
-- Single Combined Script for Supabase SQL Editor
-- Includes: Core Tables, Indexes, Triggers, RLS Policies, Storage Buckets, and Verified Seed Data
-- =====================================================================

-- ---------------------------------------------------------------------
-- PART 1: CORE EXTENSIONS & TRIGGER FUNCTIONS
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------
-- PART 2: CORE TABLES & INDEXES
-- ---------------------------------------------------------------------

-- Schools Table
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    school_code TEXT NOT NULL UNIQUE,
    tagline TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    logo_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_schools_updated_at
BEFORE UPDATE ON public.schools
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Branches Table
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_branches_school_id ON public.branches(school_id);

CREATE TRIGGER update_branches_updated_at
BEFORE UPDATE ON public.branches
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Academic Years Table
CREATE TABLE IF NOT EXISTS public.academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academic_years_school_id ON public.academic_years(school_id);

CREATE TRIGGER update_academic_years_updated_at
BEFORE UPDATE ON public.academic_years
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Profiles Table (Linked 1-to-1 to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_path TEXT,
    role TEXT NOT NULL CHECK (role IN (
        'admin', 'principal', 'teacher', 'staff', 'student',
        'parent', 'accountant', 'librarian', 'transport_manager'
    )),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON public.profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    admission_number TEXT UNIQUE,
    date_of_birth DATE,
    gender TEXT,
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_students_school_id ON public.students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_profile_id ON public.students(profile_id);

CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Parents Table
CREATE TABLE IF NOT EXISTS public.parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parents_school_id ON public.parents(school_id);
CREATE INDEX IF NOT EXISTS idx_parents_profile_id ON public.parents(profile_id);

CREATE TRIGGER update_parents_updated_at
BEFORE UPDATE ON public.parents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Student-Parents Table
CREATE TABLE IF NOT EXISTS public.student_parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
    relationship TEXT NOT NULL DEFAULT 'parent',
    is_primary BOOLEAN NOT NULL DEFAULT false,
    can_receive_notifications BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, parent_id)
);

CREATE INDEX IF NOT EXISTS idx_student_parents_student ON public.student_parents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_parent ON public.student_parents(parent_id);

-- Teachers Table
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
    employee_code TEXT,
    designation TEXT NOT NULL,
    qualification TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON public.teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_teachers_profile_id ON public.teachers(profile_id);

CREATE TRIGGER update_teachers_updated_at
BEFORE UPDATE ON public.teachers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Staff Table
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
    designation TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staff_school_id ON public.staff(school_id);
CREATE INDEX IF NOT EXISTS idx_staff_profile_id ON public.staff(profile_id);

CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_classes_school_id ON public.classes(school_id);

CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON public.classes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sections Table
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sections_school_class ON public.sections(school_id, class_id);

CREATE TRIGGER update_sections_updated_at
BEFORE UPDATE ON public.sections
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subjects_school_id ON public.subjects(school_id);

CREATE TRIGGER update_subjects_updated_at
BEFORE UPDATE ON public.subjects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
    roll_number TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn', 'promoted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, academic_year_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_year_class ON public.enrollments(academic_year_id, class_id, section_id);

CREATE TRIGGER update_enrollments_updated_at
BEFORE UPDATE ON public.enrollments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_school ON public.audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    setting_key TEXT NOT NULL,
    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(school_id, setting_key)
);

CREATE INDEX IF NOT EXISTS idx_site_settings_lookup ON public.site_settings(school_id, setting_key);

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------
-- PART 3: ROW LEVEL SECURITY (RLS) POLICIES & SECURITY DEFINERS
-- ---------------------------------------------------------------------

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

-- Enable RLS
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

-- Schools Policies
CREATE POLICY "Schools: public read" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Schools: admin insert" ON public.schools FOR INSERT WITH CHECK (public.is_admin_or_principal());
CREATE POLICY "Schools: admin update" ON public.schools FOR UPDATE USING (public.is_admin_or_principal() AND id = public.current_user_school_id());
CREATE POLICY "Schools: admin delete" ON public.schools FOR DELETE USING (public.is_admin_or_principal() AND id = public.current_user_school_id());

-- Branches Policies
CREATE POLICY "Branches: public read active" ON public.branches FOR SELECT USING (is_active = true OR public.is_school_staff_or_teacher());
CREATE POLICY "Branches: admin manage" ON public.branches FOR ALL USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- Academic Years Policies
CREATE POLICY "AcademicYears: public read" ON public.academic_years FOR SELECT USING (true);
CREATE POLICY "AcademicYears: admin manage" ON public.academic_years FOR ALL USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- Profiles Policies
CREATE POLICY "Profiles: user read own" ON public.profiles FOR SELECT USING (
    id = auth.uid() OR (public.is_school_staff_or_teacher() AND school_id = public.current_user_school_id())
);
CREATE POLICY "Profiles: user update own" ON public.profiles FOR UPDATE USING (id = auth.uid()) WITH CHECK (
    id = auth.uid() AND (public.is_admin_or_principal() OR (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) AND status = (SELECT status FROM public.profiles WHERE id = auth.uid())))
);
CREATE POLICY "Profiles: admin insert" ON public.profiles FOR INSERT WITH CHECK (public.is_admin_or_principal() OR auth.uid() = id);
CREATE POLICY "Profiles: admin update" ON public.profiles FOR UPDATE USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());
CREATE POLICY "Profiles: admin delete" ON public.profiles FOR DELETE USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- Students Policies
CREATE POLICY "Students: view own or linked child" ON public.students FOR SELECT USING (
    profile_id = auth.uid()
    OR public.is_parent_of_student(id)
    OR (public.is_school_staff_or_teacher() AND school_id = public.current_user_school_id())
);
CREATE POLICY "Students: admin manage" ON public.students FOR ALL USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- Parents Policies
CREATE POLICY "Parents: view own" ON public.parents FOR SELECT USING (
    profile_id = auth.uid() OR (public.is_school_staff_or_teacher() AND school_id = public.current_user_school_id())
);
CREATE POLICY "Parents: admin manage" ON public.parents FOR ALL USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- Student-Parents Policies
CREATE POLICY "StudentParents: view own linkage" ON public.student_parents FOR SELECT USING (
    public.is_student_user(student_id)
    OR public.is_parent_user(parent_id)
    OR public.is_school_staff_or_teacher()
);
CREATE POLICY "StudentParents: admin manage" ON public.student_parents FOR ALL USING (public.is_admin_or_principal());

-- Teachers Policies
CREATE POLICY "Teachers: public read roster" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Teachers: admin manage" ON public.teachers FOR ALL USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- Staff Policies
CREATE POLICY "Staff: authenticated read in school" ON public.staff FOR SELECT USING (
    public.is_school_staff_or_teacher() AND school_id = public.current_user_school_id()
);
CREATE POLICY "Staff: admin manage" ON public.staff FOR ALL USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- Classes, Sections, Subjects Policies
CREATE POLICY "Classes: public read" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Classes: admin manage" ON public.classes FOR ALL USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());
CREATE POLICY "Sections: public read" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Sections: admin manage" ON public.sections FOR ALL USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());
CREATE POLICY "Subjects: public read" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Subjects: admin manage" ON public.subjects FOR ALL USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- Enrollments Policies
CREATE POLICY "Enrollments: student or parent read" ON public.enrollments FOR SELECT USING (
    public.is_student_user(student_id)
    OR public.is_parent_of_student(student_id)
    OR public.is_school_staff_or_teacher()
);
CREATE POLICY "Enrollments: admin manage" ON public.enrollments FOR ALL USING (public.is_admin_or_principal());

-- Audit Logs Policies (Append-only)
CREATE POLICY "AuditLogs: admin read only" ON public.audit_logs FOR SELECT USING (
    public.is_admin_or_principal() AND (school_id = public.current_user_school_id() OR school_id IS NULL)
);
CREATE POLICY "AuditLogs: authenticated append" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Site Settings Policies
CREATE POLICY "SiteSettings: public read enabled settings" ON public.site_settings FOR SELECT USING (
    is_public = true OR (public.is_admin_or_principal() AND school_id = public.current_user_school_id())
);
CREATE POLICY "SiteSettings: admin manage" ON public.site_settings FOR ALL USING (public.is_admin_or_principal() AND school_id = public.current_user_school_id());

-- ---------------------------------------------------------------------
-- PART 4: STORAGE BUCKETS & STORAGE OBJECT RLS
-- ---------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('public-assets', 'public-assets', true),
  ('gallery', 'gallery', true),
  ('notices', 'notices', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('student-documents', 'student-documents', false),
  ('admission-documents', 'admission-documents', false),
  ('faculty-assets', 'faculty-assets', false),
  ('report-cards', 'report-cards', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Storage: Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id IN ('public-assets', 'gallery', 'notices'));

CREATE POLICY "Storage: Admin Full Control"
ON storage.objects FOR ALL
USING (
    bucket_id IN ('public-assets', 'gallery', 'notices', 'student-documents', 'admission-documents', 'faculty-assets', 'report-cards')
    AND public.is_admin_or_principal()
);

CREATE POLICY "Storage: Student Document Access"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'student-documents'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR EXISTS (
            SELECT 1 FROM public.student_parents sp
            JOIN public.parents p ON p.id = sp.parent_id
            JOIN public.students s ON s.id = sp.student_id
            WHERE p.profile_id = auth.uid() AND s.profile_id::text = (storage.foldername(name))[1]
        )
    )
);

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
            WHERE p.profile_id = auth.uid() AND s.profile_id::text = (storage.foldername(name))[1]
        )
    )
);

CREATE POLICY "Storage: Faculty Asset Access"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'faculty-assets' AND public.is_school_staff_or_teacher()
);

-- ---------------------------------------------------------------------
-- PART 5: SEED VERIFIED INSTITUTIONAL DATA
-- ---------------------------------------------------------------------

DO $$
DECLARE
    v_school_id UUID := 'a1000000-0000-0000-0000-000000000001'::uuid;
    v_branch_id UUID := 'b1000000-0000-0000-0000-000000000001'::uuid;
BEGIN
    INSERT INTO public.schools (
        id, name, school_code, tagline, email, phone, address, city, state, pincode, logo_path
    )
    VALUES (
        v_school_id,
        'R.P. MEMORIAL PUBLIC SCHOOL',
        '2134039',
        'A School that leads to excellence',
        'rpmemorialp.school@gmail.com',
        '8750067726',
        'MAHARAJGANJ, MAHARAJGANJ, MAHARAJGANJ, UTTAR PRADESH - 273301',
        'Maharajganj',
        'Uttar Pradesh',
        '273301',
        '/images/school-logo.png'
    )
    ON CONFLICT (school_code) DO UPDATE
    SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, email = EXCLUDED.email, phone = EXCLUDED.phone, address = EXCLUDED.address;

    INSERT INTO public.branches (id, school_id, name, code, address, is_active)
    VALUES (
        v_branch_id, v_school_id, 'Main Campus', 'MAIN',
        'MAHARAJGANJ, MAHARAJGANJ, MAHARAJGANJ, UTTAR PRADESH - 273301', true
    )
    ON CONFLICT (id) DO NOTHING;

    -- Seed 19 Verified Faculty Members from CBSE Disclosure
    INSERT INTO public.teachers (school_id, designation, qualification, status) VALUES
        (v_school_id, 'PRINCIPAL', 'M.A.', 'active'),
        (v_school_id, 'PRT', 'B.A.', 'active'),
        (v_school_id, 'PRT', 'B.Sc.', 'active'),
        (v_school_id, 'TGT', 'M.A.', 'active'),
        (v_school_id, 'PRT', 'M.A.', 'active'),
        (v_school_id, 'PRT', 'B.COM', 'active'),
        (v_school_id, 'PRT', 'M.A.', 'active'),
        (v_school_id, 'TGT', 'M.A.', 'active'),
        (v_school_id, 'TGT', 'M.A.', 'active'),
        (v_school_id, 'PRT', 'B.A.', 'active'),
        (v_school_id, 'PRT', 'B.A.', 'active'),
        (v_school_id, 'TGT', 'M.Sc.', 'active'),
        (v_school_id, 'PRT', 'B.A.', 'active'),
        (v_school_id, 'PRT', 'B.A.', 'active'),
        (v_school_id, 'TGT', 'M.A.', 'active'),
        (v_school_id, 'TGT', 'B.Sc.', 'active'),
        (v_school_id, 'TGT', 'M.A.', 'active'),
        (v_school_id, 'PRT', 'B.A.', 'active'),
        (v_school_id, 'PRT', 'B.A.', 'active');

    -- Seed Verified Public Settings
    INSERT INTO public.site_settings (school_id, setting_key, setting_value, is_public) VALUES
        (v_school_id, 'general_info', '{"name": "R.P. MEMORIAL PUBLIC SCHOOL", "code": "2134039", "tagline": "A School that leads to excellence"}'::jsonb, true),
        (v_school_id, 'contact_info', '{"phone": "8750067726", "email": "rpmemorialp.school@gmail.com", "address": "MAHARAJGANJ, MAHARAJGANJ, MAHARAJGANJ, UTTAR PRADESH - 273301"}'::jsonb, true),
        (v_school_id, 'principal_info', '{"name": "AVADHES KUMAR CHAURASAIA", "qualification": "M.A., B.Ed."}'::jsonb, true),
        (v_school_id, 'infrastructure_verified', '{"campus_area_sqm": 8130, "classrooms": 50, "classroom_size_sqm": 47, "laboratories": 6, "lab_size_sqm": 56, "internet": true, "girls_toilets": 12, "boys_toilets": 12}'::jsonb, true)
    ON CONFLICT (school_id, setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

END $$;
