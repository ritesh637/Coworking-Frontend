import Link from "next/link";

const BookingCard = ({ office }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-2 md:p-4 lg:p-6 transition-transform duration-300 hover:scale-105">
      {/* Image */}
      <div className="w-full h-48 sm:h-56 md:h-60 lg:h-64 overflow-hidden rounded-lg">
        <img
          src={office.image}
          alt={office.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600/82">
          {office.name}
        </h2>
        <p className="text-sm sm:text-base text-green-600 mt-1">
          {office.location}
        </p>

        {/* Booking Button */}
        <Link href={`/office/${office.id}`} className="block">
          <button className="bg-blue-600 hover:bg-red-600 text-white px-2 py-4 rounded-lg mt-9 w-full transition-all duration-1200">
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;
