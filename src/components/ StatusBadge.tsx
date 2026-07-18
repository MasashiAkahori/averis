import { ProjectStatus } from "@/types/project"

type StatusBadgeProps = {
    status: ProjectStatus
}

const STATUS_COLORS = {
    Healthy: "bg-green-100 text-green-700",
    Failed: "bg-red-100 text-red-700",
    Building: "bg-yellow-100 text-yellow-700",
    Paused: "bg-gray-100 text-gray-700",
};

export function StatusBadge( { status }: StatusBadgeProps ) {
    return (
        <span className={STATUS_COLORS[status]}>{status}</span>
    )
}
