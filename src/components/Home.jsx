import React from "react";
import { useNavigate } from "react-router";
import About from "../Base/about";
import Footer from "../Base/footer";

function Home() {
  const navigate = useNavigate();

  return (
    <div>

        <About />
        <Footer />
      
    </div>
  );
}

export default Home;
