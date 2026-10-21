import {
  MapPin,
  Building2,
  FlaskConical,
  Wifi,
  HeartHandshake,
  Users2,
  Maximize2,
  CheckCircle2,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import StatCard from "@/components/shared/StatCard";
import { SCHOOL_INFO } from "@/lib/data/school-data";

export default function KeyHighlights() {
  const stats = [
    {
      number: "8,130",
      unit: "sq. m",
      label: "Total Campus Area",
      detail: "Verified institutional land area in Maharajganj",
      icon: <Maximize2 size={22} />,
    },
    {
      number: "50",
      unit: "Rooms",
      label: "Number of Classrooms",
      detail: "Standardized classroom area: 47 sq. m per room",
      icon: <Building2 size={22} />,
    },
    {
      number: "6",
      unit: "Labs",
      label: "Laboratories & Computer Labs",
      detail: "Spacious laboratory layout: 56 sq. m per lab",
      icon: <FlaskConical size={22} />,
    },
    {
      number: "YES",
      label: "Internet & Digital Facility",
      detail: "High-speed network facility enabled across campus",
      icon: <Wifi size={22} />,
    },
    {
      number: "1:1.5",
      label: "Teacher-Section Ratio",
      detail: "Optimal faculty allocation per academic section",
      icon: <Users2 size={22} />,
    },
    {
      number: "24",
      unit: "Units",
      label: "Sanitation Facilities",
      detail: "12 Girls' Toilets & 12 Boys' Toilets on campus",
      icon: <CheckCircle2 size={22} />,
    },
    {
      number: "1",
      unit: "Staff",
      label: "Special Educator",
      detail: "Dedicated support for inclusive student learning",
      icon: <HeartHandshake size={22} />,
    },
    {
      number: "1",
      unit: "Staff",
      label: "Wellness & Counsellor",
      detail: "Student mental wellness and guidance officer",
      icon: <HeartHandshake size={22} />,
    },
  ];

  return (
    <section className="section" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="container">
        <SectionHeader
          tag="Verified Institutional Facts"
          title="Infrastructure & Academic Highlights"
          description="Official data points documented under CBSE mandatory public disclosure records."
        />

        <div className="grid-4">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              number={stat.number}
              unit={stat.unit}
              label={stat.label}
              detail={stat.detail}
              icon={stat.icon}
              isVerified={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
