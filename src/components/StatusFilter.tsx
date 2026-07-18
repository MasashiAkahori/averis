import { PROJECT_STATUS, FILTER_STATUS, ProjectStatusFilter } from "@/types/project"

type StatusFilterProps = {
    status: ProjectStatusFilter;
    onStatusChange: (status: ProjectStatusFilter) => void;
}

export function StatusFilter({status, onStatusChange}: StatusFilterProps) {
    return (
        <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as ProjectStatusFilter)}
        >
            {FILTER_STATUS.map((filter_status) => (
                <option key={filter_status} value={filter_status}>
                    {filter_status}
                </option>
            ))}
        </select>
    )
}