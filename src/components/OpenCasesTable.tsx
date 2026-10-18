import { Link } from "react-router"
import type { CaseStage, CaseType, OpenCase } from "../types/case"
import { formatEffectiveDate, formatUpdated } from "../utils/dates"
import "./OpenCasesTable.css"

type OpenCasesTableProps = {
    cases: OpenCase[]
}

const TYPE_LABEL: Record<CaseType, string> = {
    carrier: 'Carrier',
    leasing: 'Leasing',
}

const STAGE_TONE: Record<CaseStage, string> = {
    'Gathering documents': 'warn',
    'Ready to submit': 'good',
}

function OpenCasesTable({ cases }: OpenCasesTableProps) {
    return (
        <div className="card table-wrap">
            <table className="case-table">
                <thead>
                    <tr>
                        <th scope="col">Case</th>
                        <th scope="col">Stage</th>
                        <th scope="col">Effective date</th>
                        <th scope="col">Updated</th>
                    </tr>
                </thead>
                <tbody>
                    {cases.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <div className="case-name">
                                    <Link to={`/cases/${item.id}`}>{item.name}</Link>
                                    <span className="type-tag">{TYPE_LABEL[item.type]}</span>
                                </div>
                                {item.dot && <span className="case-dot">DOT {item.dot}</span>}
                            </td>
                            <td>
                                <span className={`chip ${STAGE_TONE[item.stage]}`}>{item.stage}</span>
                            </td>
                            <td className="mono">{formatEffectiveDate(item.effectiveDate)}</td>
                            <td className="mono">{formatUpdated(item.updatedAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default OpenCasesTable