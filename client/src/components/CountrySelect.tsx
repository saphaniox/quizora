import { useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

import { COUNTRIES, countryFlag, type CountryDialCode } from "@/lib/countries";
import { cn } from "@/lib/utils";

interface CountrySelectProps {
  id: string;
  label?: string;
  value: CountryDialCode | null;
  onChange: (country: CountryDialCode | null) => void;
  placeholder?: string;
  allowEmpty?: boolean;
  showDialCode?: boolean;
  className?: string;
  buttonClassName?: string;
}

export function CountrySelect({
  id,
  label,
  value,
  onChange,
  placeholder = "Select country",
  allowEmpty = false,
  showDialCode = false,
  className,
  buttonClassName,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filteredCountries = useMemo(() => {
    const term = search.trim().toLowerCase().replace(/^\+/, "");
    if (!term) return COUNTRIES;
    return COUNTRIES.filter((country) => {
      return (
        country.name.toLowerCase().includes(term) ||
        country.iso.toLowerCase().includes(term) ||
        country.dialCode.includes(term)
      );
    });
  }, [search]);

  const selectedLabel = value
    ? `${countryFlag(value.iso)} ${value.name}${showDialCode ? ` ${value.dialCode}` : ""}`
    : placeholder;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className={cn("relative", label && "mt-1.5")}>
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2.5 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            buttonClassName,
          )}
        >
          <span className="min-w-0">
            <span
              className={cn(
                "block truncate font-medium",
                value ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {selectedLabel}
            </span>
            {value && showDialCode && (
              <span className="block truncate text-xs text-muted-foreground">{value.iso}</span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>

        {open && (
          <div className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-lg border border-border bg-popover shadow-lg sm:w-80">
            <div className="border-b border-border p-2">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  autoFocus
                  placeholder="Search country or code"
                  className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
            </div>
            <div className="max-h-60 overflow-y-auto py-1" role="listbox">
              {allowEmpty && (
                <button
                  type="button"
                  role="option"
                  aria-selected={!value}
                  onClick={() => {
                    onChange(null);
                    setSearch("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-popover-foreground">No country shown</span>
                </button>
              )}
              {filteredCountries.map((country) => (
                <button
                  key={`${country.iso}-${country.dialCode}`}
                  type="button"
                  role="option"
                  aria-selected={country.iso === value?.iso}
                  onClick={() => {
                    onChange(country);
                    setSearch("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-popover-foreground">
                      <span aria-hidden="true">{countryFlag(country.iso)}</span> {country.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">{country.iso}</span>
                  </span>
                  {showDialCode && (
                    <span className="shrink-0 font-medium text-primary">{country.dialCode}</span>
                  )}
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No country found.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
