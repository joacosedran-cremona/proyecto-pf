import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';
import useOutsideClick from '@/hooks/useOutsideClick';

type Option = {
    value: string;
    flag: string;
}

const DropdownBanderas = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { i18n } = useTranslation();
    const dropdownRef = useRef(null);

    useOutsideClick(dropdownRef, () => {
        setIsOpen(false);
    });

    const options: Option[] = [
        { value: 'es', flag: '🇪🇸' },
        { value: 'en', flag: '🇺🇸' }
    ];

    const handleLanguageChange = (value: string) => {
        i18n.changeLanguage(value);
        document.cookie = `selectedLanguage=${value}; path=/; max-age=31536000`;
        localStorage.setItem('selectedLanguage', value);
        setIsOpen(false);
    };

    const currentLanguage = options.find(opt => opt.value === i18n.language) || options[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                className="flex items-center justify-between w-full py-2 px-4 bg-[#BBB5] border border-[#AAA] rounded-md shadow-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                {currentLanguage.flag}
                <FaChevronDown className={`ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} inline-block w-8 h-8`} />
            </button>
            
            
            {isOpen && (
                    <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-[#DDD] ring-1 ring-black ring-opacity-5 transition-colors duration-300 ease-in-out hover:bg-lightGrey">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {options
                            .filter(option => option.value !== currentLanguage.value)
                            .map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleLanguageChange(option.value)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700"
                                    role="menuitem"
                                >
                                    {option.flag}
                                </button>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownBanderas;