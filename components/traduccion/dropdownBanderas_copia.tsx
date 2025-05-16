import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import Image from "next/image";

import useOutsideClick from "@/hooks/useOutsideClick";

type Option = {
  value: string;
  flag: string;
};

const DropdownBanderas = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { i18n } = useTranslation();
  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => {
    setIsOpen(false);
  });

  const options: Option[] = [
    { value: "es", flag: "es.png" },
    { value: "en", flag: "us.png" },
  ];

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    document.cookie = `selectedLanguage=${value}; path=/; max-age=31536000`;
    localStorage.setItem("selectedLanguage", value);
    setIsOpen(false);
  };

  const currentLanguage =
    options.find((opt) => opt.value === i18n.language) || options[0];

  return (
    <div ref={dropdownRef} className="relative z-[1000]">
      <button
        className="flex items-center justify-between w-[100%] py-[2px] px-[4px] bg-[#BBB5] border border-[#AAA] rounded-md shadow-sm z-[1000]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          alt={`${currentLanguage.value} flag`}
          className="inline-block"
          height={15}
          src={`/${currentLanguage.flag}`}
          width={20}
        />
        <FaChevronDown
          className={`ml-[2px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""} inline-block w-[8px] h-[8px]`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-[0px] mt-[2px] w-[40px] rounded-md shadow-lg bg-[#DDD] ring-[1px] ring-black ring-opacity-[5px] transition-colors duration-300 ease-in-out hover:bg-lightGrey z-[1000]">
          <div
            aria-labelledby="options-menu"
            aria-orientation="vertical"
            className="py-[1px] z-[1000]"
            role="menu"
          >
            {options
              .filter((option) => option.value !== currentLanguage.value)
              .map((option) => (
                <button
                  key={option.value}
                  className="block w-[100%] text-left px-[4px] py-[2px] text-sm text-gray-700 z-[999]"
                  role="menuitem"
                  onClick={() => handleLanguageChange(option.value)}
                >
                  <Image
                    alt={`${option.value} flag`}
                    className="inline-block"
                    height={15}
                    src={`/${option.flag}`}
                    width={20}
                  />
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownBanderas;
