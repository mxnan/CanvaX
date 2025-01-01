import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/create");
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      <Button onClick={handleButtonClick}>Go to Create Page</Button>
    </div>
  );
};

export default LandingPage;
