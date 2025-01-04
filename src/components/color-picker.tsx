interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#808080', '#800000'
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2">
      {colors.map((c) => (
        <button
          key={c}
          className={`w-6 h-6 rounded-full border-2 ${
            c === color ? 'border-white' : 'border-transparent'
          }`}
          style={{ backgroundColor: c }}
          onClick={() => onChange(c)}
        />
      ))}
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6"
      />
    </div>
  );
}