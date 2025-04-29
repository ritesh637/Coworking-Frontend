const Gallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1666718623430-da207b018ea3?q=80&w=2110&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1666718621210-e662947b5dc3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1703745006226-98d4b948dc41?q=80&w=2036&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/flagged/photo-1576485436509-a7d286952b65?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://visionspaces.co/wp-content/uploads/2024/04/559X373px_Boutique-office_Image-4-copy.webp",
    "https://visionspaces.co/wp-content/uploads/2024/04/559X373px_Open-Desk_Image-9-copy.webp",
    "https://cdn.pixabay.com/photo/2024/04/18/18/39/ai-generated-8704765_1280.jpg",
    "https://visionspaces.co/wp-content/uploads/2024/04/559X373px_Manager-cabin_Image-1-copy.webp",
    "https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900">Our Workspace</h2>
        <p className="text-gray-600 mt-2">
          Explore our inspiring work environments
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
        {images.map((src, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={src}
              alt={`Workspace ${index + 1}`}
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
