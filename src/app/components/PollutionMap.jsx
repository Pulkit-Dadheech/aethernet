export default function PollutionMap() {
    return (
        <div className="w-full h-full bg-card rounded-lg shadow-md p-4 mt-8 border border-border transition-colors">
            <h3 className="text-lg font-semibold mb-4 text-primary text-center">Pollution Map</h3>
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                {/* Placeholder for map */}
                <span className="text-muted-foreground">Map will be displayed here</span>
            </div>
        </div>
    );
}