import React, { useRef, useState, useEffect } from 'react';
import '../styles/VideoCard.css';

const VideoCard = ({ foodItem }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Toggle play/pause on click
    const handleVideoPress = () => {
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    // Auto-play when visible (Intersection Observer)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoRef.current.play();
                        setIsPlaying(true);
                    } else {
                        videoRef.current.pause();
                        setIsPlaying(false);
                    }
                });
            },
            { threshold: 0.6 } // Play when 60% visible
        );

        const currentVideo = videoRef.current;

        if (currentVideo) {
            observer.observe(currentVideo);
        }

        return () => {
            if (currentVideo) {
                observer.unobserve(currentVideo);
            }
        };
    }, []);

    return (
        <div className="video-card">
            {/* Video Header / Overlay Info */}
            <div className="video-overlay">
                <h3>{foodItem.name}</h3>
                <p>{foodItem.description}</p>
            </div>

            <video
                ref={videoRef}
                onClick={handleVideoPress}
                className="video-player"
                src={foodItem.video ? `${foodItem.video}?tr=w-720,q-60,f-mp4` : ''}
                loop
                muted={false}
                playsInline
                preload="none"
            />

            {/* Play Icon Overlay (optional) */}
            {!isPlaying && <div className="play-icon">▶</div>}
        </div>
    );
};

export default VideoCard;