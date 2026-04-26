"use client";

import { useId, useState } from "react";
import ReactSelect, {
  type Props as ReactSelectProps,
  type StylesConfig,
  type GroupBase,
  components,
  type DropdownIndicatorProps
} from "react-select";
import { cn } from "@/utils/string";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<ReactSelectProps<SelectOption, false, GroupBase<SelectOption>>, "styles" | "theme"> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  isFocused?: boolean;
  variant?: "default" | "glass";
  menuPortalTarget?: HTMLElement | null;
  menuPosition?: "absolute" | "fixed";
}

const DropdownIndicator = (props: DropdownIndicatorProps<SelectOption, false>) => {
  const variant = (props.selectProps as SelectProps).variant;
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className={cn(
        "w-4 h-4 transition-transform duration-300",
        props.selectProps.menuIsOpen && "rotate-180",
        variant === "glass" ? "text-white" : "text-on-surface-subtle"
      )} />
    </components.DropdownIndicator>
  );
};

export const Select = ({
  className,
  containerClassName,
  label,
  error,
  helperText,
  isFocused: externalFocused,
  options,
  value,
  onChange,
  placeholder,
  isSearchable = false,
  variant = "default",
  menuPortalTarget,
  menuPosition,
  ...props
}: SelectProps) => {
  const t = useTranslations("common");
  const reactId = useId();
  const [internalFocused, setInternalFocused] = useState(false);
  const isFocused = externalFocused || internalFocused;

  const isGlass = variant === "glass";

  const defaultPlaceholder = t("common.select_placeholder");
  const finalPlaceholder = placeholder || defaultPlaceholder;

  const customStyles: StylesConfig<SelectOption, false> = {
    control: (provided) => ({
      ...provided,
      minHeight: "unset",
      height: isGlass ? "auto" : "56px",
      backgroundColor: isGlass
        ? "transparent"
        : isFocused ? "rgba(var(--surface-container-low), 0.3)" : "transparent",
      border: "none",
      borderBottom: isGlass
        ? "none"
        : `1px solid ${error ? "#ef4444" : isFocused ? "#8b6a55" : "#262626"}`,
      borderRadius: "0",
      boxShadow: "none",
      padding: "0",
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      position: "relative", // Required for absolute indicatorsContainer
      "&:hover": {
        backgroundColor: isGlass ? "transparent" : "rgba(var(--surface-container-low), 0.1)",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0",
      paddingTop: isGlass ? "2px" : "0",
      margin: "0",
      justifyContent: isGlass ? "center" : "flex-start",
      textAlign: isGlass ? "center" : "left",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0",
      padding: "0",
      color: isGlass ? "white" : "var(--color-foreground)",
      fontSize: "1rem",
      fontWeight: "500",
      textAlign: isGlass ? "center" : "left",
    }),
    singleValue: (provided) => ({
      ...provided,
      margin: "0",
      color: isGlass ? "white" : "var(--color-foreground)",
      fontSize: "16px",
      fontWeight: "500",
      width: "100%",
      textAlign: isGlass ? "center" : "left",
    }),
    placeholder: (provided) => ({
      ...provided,
      margin: "0",
      color: isGlass ? "rgba(255, 255, 255, 0.7)" : "#737373",
      fontSize: "16px",
      fontWeight: "500",
      width: "100%",
      textAlign: isGlass ? "center" : "left",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      position: isGlass ? "absolute" : "static",
      right: isGlass ? "0" : "auto",
      top: "50%",
      transform: isGlass ? "translateY(-50%)" : "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: isGlass ? "white" : (isFocused ? "#8b6a55" : "#737373"),
      padding: "0",
      paddingRight: isGlass ? "8px" : "0",
      transition: "color 0.3s ease",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#080808",
      borderRadius: "12px",
      border: "1px solid #262626",
      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4)",
      overflow: "hidden",
      zIndex: 50,
      marginTop: "8px",
      padding: "4px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#8b6a55"
        : state.isFocused
          ? "#171717"
          : "transparent",
      color: state.isSelected ? "#ffffff" : "#d4d4d4",
      fontSize: "14px",
      fontWeight: state.isSelected ? "700" : "500",
      padding: "10px 12px",
      borderRadius: "8px",
      marginBottom: "2px",
      cursor: "pointer",
      "&:active": {
        backgroundColor: state.isSelected ? "#8b6a55" : "#171717",
      },
      transition: "all 0.15s ease",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <div className={cn("w-full group", containerClassName)}>
      {label && (
        <label
          className={cn(
            "block text-xs font-bold mb-1 uppercase tracking-widest transition-all duration-300 transform",
            isFocused || error || value
              ? "translate-y-0 opacity-100"
              : "text-transparent -translate-y-1 opacity-0",
            isFocused ? "text-[#8b6a55]" : (error ? "text-red-500" : "text-[#737373]")
          )}
        >
          {label}
        </label>
      )}

      <ReactSelect
        instanceId={props.instanceId || reactId}
        components={{ DropdownIndicator }}
        onFocus={() => setInternalFocused(true)}
        onBlur={() => setInternalFocused(false)}
        styles={customStyles}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={finalPlaceholder}
        isSearchable={isSearchable}
        menuPortalTarget={menuPortalTarget}
        menuPosition={menuPosition}
        className={className}
        {...props}
      />

      <div className="h-5 overflow-hidden">
        {error && (
          <p className="mt-1 text-xs text-red-500 animate-in fade-in slide-in-from-top-1 duration-300">
            {error}
          </p>
        )}
      </div>

      {helperText && !error && (
        <p className="text-[#737373] text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
};
