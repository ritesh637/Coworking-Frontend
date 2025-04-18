import React from "react";

const ImageGridWithQuote = () => {
  const images = [
    "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg", // Eiffel Tower
    " https://images.pexels.com/photos/8111359/pexels-photo-8111359.jpeg", // Street in Paris
    " https://images.pexels.com/photos/6248985/pexels-photo-6248985.jpeg", // Historic building
    " https://images.pexels.com/photos/260931/pexels-photo-260931.jpeg", // Cityscape
    "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg", // Beautiful Canal
    "https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg",
     // Modern Architecture
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Image ${index + 1}`}
            className="w-full h-56 object-cover rounded-md shadow-md transition-transform transform hover:scale-105"
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGridWithQuote;
