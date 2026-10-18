import { Link } from "react-router"
import type { CaseType } from "../types/case"
import "./CaseName.css"

type CaseNameProps = {
    item: {
        name: string
        type: CaseType
        dot?: string
    }
    to?: string
}

const TYPE_LABEL: Record<CaseType, string> = {
    carrier: 'Carrier',
    leasing: 'Leasing',
}

function CaseName({ item, to }: CaseNameProps) {
    return (
        <>
            <div className="case-name">
                {to ? <Link to={to}>{item.name}</Link> : <strong>{item.name}</strong>}
                <span className="type-tag">{TYPE_LABEL[item.type]}</span>
            </div>
            {item.dot && <span className="case-dot">DOT {item.dot}</span>}
        </>
    )
}

export default CaseName