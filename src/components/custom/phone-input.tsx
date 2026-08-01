import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";

type PhoneInputProps = Omit<ComponentProps<typeof Input>, "onChange"> & {
  onChange?: (value: string) => void;
};

function PhoneInput({ onChange, className, ...props }: PhoneInputProps) {
  return (
    <Input
      type="tel"
      inputMode="tel"
      autoComplete="off"
      className={className}
      onChange={(event) => {
        const next = event.target.value.replace(/[^\d]/g, "");
        onChange?.(next);
      }}
      {...props}
    />
  );
}

export { PhoneInput }
