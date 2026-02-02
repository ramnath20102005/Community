import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./comp_css/DetailModal.css";

const DetailModal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const modalLayout = (
        <div className="modal-overlay" onClick={onClose}>
            <button className="modal-close" onClick={onClose} aria-label="Close modal">
                ✕
            </button>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(modalLayout, document.body);
};

export default DetailModal;
