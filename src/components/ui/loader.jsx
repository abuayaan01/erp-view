import React from "react";

function Loader() {
  return (
    <div className="flex flex-row justify-center gap-2">
      <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:.7s]"></div>
      <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:.7s]"></div>
    </div>
  );
}

export default Loader;
