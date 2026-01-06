import React, {forwardRef, useEffect, useState} from 'react';
import './Slide.css';

interface SlideProps {
    children: React.ReactNode;
}

const SLIDE_WIDTH = 960;
const SLIDE_HEIGHT = 540;

function getScale() {
    if (typeof window === 'undefined') {
        return 1;
    }
    const availableWidth = window.innerWidth - 48;
    return Math.min(1, availableWidth / SLIDE_WIDTH);
}

export const Slide = forwardRef<HTMLDivElement, SlideProps>(({children}, ref) => {
    const [scale, setScale] = useState(getScale);

    useEffect(() => {
        const handleResize = () => {
            setScale(getScale());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const wrapperStyle = {
        width: SLIDE_WIDTH * scale,
        height: SLIDE_HEIGHT * scale,
        margin: '0 auto',
    };

    return (
        <div className="slide-wrapper">
            <div style={wrapperStyle}>
                <div className="slide-container" ref={ref} style={{transform: `scale(${scale})`}}>
                    {children}
                </div>
            </div>
        </div>
    );
});
