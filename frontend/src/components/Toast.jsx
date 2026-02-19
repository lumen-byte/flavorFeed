import React from 'react';
import '../styles/Toast.css';

const Toast = ({ message, type, onClose }) => {
    return (
        <div className={`toast toast-${type}`}>
            <span>{message}</span>
            <button onClick={onClose} className="toast-close">×</button>
        </div>
    );
};

export default Toast;
