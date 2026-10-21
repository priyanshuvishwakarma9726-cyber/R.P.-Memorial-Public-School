-- =====================================================================
-- R.P. MEMORIAL PUBLIC SCHOOL — VERIFIED FOUNDATION SEED DATA
-- File: supabase/seed/seed.sql
-- =====================================================================

-- 1. SEED VERIFIED SCHOOL RECORD
-- Using a fixed deterministic UUID for initial installation consistency
DO $$
DECLARE
    v_school_id UUID := 'a1000000-0000-0000-0000-000000000001'::uuid;
    v_branch_id UUID := 'b1000000-0000-0000-0000-000000000001'::uuid;
BEGIN
    -- Insert School
    INSERT INTO public.schools (
        id,
        name,
        school_code,
        tagline,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        logo_path
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
    SET 
        name = EXCLUDED.name,
        tagline = EXCLUDED.tagline,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        address = EXCLUDED.address;

    -- Insert Primary Branch (Main Campus)
    INSERT INTO public.branches (
        id,
        school_id,
        name,
        code,
        address,
        is_active
    )
    VALUES (
        v_branch_id,
        v_school_id,
        'Main Campus',
        'MAIN',
        'MAHARAJGANJ, MAHARAJGANJ, MAHARAJGANJ, UTTAR PRADESH - 273301',
        true
    )
    ON CONFLICT (id) DO NOTHING;

    -- 2. SEED VERIFIED TEACHERS ROSTER (19 Verified Members from CBSE Disclosure)
    -- Preserving exact names, designations, and qualifications. No fake employee codes or subjects.
    INSERT INTO public.teachers (school_id, designation, qualification, status) VALUES
        (v_school_id, 'PRINCIPAL', 'M.A.', 'active'), -- AVADHES KUMAR CHAURASAIA
        (v_school_id, 'PRT', 'B.A.', 'active'),       -- NEELAM MADDHESHIYA
        (v_school_id, 'PRT', 'B.Sc.', 'active'),      -- AHSAN ZAHEER
        (v_school_id, 'TGT', 'M.A.', 'active'),       -- PRADEEP RAI
        (v_school_id, 'PRT', 'M.A.', 'active'),       -- NEETU YADAV
        (v_school_id, 'PRT', 'B.COM', 'active'),      -- PRADEEP KUMAR GUPTA
        (v_school_id, 'PRT', 'M.A.', 'active'),       -- ABHISHEK KUSHAWAHA
        (v_school_id, 'TGT', 'M.A.', 'active'),       -- ANURADHA GUPTA
        (v_school_id, 'TGT', 'M.A.', 'active'),       -- VISHWJEET PATEL
        (v_school_id, 'PRT', 'B.A.', 'active'),       -- POORNIMA SRIVASTAVA
        (v_school_id, 'PRT', 'B.A.', 'active'),       -- ANKITA PATEL
        (v_school_id, 'TGT', 'M.Sc.', 'active'),      -- MANISHA SINGH
        (v_school_id, 'PRT', 'B.A.', 'active'),       -- SHUBHAM PATEL
        (v_school_id, 'PRT', 'B.A.', 'active'),       -- ASHWANI KUMAR
        (v_school_id, 'TGT', 'M.A.', 'active'),       -- DURGESH MISHRA
        (v_school_id, 'TGT', 'B.Sc.', 'active'),      -- MONIKA VISHWAKRMA
        (v_school_id, 'TGT', 'M.A.', 'active'),       -- GARIMA SHUKLA
        (v_school_id, 'PRT', 'B.A.', 'active'),       -- POONAM MADDHESHIYA
        (v_school_id, 'PRT', 'B.A.', 'active');       -- PRIYANKA MADDHESHIYA

    -- 3. SEED PUBLIC SITE SETTINGS (Verified institutional data)
    INSERT INTO public.site_settings (school_id, setting_key, setting_value, is_public) VALUES
        (v_school_id, 'general_info', '{"name": "R.P. MEMORIAL PUBLIC SCHOOL", "code": "2134039", "tagline": "A School that leads to excellence"}'::jsonb, true),
        (v_school_id, 'contact_info', '{"phone": "8750067726", "email": "rpmemorialp.school@gmail.com", "address": "MAHARAJGANJ, MAHARAJGANJ, MAHARAJGANJ, UTTAR PRADESH - 273301"}'::jsonb, true),
        (v_school_id, 'principal_info', '{"name": "AVADHES KUMAR CHAURASAIA", "qualification": "M.A., B.Ed."}'::jsonb, true),
        (v_school_id, 'infrastructure_verified', '{"campus_area_sqm": 8130, "classrooms": 50, "classroom_size_sqm": 47, "laboratories": 6, "lab_size_sqm": 56, "internet": true, "girls_toilets": 12, "boys_toilets": 12}'::jsonb, true)
    ON CONFLICT (school_id, setting_key) DO UPDATE
    SET setting_value = EXCLUDED.setting_value;

END $$;
