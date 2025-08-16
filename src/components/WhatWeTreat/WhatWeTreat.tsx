"use client";
import dynamic from "next/dynamic";
import React from "react";
const Loading = () => <p>Loading...</p>;

const ReadyToGetStarted = dynamic(
  () => import("@/components/shared/ReadyToGetStarted"),
  {
    loading: Loading,
  }
);
const WhatWeTreatHeroSection = dynamic(
  () => import("./WhatWeTreatHeroSection"),
  { loading: Loading }
);
const WhatWeTreatMissionSection = dynamic(
  () => import("./WhatWeTreatMissionSection"),
  { loading: Loading }
);
const WhatWeTreatServicesSection = dynamic(
  () => import("./WhatWeTreatServicesSection"),
  { loading: Loading }
);
const WhatWeTreatWhyChooseSection = dynamic(
  () => import("./WhatWeTreatWhyChooseSection"),
  { loading: Loading }
);

const WhatWeTreat = () => {
  return (
    <div>
      <WhatWeTreatHeroSection />
      <WhatWeTreatMissionSection />
      <WhatWeTreatServicesSection />
      <WhatWeTreatWhyChooseSection />
      <ReadyToGetStarted
        isShowVisitPerfumery={false}
        description="Connect with our licensed veterinarians today and give your pets the
          care they deserve."
      />
    </div>
  );
};

export default React.memo(WhatWeTreat);
