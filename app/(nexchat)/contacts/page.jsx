import React from "react";

const Contacts = () => {
  return (
    <div className="flex flex-col gap-[20px] w-[100%] h-[100%] rounded-[20px]  text-[#ffffff] ">
      <div className="p-[20px] text-[22px] font-medium animate__animated  animate__fadeIn h-[80px] bg-[#23262f] rounded-[20px] flex items-center">
        <h1>Contacts</h1>
      </div>
      <div className="animate__animated  animate__fadeIn bg-[#23262f] h-[calc(100%-70px)] p-[20px] rounded-[20px]"></div>
    </div>
  );
};

export default Contacts;
