export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center py-20 px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to DaNangTrip</h1>
        <p className="text-lg text-gray-600 mb-8">
          Your ultimate tour booking platform in Da Nang. Discover amazing tours,
          book experiences, and create unforgettable memories.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Browse Tours
          </button>
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Learn More
          </button>
        </div>
      </div>
    </main>
  );
}
