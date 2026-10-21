export interface Teacher {
  id: number;
  name: string;
  designation: string;
  qualification: string;
}

export interface InfrastructureMetric {
  label: string;
  value: string;
  detail: string;
  verified: boolean;
}

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  category: "Academic" | "Administrative" | "Examination" | "Admission";
  isPinned?: boolean;
  isDemo?: boolean;
  description: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  category: "Sports" | "Academic" | "Cultural" | "Celebration";
  isDemo?: boolean;
  status: "Upcoming" | "Past";
  description: string;
}

export const SCHOOL_INFO = {
  name: "R.P. MEMORIAL PUBLIC SCHOOL",
  tagline: "A School that leads to excellence",
  shortName: "R.P.M. Public School",
  establishedYear: 2011,
  schoolCode: "2134039",
  affiliationStatus: "School Code: 2134039",
  principal: {
    name: "AVADHES KUMAR CHAURASAIA",
    designation: "Principal",
    qualification: "M.A., B.Ed.",
    imageSrc: "/images/Principal.jpeg",
  },
  contact: {
    phone: "8750067726",
    email: "rpmemorialp.school@gmail.com",
    address: {
      line1: "MAHARAJGANJ, MAHARAJGANJ,",
      line2: "MAHARAJGANJ, UTTAR PRADESH - 273301",
      city: "Maharajganj",
      state: "Uttar Pradesh",
      pincode: "273301",
      country: "India",
      googleMapsSearchUrl:
        "https://www.google.com/maps/search/?api=1&query=R.P.+Memorial+Public+School+Partawal+Bazar+Maharajganj+Uttar+Pradesh+273301",
    },
  },
  infrastructure: {
    campusAreaSqM: "8130 sq. m",
    totalClassrooms: 50,
    classroomSizeSqM: "47 sq. m",
    laboratoriesCount: 6,
    laboratorySizeSqM: "56 sq. m",
    internetFacility: "YES",
    girlsToilets: 12,
    boysToilets: 12,
    inspectionVideoUrl: "https://www.youtube.com/watch?v=PSB81LTjoNg",
  },
  academicsData: {
    teacherSectionRatio: "1:1.5",
    specialEducator: 1,
    wellnessTeacher: 1,
    summaryTable: {
      note: "As documented in official disclosure records",
      pgt: 9,
      tgt: 10,
      prt: 8,
    },
  },
  logo: {
    src: "/images/school-logo.png",
    imageSrc: "/images/school-logo.png",
    alt: "R.P. Memorial Public School logo",
  },
} as const;

/**
 * Verified Teacher Roster exactly as listed in Official Document Table
 * Discrepancy disclosure: The summary note lists 18 teachers whereas the detailed table contains 19 listed staff (including the Principal).
 * Values preserved without silent modifications.
 */
export const TEACHERS_ROSTER: Teacher[] = [
  { id: 1, name: "AVADHES KUMAR CHAURASAIA", designation: "PRINCIPAL", qualification: "M.A., B.Ed." },
  { id: 2, name: "NEELAM MADDHESHIYA", designation: "PRT", qualification: "B.A." },
  { id: 3, name: "AHSAN ZAHEER", designation: "PRT", qualification: "B.Sc." },
  { id: 4, name: "PRADEEP RAI", designation: "TGT", qualification: "M.A." },
  { id: 5, name: "NEETU YADAV", designation: "PRT", qualification: "M.A." },
  { id: 6, name: "PRADEEP KUMAR GUPTA", designation: "PRT", qualification: "B.COM" },
  { id: 7, name: "ABHISHEK KUSHAWAHA", designation: "PRT", qualification: "M.A." },
  { id: 8, name: "ANURADHA GUPTA", designation: "TGT", qualification: "M.A." },
  { id: 9, name: "VISHWJEET PATEL", designation: "TGT", qualification: "M.A." },
  { id: 10, name: "POORNIMA SRIVASTAVA", designation: "PRT", qualification: "B.A." },
  { id: 11, name: "ANKITA PATEL", designation: "PRT", qualification: "B.A." },
  { id: 12, name: "MANISHA SINGH", designation: "TGT", qualification: "M.Sc." },
  { id: 13, name: "SHUBHAM PATEL", designation: "PRT", qualification: "B.A." },
  { id: 14, name: "ASHWANI KUMAR", designation: "PRT", qualification: "B.A." },
  { id: 15, name: "DURGESH MISHRA", designation: "TGT", qualification: "M.A." },
  { id: 16, name: "MONIKA VISHWAKRMA", designation: "TGT", qualification: "B.Sc." },
  { id: 17, name: "GARIMA SHUKLA", designation: "TGT", qualification: "M.A." },
  { id: 18, name: "POONAM MADDHESHIYA", designation: "PRT", qualification: "B.A." },
  { id: 19, name: "PRIYANKA MADDHESHIYA", designation: "PRT", qualification: "B.A." },
];

/**
 * Verified Real Campus Media
 */
export const CAMPUS_GALLERY_IMAGES = [
  {
    id: "g1",
    title: "Main Campus Entrance & Administrative Facade",
    src: "/images/campus-entrance.jpg",
    category: "Campus & Facade",
    description: "Official entrance of R.P. Memorial Public School, Maharajganj, featuring the institutional archway and transport bay.",
  },
  {
    id: "g2",
    title: "Spacious Inner Courtyard & Academic Wings",
    src: "/images/campus-courtyard.jpg",
    category: "Campus & Facade",
    description: "Open inner courtyard surrounded by multi-storey ventilated classroom corridors.",
  },
  {
    id: "g3",
    title: "School Gate & Student Transport Facility",
    src: "/images/campus-gate-bus.jpg",
    category: "Infrastructure",
    description: "Secured main boundary gate with official school bus services.",
  },
  {
    id: "g4",
    title: "Academic Library & Reading Hall Session",
    src: "/images/students-library.jpg",
    category: "Academics",
    description: "Senior secondary students attending quiet reference and guided study sessions in the reading hall.",
  },
];

/**
 * Clearly Labeled Demo Notices for UI Verification (No fabricated official claims)
 */
export const SAMPLE_NOTICES: NoticeItem[] = [
  {
    id: "n-1",
    title: "CBSE Secondary Session Curriculum Guidelines 2026-27",
    date: "Current Session",
    category: "Academic",
    isPinned: true,
    isDemo: true,
    description: "Notification for parents regarding academic curriculum structure, textbook lists, and class schedule alignment.",
  },
  {
    id: "n-2",
    title: "Admission Enquiry & Registration Window Update",
    date: "Session Notice",
    category: "Admission",
    isPinned: true,
    isDemo: true,
    description: "Prospective parents can submit the online enquiry form or visit the school helpdesk on campus during working days.",
  },
  {
    id: "n-3",
    title: "Periodic Assessment Schedule Information",
    date: "Upcoming Cycle",
    category: "Examination",
    isPinned: false,
    isDemo: true,
    description: "Assessment cycles and student revision timetables will be communicated via class circulars.",
  },
  {
    id: "n-4",
    title: "Campus Cleanliness & Wellness Orientation",
    date: "General Circular",
    category: "Administrative",
    isPinned: false,
    isDemo: true,
    description: "Routine campus orientation on student hygiene, sports participation, and disciplinary etiquette.",
  },
];

/**
 * Clearly Labeled Demo Events for School Calendar UI
 */
export const SAMPLE_EVENTS: EventItem[] = [
  {
    id: "e-1",
    title: "Annual Sports & Athletic Meet",
    date: "Winter Term",
    category: "Sports",
    status: "Upcoming",
    isDemo: true,
    description: "Track and field sports competitions, team games, and physical fitness displays for students across all classes.",
  },
  {
    id: "e-2",
    title: "Science & Mathematics Exhibition",
    date: "Mid-Term",
    category: "Academic",
    status: "Upcoming",
    isDemo: true,
    description: "Student model presentations, working laboratory experiments, and interactive scientific showcases.",
  },
  {
    id: "e-3",
    title: "National Independence & Republic Day Celebrations",
    date: "Annual National Days",
    category: "Celebration",
    status: "Past",
    isDemo: true,
    description: "Flag hoisting ceremonies, patriotic cultural performances, and speeches promoting civic responsibility.",
  },
  {
    id: "e-4",
    title: "Parent-Teacher Interactive Meeting (PTM)",
    date: "Quarterly Session",
    category: "Academic",
    status: "Upcoming",
    isDemo: true,
    description: "Scheduled consultation meeting between faculty and parents to discuss student academic progress and wellness.",
  },
];

/**
 * Downloadable Documents UI Items (Section B excluded - institutional forms & academic schedules only)
 */
export const DOWNLOAD_ITEMS = [
  {
    id: "d1",
    title: "School Admission Enquiry Slip",
    category: "Admissions",
    status: "Available for Download",
    format: "PDF Format",
    size: "Standard Form",
    fileUrl: "#",
    isAvailable: false,
  },
  {
    id: "d2",
    title: "Annual Academic Calendar Outline",
    category: "Academics",
    status: "Pending Administrative Upload",
    format: "PDF Document",
    size: "Official Schedule",
    fileUrl: "#",
    isAvailable: false,
  },
  {
    id: "d3",
    title: "Student Code of Conduct & Rules Handbook",
    category: "Student Life",
    status: "Pending Administrative Upload",
    format: "PDF Document",
    size: "Guidelines",
    fileUrl: "#",
    isAvailable: false,
  },
  {
    id: "d4",
    title: "School Management Committee (SMC) Information",
    category: "Governance",
    status: "Details to be updated by school",
    format: "Official Document",
    size: "Directory",
    fileUrl: "#",
    isAvailable: false,
  },
  {
    id: "d5",
    title: "Parent-Teacher Association (PTA) Register",
    category: "Governance",
    status: "Details to be updated by school",
    format: "Official Document",
    size: "Register",
    fileUrl: "#",
    isAvailable: false,
  },
  {
    id: "d6",
    title: "Prescribed Booklist & Syllabus Framework",
    category: "Academics",
    status: "To be updated for new session",
    format: "PDF Document",
    size: "Syllabus",
    fileUrl: "#",
    isAvailable: false,
  },
];

/**
 * Verified FAQs
 */
export const FAQS = [
  {
    q: "Where is R.P. Memorial Public School located?",
    a: "The school is located at MAHARAJGANJ, MAHARAJGANJ, UTTAR PRADESH - 273301.",
  },
  {
    q: "What is the official CBSE school code of R.P. Memorial Public School?",
    a: "The official school code is 2134039.",
  },
  {
    q: "Who is the Principal of the school and what are their qualifications?",
    a: "The Principal is AVADHES KUMAR CHAURASAIA, holding M.A. and B.Ed. degrees.",
  },
  {
    q: "What is the official tagline and motto of the school?",
    a: "'A School that leads to excellence' (Emblem motto: 'Read, Lead and Succeed - Since 2011').",
  },
  {
    q: "What is the campus area and classroom infrastructure of the school?",
    a: "The campus spans 8,130 sq. meters, comprising 50 classrooms (47 sq. m each), 6 laboratories including computer labs (56 sq. m each), high-speed internet connectivity, and dedicated sanitation facilities (12 boys' toilets and 12 girls' toilets).",
  },
  {
    q: "How can parents contact the school administrative office?",
    a: "Parents and visitors can contact the school via telephone at 8750067726 or via official email at rpmemorialp.school@gmail.com.",
  },
  {
    q: "Where can I view the fee structure and admission dates?",
    a: "Official fee structures, admission criteria, and calendar dates will be officially published and updated by the school administrative office. Please submit the admission enquiry form for direct updates.",
  },
  {
    q: "How are Board examination results (Class X and XII) published?",
    a: "Official board results are updated in accordance with the Central Board of Secondary Education (CBSE) annual declarations. The school does not publish unverified scores or topper claims.",
  },
];
