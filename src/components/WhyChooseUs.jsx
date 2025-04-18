import React from "react";

const WhyChooseUs = () => {
  return (
    <section className="py-16 px-6 text-black bg-gray-100">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-3 text-purple-600">
          Why Choose Us
        </h2>
        <p className="max-w-2xl mx-auto text-gray-800">
          Discover the best features we offer.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-8 rounded-xl shadow-lg text-center bg-white transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-purple-500 hover:text-white"
          >
            <div className="flex justify-center mb-4">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-16 h-16 transition-transform duration-300 hover:rotate-12"
              />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 group-hover:text-white">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const features = [
  {
    title: "Distraction-Free Spaces",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/e9de1221-working.png",
    description: "Fully equipped kitchen for your convenience.",
  },
  {
    title: "Super Fast Internet",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/c0e007d1-wifi.png",
    description: "Book a professional space for your meetings.",
  },
  {
    title: "Community Events",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/eb5cabd0-calendar.png",
    description: "Relax with comfortable seating options.",
  },
  {
    title: "24/7 Building Access",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/fce9e799-delivery.png",
    description: "Enjoy fresh coffee anytime.",
  },
  {
    title: "Secured Workspace",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/8d706cf2-smart-lock-1.png",
    description: "Secure your belongings in our free safe.",
  },
  {
    title: "Daily Cleaning",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/4f6e73eb-broom.png",
    description: "Access the workspace anytime you need.",
  },
];

export default WhyChooseUs;
