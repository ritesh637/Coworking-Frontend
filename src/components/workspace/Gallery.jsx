const Gallery = () => {
  const images = [
    "https://th.bing.com/th?id=OIP.Cf6sQUMto3pA0W6bm4OyKwHaFW&w=293&h=212&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
    "https://th.bing.com/th?id=OIP.pVp8ORgwqRTC9IJYbPb66wHaE8&w=305&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
    "https://th.bing.com/th?id=OIP.EVnABMKKAJ9_L_fc9haujQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
    "https://th.bing.com/th?id=OIP.TihcHi6QE4w7AbZ7BLQqUwHaE6&w=307&h=203&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
    "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvd29ya2luZ3xlbnwwfHwwfHx8MA%3D%3D",
    "https://media.istockphoto.com/id/1380472832/photo/eco-friendly-open-plan-office-in-3d.webp?a=1&b=1&s=612x612&w=0&k=20&c=M9myoI_xM7vnXVxDeH3pQpUbv_kVqHvf5pWGHfSO0PA=",
    "https://th.bing.com/th/id/OIP.YTmEGolDCqusFuuTX2-F_AHaE8?w=298&h=198&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.YSVz9fLLK2kLV7zJLkda3AHaFW?w=239&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.PfEqjoA7mjCHBLs1xSRjNwHaEN?w=282&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900"></h2>
        <p className="text-gray-600 mt-2"></p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
        {images.map((src, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-md">
            <img
              src={src}
              alt={`Workspace ${index + 1}`}
              className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      <div className="text-center mt-12 px-4">
        <p className="text-xl font-medium text-gray-800"></p>
      </div>
    </section>
  );
};

export default Gallery;
