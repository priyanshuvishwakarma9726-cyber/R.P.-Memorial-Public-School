import HeroSection from "@/components/home/HeroSection";
import NoticeStrip from "@/components/home/NoticeStrip";
import QuickLinks from "@/components/home/QuickLinks";
import SchoolIntro from "@/components/home/SchoolIntro";
import KeyHighlights from "@/components/home/KeyHighlights";
import AcademicsPreview from "@/components/home/AcademicsPreview";
import PrincipalSection from "@/components/home/PrincipalSection";
import InfrastructurePreview from "@/components/home/InfrastructurePreview";
import FacultyPreview from "@/components/home/FacultyPreview";
import GalleryPreview from "@/components/home/GalleryPreview";
import ContactCta from "@/components/home/ContactCta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NoticeStrip />
      <QuickLinks />
      <SchoolIntro />
      <KeyHighlights />
      <AcademicsPreview />
      <PrincipalSection />
      <InfrastructurePreview />
      <FacultyPreview />
      <GalleryPreview />
      <ContactCta />
    </>
  );
}
