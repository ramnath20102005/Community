const Card = ({
    children,
    title,
    subtitle,
    footer,
    className = "",
    onClick,
    hoverable = false
}) => {
    return (
        <div
            className={`card ${hoverable ? "hoverable" : ""} ${className}`}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {(title || subtitle) && (
                <div className="card-header">
                    {title && <h3 className="card-title">{title}</h3>}
                    {subtitle && <p className="card-subtitle">{subtitle}</p>}
                </div>
            )}

            <div className="card-body">
                {children}
            </div>

            {footer && (
                <div className="card-footer">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
