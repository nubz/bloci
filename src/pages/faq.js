import React from "react";
import FaqSection from "./../components/FaqSection";
import CtaSection from "./../components/CtaSection";
import { useRouter } from "./../util/router.js";

function FaqPage(props) {
  const router = useRouter();

  return (
    <>
      <FaqSection
        bg="white"
        textColor="dark"
        size="md"
        bgImage=""
        bgImageOpacity={1}
        title="Frequently Asked Questions"
        subtitle=""
      />
      <CtaSection
        bg="primary"
        textColor="light"
        size="sm"
        bgImage=""
        bgImageOpacity={1}
        title="Ready to get started?"
        subtitle=""
        buttonText="Get Started"
        buttonColor="light"
        buttonOnClick={() => {
          // Navigate to pricing page
          router.push("/pricing");
        }}
      />
    </>
  );
}

export default FaqPage;
