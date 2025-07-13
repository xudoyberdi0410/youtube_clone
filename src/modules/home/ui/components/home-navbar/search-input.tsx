import * as React from "react"
import { SearchIcon } from "lucide-react"
import { t } from "@/lib/i18n"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"

interface SearchInputProps {
    initialValue?: string;
}

export const SearchInput = ({ initialValue = "" }: SearchInputProps) => {
    const router = useRouter();
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            router.push(`/search?q=${encodeURIComponent(value.trim())}`);
        }
    };

    const handleClear = () => {
        setValue("");
        inputRef.current?.focus();
    };
    
    return (
        <form className="flex w-full max-w-[600px]" onSubmit={handleSubmit}>
            <div className="relative w-full">
                <input 
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={t('navbar.search')}
                    className="w-full pl-4 pr-12 py-2 rounded-l-full border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        tabIndex={-1}
                        aria-label={t('navbar.clearSearch')}
                    >
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                )}
            </div>
            <button 
                type="submit"
                className="px-5 py-2.5 bg-secondary text-secondary-foreground border border-l-0 border-input rounded-r-full hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!value.trim()}
            >
                <SearchIcon className="size-5"/>
            </button>
        </form>
    )
}