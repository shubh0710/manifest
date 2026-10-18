import type { CaseOutcome, ClosedCase } from "../types/case"
import { formatDate } from "../utils/dates"
import CaseName from "./CaseName"

type ClosedCasesTableProps = {
    cases: ClosedCase[]
}

const OUTCOME_TONE: Record<CaseOutcome, string> = {
    Bound: 'good',
    'Quoted, not bound': '',
    'Declined by markets': 'bad',
}

function ClosedCasesTable({ cases }: ClosedCasesTableProps) {
    return (
        <div className="card table-wrap">
            <table className="case-table">
                <thead>
                    <tr>
                        <th scope="col">Case</th>
                        <th scope="col">Outcome</th>
                        <th scope="col">Markets submitted</th>
                        <th scope="col">Closed on</th>
                    </tr>
                </thead>
                <tbody>
                    {cases.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <CaseName item={item} />
                            </td>
                            <td>
                                <span className={`chip ${OUTCOME_TONE[item.outcome]}`}>{item.outcome}</span>
                            </td>
                            <td className="mono">{item.marketsSubmitted}</td>
                            <td className="mono">{formatDate(item.closedOn)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ClosedCasesTable