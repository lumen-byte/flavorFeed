import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Search.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [foods, setFoods] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load recent searches from local storage
        const saved = JSON.parse(localStorage.getItem('flavorfeed_recent_searches') || '[]');
        setRecentSearches(saved);

        // Pre-fetch all foods for fast client-side filtering (Frontend First Enhancement)
        const fetchAll = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/food`);
                setFoods(res.data.foodItems);
            } catch (err) {
                console.error("Search fetch error", err);
            }
        };
        fetchAll();
    }, []);

    const handleSearch = (searchTerm) => {
        const term = searchTerm || query;
        if (!term.trim()) return;

        // Save to recent
        const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('flavorfeed_recent_searches', JSON.stringify(updated));
        setQuery(term);
    };

    // Filter Logic: Check dish name, restaurant name, description, or hashtags
    const filteredFoods = query.trim() === '' ? [] : foods.filter(food => {
        const q = query.toLowerCase();
        const fName = food.name.toLowerCase();
        const rName = (food.foodPartner?.name || '').toLowerCase();
        const desc = (food.description || '').toLowerCase();
        const hTags = food.hashtags ? food.hashtags.map(t => t.toLowerCase()) : [];

        return fName.includes(q) || rName.includes(q) || desc.includes(q) || hTags.some(t => t.includes(q));
    });

    return (
        <div className="search-page">
            <div className="search-header">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search dishes, restaurants, or #hashtags..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    autoFocus
                />
                {query && <button className="clear-btn" onClick={() => setQuery('')}>✕</button>}
            </div>

            {query === '' ? (
                <div className="search-suggestions">
                    {recentSearches.length > 0 && (
                        <div className="recent-section">
                            <h4>Recent Searches</h4>
                            <div className="tags-container">
                                {recentSearches.map((s, i) => (
                                    <span key={i} className="search-tag" onClick={() => { setQuery(s); handleSearch(s); }}>
                                        🕒 {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="recent-section">
                        <h4>Trending & Hashtags</h4>
                        <div className="tags-container">
                            <span className="search-tag trending" onClick={() => setQuery('#spicy')}>🔥 #spicy</span>
                            <span className="search-tag trending" onClick={() => setQuery('#cheesy')}>🧀 #cheesy</span>
                            <span className="search-tag trending" onClick={() => setQuery('#vegan')}>🌱 #vegan</span>
                            <span className="search-tag trending" onClick={() => setQuery('#healthy')}>🥗 #healthy</span>
                            <span className="search-tag trending" onClick={() => setQuery('#streetfood')}>🏘️ #streetfood</span>
                            <span className="search-tag" onClick={() => setQuery('#dessert')}>🍰 #dessert</span>
                            <span className="search-tag" onClick={() => setQuery('#burger')}>🍔 #burger</span>
                            <span className="search-tag" onClick={() => setQuery('#pizza')}>🍕 #pizza</span>
                            <span className="search-tag" onClick={() => setQuery('#sushi')}>🍣 #sushi</span>
                            <span className="search-tag" onClick={() => setQuery('#tacos')}>🌮 #tacos</span>
                            <span className="search-tag" onClick={() => setQuery('#coffee')}>☕ #coffee</span>
                            <span className="search-tag" onClick={() => setQuery('#pasta')}>🍝 #pasta</span>
                            <span className="search-tag" onClick={() => setQuery('#bbq')}>🍗 #bbq</span>
                            <span className="search-tag" onClick={() => setQuery('#seafood')}>🦞 #seafood</span>
                            <span className="search-tag" onClick={() => setQuery('#breakfast')}>🍳 #breakfast</span>
                            <span className="search-tag" onClick={() => setQuery('#late-night')}>🌙 #late-night</span>
                            <span className="search-tag" onClick={() => setQuery('#homegrown')}>🪴 #homegrown</span>
                            <span className="search-tag" onClick={() => setQuery('#munchies')}>🍟 #munchies</span>
                            <span className="search-tag" onClick={() => setQuery('#instafood')}>📸 #instafood</span>
                            <span className="search-tag" onClick={() => setQuery('#comfortfood')}>🛋️ #comfortfood</span>
                            <span className="search-tag" onClick={() => setQuery('#gourmet')}>✨ #gourmet</span>
                            <span className="search-tag" onClick={() => setQuery('#fusion')}>🔀 #fusion</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="search-results">
                    {filteredFoods.length === 0 ? (
                        <div className="no-results">No matches found for "{query}" 😢</div>
                    ) : (
                        filteredFoods.map(food => (
                            <div key={food._id} className="search-result-card" onClick={() => navigate(`/restaurant/${food.foodPartner?._id}`)}>
                                <img src={`${food.image}?tr=w-150,h-150,q-50,f-webp`} alt={food.name} className="result-img" />
                                <div className="result-info">
                                    <h4>{food.name}</h4>
                                    <p className="result-partner">{food.foodPartner?.name || 'Local Kitchen'}</p>
                                    <p className="result-price">₹{food.price}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
