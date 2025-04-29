import React from "react";

const WhyChooseUs = () => {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4">
          Why Choose Us
        </h2>
        <p className="max-w-xl mx-auto text-gray-700 dark:text-gray-300 text-lg">
          Discover the features that make us stand out from the rest.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-2xl transition duration-300 transform hover:scale-105 hover:bg-purple-600 dark:hover:bg-purple-700 hover:text-white dark:hover:text-white"
          >
            <div className="flex justify-center mb-6">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-16 h-16 group-hover:rotate-12 transition-transform duration-300"
              />
            </div>
            <h3 className="text-2xl font-semibold mb-2 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-gray-600 group-hover:text-white dark:text-gray-300 dark:group-hover:text-white transition-colors duration-300">
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
    description:
      "Create in quiet, clutter-free environments designed to boost focus.",
  },
  {
    title: "Super Fast Internet",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/c0e007d1-wifi.png",
    description: "Enjoy lightning-fast internet to power your productivity.",
  },
  {
    title: "Community Events",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/eb5cabd0-calendar.png",
    description: "Connect and grow with like-minded professionals.",
  },
  {
    title: "24/7 Building Access",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/fce9e799-delivery.png",
    description: "Work on your schedule with round-the-clock access.",
  },
  {
    title: "Secured Workspace",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/8d706cf2-smart-lock-1.png",
    description: "Stay safe with top-tier security systems in place.",
  },
  {
    title: "Daily Cleaning",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/4f6e73eb-broom.png",
    description: "A spotless space to work every single day.",
  },
];

export default WhyChooseUs;
