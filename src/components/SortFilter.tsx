import { PROJECT_SORT_OPTION, ProjectSortOption } from "@/types/project"

type sortFilterProps = {
    option: ProjectSortOption
    onOptionChange: (option: ProjectSortOption) => void;
}

export function SortFilter({ option, onOptionChange }: sortFilterProps) {
    return (
        <select
            value={option}
            onChange={(e) => onOptionChange(e.target.value as ProjectSortOption)}
        >
            {PROJECT_SORT_OPTION.map((sort_option) => (
                <option key={sort_option} value={sort_option}>{sort_option}</option>
            ))}
        </select>
    )
}
