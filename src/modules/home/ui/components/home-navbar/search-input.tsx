import * as React from "react"
import { SearchIcon } from "lucide-react"
import { t } from "@/lib/i18n"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const SearchInput = () => {
    const router = useRouter();
    const [value, setValue] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            router.push(`/search?q=${encodeURIComponent(value.trim())}`);
        }
    };
    
    return (
        <form className="flex w-full max-w-[600px]" onSubmit={handleSubmit}>
            <div className="relative w-full">
                <input 
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={t('navbar.search')}
                className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500" />
                {/* TODO: add remove search button */}
            </div>
            <button 
                type="submit"
                className="px-5 py-2.5 bg-gray-100 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!value.trim()}
            >
                <SearchIcon className="size-5"/>
            </button>
        </form>
    )
}