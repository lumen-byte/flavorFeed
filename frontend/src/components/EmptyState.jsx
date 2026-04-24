import React from 'react';
import { useNavigate } from 'react-router-dom';

// CONCEPT: Reusable Empty States
// Instead of creating 5 different blank pages, we create one highly customizable component.
// Prop destructuring makes it flexible: supply an icon, title, subtitle, and an action button.
const EmptyState = ({
    icon = '📭',
    title = 'Nothing here yet',
    subtitle = 'Looks like you haven\'t added anything.',
    actionText,
    actionLink = '/'
}) => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center',
            height: '100%',
            minHeight: '50vh'
        }}>
            <div style={{ fontSize: '4rem', marginBottom: '15px', opacity: 0.8 }}>
                {icon}
            </div>

            <h3 style={{
                color: 'var(--text-main)',
                marginBottom: '10px',
                fontSize: '1.25rem',
                fontWeight: '600'
            }}>
                {title}
            </h3>

            <p style={{
                color: 'var(--text-muted)',
                marginBottom: '25px',
                fontSize: '0.95rem',
                maxWidth: '300px'
            }}>
                {subtitle}
            </p>

            {actionText && (
                <button
                    onClick={() => navigate(actionLink)}
                    style={{
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '25px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        fontSize: '0.95rem'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                    {actionText}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
