import { useState } from "react"
import "./CheckboxDropdown.css";

interface Option {
  label: string
  value: string
}

interface Props {
  label: string
  options: Option[]
  value: string[]
  onChange: (next: string[]) => void
}

export default function CheckboxDropdown({
  label,
  options,
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false)

  const toggle = (v: string) => {
    onChange(
      value.includes(v)
        ? value.filter(x => x !== v)
        : [...value, v]
    )
  }
  const selectedLabels = options
  .filter(opt => value.includes(opt.value))
  .map(opt => opt.label)

    const displayText =
    selectedLabels.length > 0
        ? selectedLabels.join(', ')
        : label


  return (
    <div className="checkbox-dropdown">
      <div
        className="checkbox-trigger"
        onClick={() => setOpen(o => !o)}
      >
        {displayText}
        <span className={`chevron ${open ? 'open' : ''}`}>▾</span>
      </div>


      {open && (
        <div className="checkbox-menu">
          {options.map(opt => (
            <label key={opt.value} className="checkbox-row">
              <span>{opt.label}</span>
              <input
                type="checkbox"
                checked={value.includes(opt.value)}
                onChange={() => toggle(opt.value)}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
