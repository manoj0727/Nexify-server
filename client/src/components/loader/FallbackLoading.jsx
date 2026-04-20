import { PulseLoader } from "react-spinners";

const FallbackLoading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <PulseLoader color="#8B5CF6" />
    </div>
  );
};

export default FallbackLoading;
