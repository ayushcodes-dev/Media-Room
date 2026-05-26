

/**
 * NeonLoader Component
 * @param {boolean} isLoading - Controls the visibility of the loader
 */
const NeonLoader = ({ isLoading, heading,description }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xl transition-all duration-500">
      {}
      <div className="relative p-12 rounded-3xl bg-slate-900/40 border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col items-center">
        {/* Decorative Background Glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full"></div>

        {}
        <div className="flex space-x-3 mb-8 h-12 items-center">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-sm bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.8)] animate-wave"
              style={{
                animationDelay: `${index * 0.15}s`,
                /* inline style used for dynamic delay calculation */
              }}
            ></div>
          ))}
        </div>

        {}
        <div className="text-center">
          <h2 className="text-sky-400 font-bold tracking-widest uppercase text-xs mb-2 animate-pulse">
            {   heading || "Loading..."}
          </h2>
          <p className="text-slate-400 text-sm font-light">
            {description || "Preparing your workspace environment..."}
          </p>
        </div>

        {/* CSS Animations */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes wave {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.5;
              box-shadow: 0 0 5px rgba(56,189,248,0.3);
            }
            50% {
              transform: translateY(-20px);
              opacity: 1;
              box-shadow: 0 0 20px rgba(56,189,248,1), 0 0 40px rgba(56,189,248,0.4);
            }
          }
          .animate-wave {
            animation: wave 1.5s ease-in-out infinite;
          }
        `,
          }}
        />
      </div>
    </div>
  );
};
export default NeonLoader;