import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/app");
  };

  return (
    <div className="w-full bg-neutral-900 text-white flex items-center justify-center min-h-screen">
      <Button onClick={handleButtonClick}>Go to ZENBOARD</Button>
    </div>
  );
};

export default LandingPage;
