import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <p className="text-gray-600 mb-4">Page not found</p>
            <Link to="/" className="text-blue-500 underline">
                Go to Home
            </Link>
        </div>
    );
};

export default NotFound;