import React from "react";
import HeroSection from "./../components/HeroSection";
import FeaturesSection from "./../components/FeaturesSection";
import CtaSection from "./../components/CtaSection";
import { useRouter } from "./../util/router.js";

function IndexPage(props) {
  const router = useRouter();

  return (
    <>
      <HeroSection
        bg="primary"
        textColor="light"
        size="lg"
        bgImage=""
        bgImageOpacity={1}
        title="Blocks are eco-systems"
        subtitle="The blocks we live and work in are eco-systems that we can engage with in a positive way."
        buttonText="Start your block"
        buttonColor="light"
        buttonOnClick={() => {
          router.push("/set-block");
        }}
      />
      <FeaturesSection
        bg="white"
        textColor="dark"
        size="md"
        bgImage=""
        bgImageOpacity={1}
        title="Features"
        subtitle="Tools to define blocks and their properties"
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
          router.push("/set-block");
        }}
      />
    </>
  );
}

export default IndexPage;
