import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="not-found-page">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/">
                <button className="btn-primary">Go Home</button>
            </Link>
        </div>
    );
};

export default NotFound;
