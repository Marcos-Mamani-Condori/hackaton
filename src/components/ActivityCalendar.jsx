"use client";
const ActivityCalendar = ({ activities }) => {

    const displayedActivities = activities.slice(0, 5);

    return (
        <div className="w-full max-w-md p-4 bg-white border border-gray-300 rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-red-800">Actividades</h2>
            {displayedActivities.length > 0 ? (
                <ul>
                    {displayedActivities.map((activity, index) => (
                        <li key={index} className="flex items-center p-2">
                            <a href="#" className="flex items-center w-full text-gray-700 hover:underline">
                                <div className="flex flex-col items-center justify-center w-16 h-16 mr-4 text-white bg-gray-800 rounded">
                                    <span className="text-2xl font-bold">{activity.day}</span>
                                    <span className="text-xs uppercase">{activity.month}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{activity.title}</p>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No hay actividades disponibles</p>
            )}
        </div>
    );
};

export default ActivityCalendar;