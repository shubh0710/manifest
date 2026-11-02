import type { OpenCase } from "../types/case"
import { formatEffectiveDate, formatUpdated } from "../utils/dates"
import CaseName from "./CaseName"
import CaseStatusChip from "./CaseStatusChip"

type OpenCasesTableProps = {
    cases: OpenCase[]
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
                                <CaseName item={item} to={`/cases/${item.id}`} />
                            </td>
                            <td>
                                <CaseStatusChip item={item} />
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