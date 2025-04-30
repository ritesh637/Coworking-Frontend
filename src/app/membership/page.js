import WorkExperienceBanner from "@/components/membership/WorkExperienceBanner";
import PricingPlans from "@/components/membership/PricingPlans";
import React from "react";
import CustomSpace from "@/components/membership/CustomSpace";
import TeamSection from "@/components/membership/TeamSection";
// import ProductViewTypes from "@/components/membership/ProductViewTypes";
function page() {
  return (
    <div>
      <WorkExperienceBanner></WorkExperienceBanner>
      <PricingPlans></PricingPlans>
      <TeamSection></TeamSection>
      <CustomSpace></CustomSpace>
      {/* <ProductViewTypes></ProductViewTypes> */}
    </div>
  );
}

export default page;
