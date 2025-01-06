import { BASE_URL } from "@/api";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";

const Hero = ({ userInfo, authUsername, toggleModal}) => {
  console.log(userInfo);
  return (
    <div className="padding-x py-9 max-container flex flex-col items-center justify-center gap-4 bg-[#F6F6F7] dark:bg-[#242535] rounded-md">
      <div className="flex gap-4">
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
          {userInfo?.profile_picture ? (
            <img
              src={`${BASE_URL}${userInfo.profile_picture}`}
              className="w-[70px] h-[70px] rounded-full object-cover"
            />
          ) : (
            <div className="bg-gray-300 w-[70px] h-[70px] rounded-full flex items-center justify-center">
              <span>No Image</span>
            </div>
          )}
        </div>

        <span>
          <p className="text-[18px] text-[#181A2A] dark:text-white">
            {userInfo.username || "Anonymous"}
          </p>
          <p className="text-[14px] text-[#696A75] font-thin dark:text-[#BABABF]">
            {userInfo.user_tag || "tags are on the way"}
          </p>
        </span>

        {userInfo?.username === authUsername && 
          <span>
            <HiPencilAlt onClick={toggleModal} className="dark:text-white text-2 cursor-pointer" />
          </span>}

      </div>

      <p className="text-[#3B3C4A] text-[16px] max-md:leading-[2rem] lg:leading-normal lg:mx-[200px] text-center dark:text-[#BABABF]">
        {userInfo.bio}
      </p>

      <div className="flex gap-4 justify-center items-center text-white text-xl">
        <div className="w-[40px] h-[40px] rounded-lg bg-[#696A75] flex justify-center items-center">
          <FaInstagram />
        </div>
        <div className="w-[40px] h-[40px] rounded-lg bg-[#696A75] flex justify-center items-center">
          <FaLinkedinIn />
        </div>
      </div>
    </div>
  );
};

export default Hero;
