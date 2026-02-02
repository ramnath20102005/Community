const Loader = ({ size = "medium", fullScreen = false, message = "Loading..." }) => {
    const sizeClasses = {
        small: "loader-small",
        medium: "loader-medium",
        large: "loader-large",
    };

    if (fullScreen) {
        return (
            <div className="loader-fullscreen">
                <div className={`loader ${sizeClasses[size]}`}>
                    <div className="spinner"></div>
                    {message && <p className="loader-message">{message}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="loader-container">
            <div className={`loader ${sizeClasses[size]}`}>
                <div className="spinner"></div>
                {message && <p className="loader-message">{message}</p>}
            </div>
        </div>
    );
};

export default Loader;
