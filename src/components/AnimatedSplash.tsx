import React, { useState, useEffect } from 'react';

// Import images
import Image1 from '@/assets/images/Image1.png';
import Image2 from '@/assets/images/Image2.png';
import Image3 from '@/assets/images/Image3.png';

const images = [Image1, Image2, Image3];

interface AnimatedSplashProps {
  onFinish: () => void;
}

// Full screen splash for app startup only (yellow background)
export const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onFinish }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Show each image for 400ms, then move to next
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        if (prev >= images.length - 1) {
          // Animation complete, clear interval and call onFinish
          clearInterval(interval);
          // Small delay before finishing to show the last image
          setTimeout(() => {
            onFinish();
          }, 400);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#ffdd00] z-50">
      <img
        src={images[currentImageIndex]}
        alt="Loading"
        className="w-[60vw] max-w-[400px] h-auto object-contain"
      />
    </div>
  );
};

// Content loader - displays animated loading images in the center of the page
// White background, smaller images, full screen
export const ContentLoader: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <img
        src={images[currentImageIndex]}
        alt="Loading"
        className="w-32 h-32 object-contain"
      />
    </div>
  );
};

export default AnimatedSplash;
