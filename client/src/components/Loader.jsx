import React from "react";
import { TailSpin } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <TailSpin
        height={80}
        width={80}
        color="#1DA1F2"
        ariaLabel="loading"
      />
    </div>
  );
};

export default Loader;
