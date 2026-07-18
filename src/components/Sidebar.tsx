export function Sidebar() {

    return (
        <aside
            className="w-full md:w-64 min-h-auto md:min-h-screen flex flex-col p-4"
        >
            <h1 className="text-xl font-bold mb-8">
                Averis
            </h1>
            <nav className="flex flex-col gap-4">
                <a href="#">Dashboard</a>
                <a href="#">Project</a>
                <a href="#">Settings</a>
            </nav>
        </aside>
    )
}
