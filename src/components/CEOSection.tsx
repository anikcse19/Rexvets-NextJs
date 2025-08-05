import React from "react";

const CEOSection: React.FC = () => {
  return (
    <div className=" w-fit flex flex-col items-center justify-center md:w-[550px] md:ml-auto rounded-lg p-6 text-white md:mb-8">
      <h2 className="text-2xl mb-2 md:font-extrabold md:text-[40px] md:leading-[47px]">
        Meet Our CEO
      </h2>
      <p className=" text-sm md:text-[20px] md:leading-[32px] mb-2 md:font-[600] text-[#7E9AFA] ">
        Dr. Tiffany Delacruz, DVM
      </p>
    </div>
  );
};

export default CEOSection;
