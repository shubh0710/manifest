import { Search } from "lucide-react"
import "./SearchBox.css"

type SearchBoxProps = {
    value: string
    onChange: (value: string) => void
    label: string
}

function SearchBox({ value, onChange, label }: SearchBoxProps) {
    return (
        <label className="search">
            <Search size={16} aria-hidden="true" />
            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Name or DOT"
                aria-label={label}
            />
        </label>
    )
}

export default SearchBox