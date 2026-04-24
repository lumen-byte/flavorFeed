import React, { useState } from 'react';
import '../styles/QuantityModal.css';

// CONCEPT: Lifting State & Modals
// This component floats above the screen (using CSS fixed positioning).
// It maintains a local state `quantity` to let the user choose how many items they want.
// When the user clicks "Confirm", it calls `onConfirm(quantity)`, passing the data UP 
// to the parent component (ReelCard), which then sends it to the CartContext.

const QuantityModal = ({ isOpen, onClose, onConfirm, foodName, foodPrice = 0, foodAddOns = [] }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedAddOns, setSelectedAddOns] = useState([]);

    if (!isOpen) return null; // Only render when triggered

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const toggleAddOn = (id) => {
        setSelectedAddOns(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const addOnsTotal = selectedAddOns.reduce((total, id) => {
        const addon = foodAddOns.find(a => a._id === id);
        return total + (addon ? addon.price : 0);
    }, 0);

    const totalPrice = (foodPrice + addOnsTotal) * quantity;

    const handleConfirm = () => {
        // Safely extending the API: we only pass quantity to not break the backend, 
        // but a real app would also send the selectedAddOns array.
        onConfirm(quantity, selectedAddOns);
        setQuantity(1); // Reset for next time
        setSelectedAddOns([]);
        onClose();
    };

    return (
        <div className="modal-overlay bottom-sheet-overlay" onClick={onClose}>
            {/* stopPropagation prevents clicking inside the modal from closing it */}
            <div className="modal-content bottom-sheet" onClick={(e) => e.stopPropagation()}>
                <div className="drag-handle"></div>
                <h3 style={{ marginTop: '10px' }}>Customize Order</h3>
                <p className="food-name-header">{foodName}</p>

                {foodAddOns.length > 0 && (
                    <div className="add-ons-section">
                        <h4 style={{ textAlign: 'left', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Add-ons (Optional)</h4>
                        {foodAddOns.map(addon => (
                            <div
                                key={addon._id}
                                className={`addon-row ${selectedAddOns.includes(addon._id) ? 'selected' : ''}`}
                                onClick={() => toggleAddOn(addon._id)}
                            >
                                <div className="addon-info">
                                    <span className="checkbox">{selectedAddOns.includes(addon._id) ? '☑' : '☐'}</span>
                                    <span>{addon.name}</span>
                                </div>
                                <span className="addon-price">+₹{addon.price}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="quantity-controls">
                    <button className="qty-btn" onClick={handleDecrement}>-</button>
                    <span className="qty-display">{quantity}</span>
                    <button className="qty-btn" onClick={handleIncrement}>+</button>
                </div>

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="confirm-btn" onClick={handleConfirm}>
                        Add to Cart • ₹{totalPrice}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuantityModal;
