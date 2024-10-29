export const StampOverlay = ({ text = "DONE", isActive = false }) => {
  return (
    <div
      className={`
        absolute inset-0 flex items-center justify-center
        transition-all duration-300 ease-out
        ${isActive ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-150 pointer-events-none"}
      `}
    >
      <div
        className="
          border-4 border-red-500 text-red-500 
          text-4xl font-bold px-8 py-2 
          transform -rotate-[10deg]
          bg-white/50
        "
      >
        {text}
      </div>
    </div>
  );
};
