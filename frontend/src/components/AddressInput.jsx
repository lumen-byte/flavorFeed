import React, { useState } from 'react';
import '../styles/AddressInput.css';

// CONCEPT: Global Address Input System
// This component replaces the fragmented Lat/Lng location collection.
// It enforces a structured data collection for valid physical deliveries (Pincode, City, Area).

const AddressInput = ({
    initialData = null,
    onSave, // Callback function when address is confirmed
    onCancel // Callback to close modal/form
}) => {
    const [formData, setFormData] = useState(initialData || {
        label: 'Other', // Home, Work, Other
        fullAddress: '',
        area: '',
        city: '',
        pincode: '',
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear errors as user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleLabelSelect = (label) => {
        setFormData(prev => ({ ...prev, label }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullAddress.trim()) newErrors.fullAddress = 'Complete Address is required';
        if (!formData.pincode.trim() || formData.pincode.length !== 6) newErrors.pincode = 'Valid 6-digit Pincode is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveAddress = () => {
        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
        <div className="address-input-module">
            <h3 className="address-form-title">
                {initialData ? 'Edit Address' : 'Enter Complete Address'}
            </h3>

            {/* Simulated Search bar placeholder (Autocorrect hook goes here for Feature 2) */}
            <div className="form-group mb-4">
                <p className="form-helper-text">This ensures accurate delivery</p>
            </div>

            <div className="form-group">
                <label>Complete Address (House No, Building, Street) *</label>
                <input
                    type="text"
                    name="fullAddress"
                    className={`form-control ${errors.fullAddress ? 'is-invalid' : ''}`}
                    placeholder="e.g. Flat 101, Supertech Supernova"
                    value={formData.fullAddress}
                    onChange={handleInputChange}
                />
                {errors.fullAddress && <small className="error-text">{errors.fullAddress}</small>}
            </div>

            <div className="form-row">
                <div className="form-group half">
                    <label>Area / Sector</label>
                    <input
                        type="text"
                        name="area"
                        className="form-control"
                        placeholder="e.g. Sector 62"
                        value={formData.area}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group half">
                    <label>City *</label>
                    <input
                        type="text"
                        name="city"
                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                        placeholder="e.g. Noida"
                        value={formData.city}
                        onChange={handleInputChange}
                    />
                    {errors.city && <small className="error-text">{errors.city}</small>}
                </div>
            </div>

            <div className="form-group">
                <label>Pincode *</label>
                <input
                    type="number"
                    name="pincode"
                    className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
                    placeholder="e.g. 201301"
                    value={formData.pincode}
                    onChange={handleInputChange}
                />
                {errors.pincode && <small className="error-text">{errors.pincode}</small>}
            </div>

            <div className="form-group mt-3">
                <label>Save this address as</label>
                <div className="address-labels">
                    {['Home', 'Work', 'Other'].map(label => (
                        <button
                            key={label}
                            type="button"
                            className={`label-chip ${formData.label === label ? 'active' : ''}`}
                            onClick={() => handleLabelSelect(label)}
                        >
                            {label === 'Home' ? '🏠' : label === 'Work' ? '💼' : '📍'} {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="address-actions">
                {onCancel && <button className="btn-cancel" onClick={onCancel}>Cancel</button>}
                <button className="btn-save" onClick={handleSaveAddress}>Save Address</button>
            </div>
        </div>
    );
};

export default AddressInput;
