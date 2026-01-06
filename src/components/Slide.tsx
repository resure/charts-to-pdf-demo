import React from "react";
import "./Slide.css";

interface SlideProps {
  children: React.ReactNode;
}

export const Slide: React.FC<SlideProps> = ({ children }) => {
  return <div className="slide-container">{children}</div>;
};
