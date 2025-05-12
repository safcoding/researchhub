import type {Grant} from '@/hooks/grant-logic';

interface GrantsTableProps {
    grants: Grant[];
}

export function GrantTable({ grants }: GrantsTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                    <tr>
                    <th className="px-6 py-3 text-left">COST CENTER CODE</th>
                                <th className="px-6 py-3 text-left">PL STAFF NUMBER</th>
                                <th className="px-6 py-3 text-left">PL NAME</th>
                                <th className="px-6 py-3 text-left">PROJECT RESEARCH ALLIANCE</th>
                                <th className="px-6 py-3 text-left">RESEARCH GROUP</th>
                                <th className="px-6 py-3 text-left">PROJECT TITLE</th>
                                <th className="px-6 py-3 text-left">DATE START</th>
                                <th className="px-6 py-3 text-left">DATE END</th>
                                <th className="px-6 py-3 text-left">GRANT TYPE</th>
                                <th className="px-6 py-3 text-left">PROJECT STATUS</th>
                                <th className="px-6 py-3 text-left">SPONSOR CATEGORY</th>
                                <th className="px-6 py-3 text-left">SUBSPONSOR NAME</th>
                                <th className="px-6 py-3 text-left">APPROVED AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    {grants.map((grant) => (
                        <tr key={grant.PROJECTID} className="border-b">
                                    <td className="px-6 py-4">{grant.COST_CENTER_CODE}</td>
                                    <td className="px-6 py-4">{grant.PL_STAFF_NO}</td>
                                    <td className="px-6 py-4">{grant.PL_NAME}</td>
                                    <td className="px-6 py-4">{grant.PTJ_RESEARCH_ALLIANCE}</td>
                                    <td className="px-6 py-4">{grant.RESEARCH_GROUP}</td>
                                    <td className="px-6 py-4">{grant.PROJECT_TITLE}</td>
                                    <td className="px-6 py-4">{grant.PRO_DATESTART}</td>
                                    <td className="px-6 py-4">{grant.PRO_DATEEND}</td>
                                    <td className="px-6 py-4">{grant.GRANT_TYPE}</td>
                                    <td className="px-6 py-4">{grant.PROJECT_STATUS}</td>
                                    <td className="px-6 py-4">{grant.SPONSOR_CATEGORY}</td>
                                    <td className="px-6 py-4">{grant.SUBSPONSOR_NAME}</td>
                                    <td className="px-6 py-4">${grant.PRO_APPROVED}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}