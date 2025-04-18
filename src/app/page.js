import Homepage from "@/components/HomeMain";
import MainContent from "@/components/MainContent";
import MembershipPlans from "@/components/MembershipPlans";
import WorkspaceSection from "@/components/WorkspaceSection";
import HomeMain from "@/components/HomeMain";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <>
      <MainContent></MainContent>
      <MembershipPlans></MembershipPlans>
      <WorkspaceSection></WorkspaceSection>
      <HomeMain></HomeMain>
      <WhyChooseUs></WhyChooseUs>
    </>
  );
}
