import { useState } from "react"
import "./SingleSelectDropdown.css"

interface Option {
  label: string
  value: string
}

interface Props {
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
}

export default function SingleSelectDropdown({
  label,
  value,
  options,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false)

  const selectedLabel =
    options.find(o => o.value === value)?.label ?? label

  return (
    <div className="single-dropdown">
      <div
        className="single-trigger"
        onClick={() => setOpen(o => !o)}
      >
        {selectedLabel}
        <span className={`chevron ${open ? "open" : ""}`}>▾</span>
      </div>

      {open && (
        <div className="single-menu">
          {options.map(opt => (
            <div
              key={opt.value}
              className={`single-option ${
                opt.value === value ? "selected" : ""
              }`}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
