
type MetricCardProps = {
    title: string;
    value: string;
}

export function MetricCard( { title, value } : MetricCardProps) {
    return (
        <div className="border rounded-lg p-6">
            <p className="text-sm text-gray-500">
                {title}
            </p>
            <p className="text-4xl font-bold mt-2">
                {value}
            </p>
        </div>
    );
}
