export type UserRole =
  | "admin"
  | "principal"
  | "teacher"
  | "staff"
  | "student"
  | "parent"
  | "accountant"
  | "librarian"
  | "transport_manager";

export type ProfileStatus = "active" | "inactive" | "suspended" | "pending";

export type School = {
  id: string;
  name: string;
  school_code: string;
  tagline?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  logo_path?: string | null;
  created_at: string;
  updated_at: string;
};

export type Branch = {
  id: string;
  school_id: string;
  name: string;
  code?: string | null;
  address?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AcademicYear = {
  id: string;
  school_id: string;
  name: string;
  start_date?: string | null;
  end_date?: string | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string; // references auth.users.id
  school_id?: string | null;
  branch_id?: string | null;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_path?: string | null;
  role: UserRole;
  status: ProfileStatus;
  created_at: string;
  updated_at: string;
};

export type Student = {
  id: string;
  school_id: string;
  admission_number?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  profile_id?: string | null;
  status: "active" | "inactive" | "graduated" | "transferred";
  created_at: string;
  updated_at: string;
};

export type Parent = {
  id: string;
  school_id: string;
  profile_id?: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

export type StudentParent = {
  id: string;
  student_id: string;
  parent_id: string;
  relationship: "father" | "mother" | "guardian" | string;
  is_primary: boolean;
  can_receive_notifications: boolean;
  created_at: string;
};

export type Teacher = {
  id: string;
  school_id: string;
  profile_id?: string | null;
  employee_code?: string | null;
  designation: string;
  qualification: string;
  status: "active" | "inactive" | "on_leave";
  created_at: string;
  updated_at: string;
};

export type Staff = {
  id: string;
  school_id: string;
  profile_id?: string | null;
  designation: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

export type ClassRoom = {
  id: string;
  school_id: string;
  name: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Section = {
  id: string;
  school_id: string;
  class_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Subject = {
  id: string;
  school_id: string;
  name: string;
  code?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Enrollment = {
  id: string;
  student_id: string;
  academic_year_id: string;
  class_id: string;
  section_id?: string | null;
  roll_number?: string | null;
  status: "active" | "completed" | "withdrawn" | "promoted";
  created_at: string;
  updated_at: string;
};

export type AuditLog = {
  id: string;
  school_id?: string | null;
  actor_user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  old_data?: Record<string, unknown> | null;
  new_data?: Record<string, unknown> | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
};

export type SiteSetting = {
  id: string;
  school_id: string;
  setting_key: string;
  setting_value: Record<string, unknown>;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

// Database Schema Mapping for Supabase Client
export type Database = {
  public: {
    Tables: {
      schools: {
        Row: School;
        Insert: Omit<School, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<School, "id">>;
        Relationships: [];
      };
      branches: {
        Row: Branch;
        Insert: Omit<Branch, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Branch, "id">>;
        Relationships: [];
      };
      academic_years: {
        Row: AcademicYear;
        Insert: Omit<AcademicYear, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<AcademicYear, "id">>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<Profile, "id">>;
        Relationships: [];
      };
      students: {
        Row: Student;
        Insert: Omit<Student, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Student, "id">>;
        Relationships: [];
      };
      parents: {
        Row: Parent;
        Insert: Omit<Parent, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Parent, "id">>;
        Relationships: [];
      };
      student_parents: {
        Row: StudentParent;
        Insert: Omit<StudentParent, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<StudentParent, "id">>;
        Relationships: [];
      };
      teachers: {
        Row: Teacher;
        Insert: Omit<Teacher, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Teacher, "id">>;
        Relationships: [];
      };
      staff: {
        Row: Staff;
        Insert: Omit<Staff, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Staff, "id">>;
        Relationships: [];
      };
      classes: {
        Row: ClassRoom;
        Insert: Omit<ClassRoom, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<ClassRoom, "id">>;
        Relationships: [];
      };
      sections: {
        Row: Section;
        Insert: Omit<Section, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Section, "id">>;
        Relationships: [];
      };
      subjects: {
        Row: Subject;
        Insert: Omit<Subject, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Subject, "id">>;
        Relationships: [];
      };
      enrollments: {
        Row: Enrollment;
        Insert: Omit<Enrollment, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Enrollment, "id">>;
        Relationships: [];
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<AuditLog, "id">>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSetting;
        Insert: Omit<SiteSetting, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<SiteSetting, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
