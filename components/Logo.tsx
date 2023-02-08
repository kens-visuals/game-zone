export default function Logo({ isSidebarOpen = false }) {
  return (
    <div
      className={`text-center font-outfit text-body-2 font-medium uppercase text-white md:mb-4 md:w-full ${
        isSidebarOpen && 'tracking-wider md:text-h2-medium'
      }`}
    >
      <div className="relative">
        <div className="absolute inset-0 h-1 w-full bg-secondary blur" />
        <div className="absolute inset-0 h-0.5 w-full bg-secondary" />
      </div>
      <span className="my-1 inline-block md:my-4">
        Game <br className="md:hidden" /> Zone
      </span>
      <div className="relative">
        <div className="absolute inset-0 h-1 w-full bg-secondary blur" />
        <div className="absolute inset-0 h-0.5 w-full bg-secondary" />
      </div>
    </div>
  );
}
