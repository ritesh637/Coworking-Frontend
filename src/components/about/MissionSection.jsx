export default function MissionSection() {
  return (
    <section className="px-6 py-12 md:px-12 lg:px-24 bg-gray-50">
      <h2 className="text-4xl font-extrabold text-center text-gray-900">
        Our Mission
      </h2>
      <p className="text-center text-gray-700 text-lg mt-4 max-w-3xl mx-auto">
        Coworking is an arrangement in which several workers from different
        companies share an office space, allowing cost savings and convenience
        through the use of common infrastructure.
      </p>

      <div className="mt-16 space-y-16">
        {/* Section 1 */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src="https://live.templately.com/wp-content/uploads/2020/09/d133b9db-our-mission-image-1.jpg"
            alt="Coworking space"
            className="w-full md:w-1/2 lg:w-1/3 rounded-lg shadow-lg"
          />
          <div className="text-lg">
            <h3 className="text-3xl font-bold text-gray-900">
              Change The Way Work Is Done.
            </h3>
            <p className="text-gray-700 mt-4 leading-relaxed">
              Coworking is an arrangement in which several workers from
              different companies share an office space, allowing cost savings
              and convenience through shared infrastructure, such as high-speed
              internet, utilities, and receptionist services.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <img
            src="https://live.templately.com/wp-content/uploads/2020/09/273a6e11-our-mission-image-2.jpg"
            alt="Team collaboration"
            className="w-full md:w-1/2 lg:w-1/3 rounded-lg shadow-lg"
          />
          <div className="text-lg">
            <h3 className="text-3xl font-bold text-gray-900">
              Innovation Through Collaboration.
            </h3>
            <p className="text-gray-700 mt-4 leading-relaxed">
              Coworking spaces provide a platform for networking, sharing
              knowledge, and enhancing productivity through collective
              intelligence and resource sharing. It fosters an environment of
              creativity and collaboration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
