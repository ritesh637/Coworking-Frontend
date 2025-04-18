import React from "react";
import Page from "@/components/privacy/page.js";

const page = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <PrivacyContent />
    </div>
  );
};

export default Page;
