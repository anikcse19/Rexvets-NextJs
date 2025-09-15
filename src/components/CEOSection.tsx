import React from "react";

interface IProps {
  heading?: string;
  name?: string;
}

const CEOSection: React.FC<IProps> = ({
  heading = "Meet Our CEO",
  name = "Dr. Tiffany Delacruz, DVM",
}) => {
  return (
    <div className="w-full flex flex-col items-center  justify-center  md:ml-auto rounded-lg p-6 text-white md:mb-5">
      <h2 className="text-5xl text-center md:text-start font-bold mb-2 md:font-extrabold md:text-[40px] md:leading-[47px]">
        {heading}
      </h2>
      <p className="text-2xl text-center md:text-start font-bold md:text-[20px] md:leading-[32px] md:font-[600] text-[#7E9AFA]">
        {name}
      </p>
    </div>
  );
};

export default React.memo(CEOSection);
