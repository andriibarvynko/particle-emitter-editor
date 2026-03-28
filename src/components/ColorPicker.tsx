interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  tooltip?: string;
}

function normalizeToHash(color: string): string {
  const bare = color.replace('#', '');
  return `#${bare}`;
}

export function ColorPicker({ value, onChange, tooltip }: ColorPickerProps) {
  return (
    <input
      type="color"
      className="color-picker"
      value={normalizeToHash(value)}
      onChange={(e) => onChange(e.target.value)}
      title={tooltip}
    />
  );
}
