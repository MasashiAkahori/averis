type SearchBarProps = {
    searchText: string
    onSearchTextChange: (text: string) => void
}

export function SearchBar({ searchText, onSearchTextChange }: SearchBarProps) {
    return (
        <input
            placeholder="Search"
            className="p-2 border rounded-lg"
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
        />
    )
}
