import React from 'react';

import { Close, ChevronLeft, ChevronRight } from './icons';

const ImageViewer = ({ src, alt, setImageInViewer }) => {
  if (!src) return null;

  const currentImg = document.querySelector(`.marker-img[src="${src}"]`);
  const images = Array.from(currentImg.parentElement.querySelectorAll('.marker-img'));

  images.forEach((img, i) => {
    images.forEach((img2, j) => {
      if (
        (img.style.order < 0 && img.style.order > img2.style.order)
        || (img.style.order > 0 && img.style.order < img2.style.order)
      ) {
        const x = images[i];
        images[i] = images[j];
        images[j] = x;
      }
    });
  });

  const cycleImages = (direction) => {
    images.forEach((img, i) => {
      if (img.style.order === currentImg.style.order) {
        if (direction === 'prev') {
          setImageInViewer(images[i - 1] || images[images.length - 1]);
        }
        if (direction === 'next') {
          setImageInViewer(images[i + 1] || images[0]);
        }
      }
    });
  }

  return (
    <div className="image-viewer">
      <button
        className="close-btn"
        onClick={() => setImageInViewer({ src: '' })}
      ><Close /></button>
      <button
        className="prev-btn"
        onClick={() => cycleImages('prev')}
      >
        <ChevronLeft />
      </button>
      <button
        className="next-btn"
        onClick={() => cycleImages('next')}
      >
        <ChevronRight />
      </button>
      <img src={src} alt={alt} />
    </div>
  )
}

export default ImageViewer;
