import React, { forwardRef } from "react";
import "./Slide.css";

interface SlideProps {
  children: React.ReactNode;
}

export const Slide = forwardRef<HTMLDivElement, SlideProps>(({ children }, ref) => {
  return (
    <div className="slide-container" ref={ref}>
      {children}
    </div>
  );
});
