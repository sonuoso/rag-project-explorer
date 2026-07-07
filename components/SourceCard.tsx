interface SourceCardProps {
    filePath: string;
    chunkIndex: number;
    content: string;
}

export default function SourceCard({ filePath, chunkIndex, content }: SourceCardProps) {
    return (
            <div className="w-full p-4 border rounded-lg">
                <h5 className="text-lg">{ filePath }</h5>
                <p className="text-sm mt-1 text-gray-400">{ chunkIndex }</p>
                <pre className="bg-gray-100 rounded p-3 text-xs overflow-auto mt-2">
                    <code>
                        { content }
                    </code>
                </pre>
            </div>
    )
}