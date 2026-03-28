interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  tooltip?: string;
}

export function NumberInput({ value, onChange, min, max, step = 1, label, tooltip }: NumberInputProps) {
  return (
    <input
      type="number"
      className="number-input"
      value={value}
      onChange={(e) => {
        const v = parseFloat(e.target.value);
        if (!isNaN(v)) onChange(v);
      }}
      min={min}
      max={max}
      step={step}
      title={tooltip}
      aria-label={label}
    />
  );
}
