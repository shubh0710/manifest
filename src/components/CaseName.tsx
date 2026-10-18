import { Link } from "react-router"
import type { Case, CaseType } from "../types/case"
import "./CaseName.css"

type CaseNameProps = {
    item: Case
}

const TYPE_LABEL: Record<CaseType, string> = {
    carrier: 'Carrier',
    leasing: 'Leasing',
}

function CaseName({ item }: CaseNameProps) {
    return (
        <>
            <div className="case-name">
                <Link to={`/cases/${item.id}`}>{item.name}</Link>
                <span className="type-tag">{TYPE_LABEL[item.type]}</span>
            </div>
            {item.dot && <span className="case-dot">DOT {item.dot}</span>}
        </>
    )
}

export default CaseName