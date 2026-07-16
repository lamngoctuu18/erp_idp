import { NumberInput } from "@mantine/core";

export interface NumberInputERPProps {
  label: string;
  placeholder?: string;
  value?: number | "";
  onChange: (value: number | undefined) => void;
  suffix?: string;
  allowDecimal?: boolean;
  decimalScale?: number;
  min?: number;
  max?: number;
  error?: React.ReactNode;
  withAsterisk?: boolean;
}

export function NumberInputERP({
  label,
  placeholder = "Nhập giá trị...",
  value,
  onChange,
  suffix = " VND",
  allowDecimal = false,
  decimalScale = 2,
  min = 0,
  max,
  error,
  withAsterisk = false,
}: NumberInputERPProps) {
  const inputStyles = {
    label: { fontWeight: 600, marginBottom: 6 },
  };

  return (
    <NumberInput
      label={label}
      placeholder={placeholder}
      value={value === "" ? undefined : value}
      onChange={(val) => {
        if (typeof val === "number") {
          onChange(val);
        } else if (typeof val === "string" && val !== "") {
          const num = parseFloat(val);
          onChange(isNaN(num) ? undefined : num);
        } else {
          onChange(undefined);
        }
      }}
      thousandSeparator=","
      decimalSeparator="."
      suffix={suffix}
      decimalScale={allowDecimal ? decimalScale : 0}
      min={min}
      max={max}
      error={error}
      withAsterisk={withAsterisk}
      styles={inputStyles}
    />
  );
}
