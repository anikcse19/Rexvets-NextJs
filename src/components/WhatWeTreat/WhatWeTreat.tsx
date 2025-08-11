import React from "react";
import WhatWeTreatCTASection from "./WhatWeTreatCTASection";
import WhatWeTreatHeroSection from "./WhatWeTreatHeroSection";
import WhatWeTreatMissionSection from "./WhatWeTreatMissionSection";
import WhatWeTreatServicesSection from "./WhatWeTreatServicesSection";
import WhatWeTreatWhyChooseSection from "./WhatWeTreatWhyChooseSection";

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
