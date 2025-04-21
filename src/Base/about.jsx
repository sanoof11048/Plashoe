import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home1 from "../assets/png.jpeg";
import Float1 from "../assets/Float2.png"
import Float2 from "../assets/Float3.png"
import Image1 from "../assets/image6.jpeg"
import Image2 from "../assets/image5.jpeg"
import Image3 from "../assets/image4.jpeg"

// Timeline data
const timelineData = [
  {
    title: "The Beginning",
    description: "Our passion for quality footwear started with a simple idea: create shoes that make a difference.",
    imagePosition: "right",
    image:Image1
  },
  {
    title: "Sustainable Evolution",
    description: "We pioneered new ways to create luxury footwear using eco-friendly materials without sacrificing style.",
    imagePosition: "left",
    image:Image2
  },
  {
    title: "Global Recognition",
    description: "Our dedication to quality craftsmanship and sustainable practices earned us worldwide acclaim.",
    imagePosition: "right",
    image:Image3
  }
];

const shoeImages = [
  "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/68ae7ea7849b43eca70aac1e00f5146d_9366/Stan_Smith_Shoes_White_FX5502_01_standard.jpg",
  "https://nb.scene7.com/is/image/NB/ml574evg_nb_02_i?pdpflexf2pdpflexf2pdpflexf2&wid=440&hei=440",
"https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/306874/02/sv01/fnd/IND/fmt/png/BMW-M-Motorsport-Drift-Cat-Delta-Unisex-Sneakers",
"https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/311108/01/sv01/fnd/IND/fmt/png/PUMA-Questblitz-Men's-Running-Shoes",
"https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/378513/03/sv01/fnd/IND/fmt/png/Smooth-Walk-Men's-Running-Shoes"]
// Values data
const valuesData = [
  { icon:"fa-solid fa-seedling", title: "Sustainability", description: "Every step of our process is designed to minimize environmental impact." },
  { icon: "fas fa-wand-magic-sparkles", title: "Craftsmanship", description: "Meticulous attention to detail creates footwear that stands the test of time." },
  { icon: "fas fa-shoe-prints", title: "Comfort", description: "We believe luxury should feel as good as it looks, from the first step to the thousandth." }
];

function About() {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Parallax effect calculation
  const calculateParallax = (baseSpeed) => ({
    transform: `translateY(${scrollPosition * baseSpeed}px)`
  });

  // Helper function for scrolling to section
  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Fixed background patterns */}
      <div className="fixed inset-0 -z-10 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-black"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.1,
                transform: `translateY(${scrollPosition * (Math.random() * 0.05)}px)`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Navbar */}
      
      {/* Hero Section */}
      <section className="relative h-screen bg-white  overflow-hidden">
      <div className="sticky top-0 z-50  bg-transparent backdrop-blur-xs">
        <Navbar />
      </div>
        <div className="absolute inset-0 bg-stone-900 clip-diagonal z-0">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:  `url(${Home1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'luminosity'
            }}
          />
        </div>
        
        <div className="absolute inset-0 z-10">
          <div className="flex h-full items-center justify-center">
            <div className="text-center px-6 max-w-4xl" style={calculateParallax(-0.2)}>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Our <span className="text-amber-400">Footprint</span>
              </h1>
              <p className="text-xl text-white mb-8 opacity-90 max-w-2xl mx-auto">
                Where craftsmanship meets consciousness
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate("/products")}
                  className="bg-amber-400 hover:bg-amber-500 text-stone-900 font-medium py-3 px-8 rounded-full transition duration-300"
                >
                  Explore Collection
                </button>
                <button 
                  onClick={() => scrollToSection('story-section')}
                  className="bg-transparent border border-white text-white hover:bg-white hover:text-stone-900 font-medium py-3 px-8 rounded-full transition duration-300"
                >
                  Our Story
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating shoe images */}
        {[
          { position: "bottom-10 left-10", size: "w-40 h-40", rotation: "rotate-12", parallax: -0.1, image:Float2  },
          { position: "top-20 right-10", size: "w-64 h-64", rotation: "-rotate-12", parallax: -0.15, image:Float1}
        ].map((shoe, index) => (
          <div key={index} className={`absolute ${shoe.position} ${shoe.size} z-10 hidden md:block`}>
            <img 
              src={shoe.image}
              alt="Floating shoe" 
              className={`w-full h-full object-contain ${shoe.rotation}`}
              style={calculateParallax(shoe.parallax)}
            />
          </div>
        ))}
      </section>
      
      {/* Story Section with Vertical Timeline */}
      <section id="story-section" className="relative py-20 bg-gradient-to-b from-white to-stone-100">
        <div className="container mx-auto px-6 relative">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-stone-900">
            Our Journey
          </h2>
          
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-0 md:left-1/2 h-full w-1 bg-stone-300 -translate-x-1/2 z-0"></div>
            
            {/* Timeline entries */}
            <div className="space-y-24 relative z-10">
              {timelineData.map((entry, index) => (
                <div key={index} className="flex flex-col md:flex-row items-center">
                  {entry.imagePosition === "left" && (
                    <div className="md:w-1/2 md:pr-12 hidden md:block order-1">
                      <div className="rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105">
                        <img 
                          src={entry.image} 
                          alt={entry.title} 
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className={`md:w-1/2 ${entry.imagePosition === "right" ? "md:pr-12 md:text-right" : "md:pl-12"} order-2 ${entry.imagePosition === "right" ? "md:order-1" : "md:order-3"}`}>
                    <h3 className="text-2xl font-bold text-stone-900 mb-3">{entry.title}</h3>
                    <p className="text-stone-700">{entry.description}</p>
                  </div>
                  
                  <div className="md:w-1/2 flex justify-center items-center order-1 md:order-2 mb-6 md:mb-0">
                    <div className="w-10 h-10 rounded-full bg-amber-400 border-4 border-white shadow-lg"></div>
                  </div>
                  
                  {entry.imagePosition === "right" && (
                    <div className="md:w-1/2 md:pl-12 order-3 hidden md:block">
                      <div className="rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105">
                        <img 
                          src={entry.image} 
                          alt={entry.title} 
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            What We <span className="text-amber-400">Stand For</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valuesData.map((value, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-amber-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-8 h-full bg-stone-800 rounded-lg overflow-hidden z-10 group-hover:bg-amber-400 group-hover:text-stone-900 transition-colors duration-300">
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-amber-400 opacity-20 rounded-full"></div>
                  <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-amber-400 opacity-20 rounded-full"></div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-stone-700 rounded-full mb-6 group-hover:bg-white transition-colors duration-300">
                      <i className={`text-2xl  ${value.icon}`}></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-stone-300 group-hover:text-stone-800 transition-colors duration-300">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Showcase Section */}
      <section className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("/api/placeholder/1600/900")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-stone-900">
            Our Collection
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
  {shoeImages.map((img, index) => (
    <div 
      key={index} 
      className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden shadow-lg transform transition-all hover:scale-110 cursor-pointer"
      style={{
        transform: `translateY(${scrollPosition * 0.03 * (index % 2 ? 1 : -1)}px)`
      }}
      onClick={() => navigate("/products")}
    >
      <img 
        src={img}
        alt={`Shoe ${index + 1}`}
        className="w-full h-full object-cover"
      />
    </div>
  ))}
</div>
          
          <div className="text-center mt-16">
            <button 
              onClick={() => navigate("/products")}
              className="bg-stone-900 hover:bg-stone-800 text-white font-medium py-3 px-8 rounded-full transition duration-300"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>
      
     
      
      {/* Final CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-stone-900 z-0"></div>
          <div 
            className="absolute inset-0 clip-diagonal-reverse bg-amber-400 z-0"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 30%, 0 100%)'
            }}
          >
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'url("/api/placeholder/1600/900")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Step Into Comfort
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Discover footwear that's changing the game
            </p>
            <button 
              onClick={() => navigate("/products")}
              className="bg-white text-stone-900 hover:bg-amber-400 hover:text-stone-900 font-medium py-3 px-8 rounded-full transition duration-300 shadow-lg"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>
      
      <style>{`
        .clip-diagonal {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 70%);
        }
        
        .clip-diagonal-reverse {
          clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
        }
      `}</style>
    </div>
  );
}

export default About;