"use client";
import dynamic from "next/dynamic";
import React from "react";
const Loading = () => <p>Loading...</p>;

const WhatWeTreatCTASection = dynamic(() => import("./WhatWeTreatCTASection"), {
  loading: Loading,
});
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
      <WhatWeTreatCTASection />
    </div>
  );
};

export default React.memo(WhatWeTreat);
