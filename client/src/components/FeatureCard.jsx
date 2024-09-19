
export default function FeatureCard({
    icon,
    title,
    description
}){
    return (
        <div className=" w-64 h-36 rounded border-gray-900 border-[.0001px] p-4">
            <div className="text-4xl mb-2">{icon}</div>
            <p className="font-bold">{title}</p>
            <p className="text-gray-600">{description}</p>
        </div>
    )
}