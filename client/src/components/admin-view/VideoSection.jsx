import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { VolumeX, Volume2 } from "lucide-react";
const backendUrl = "https://lookgood.onrender.com"

function VideoSection({ uniqueKey, numAds }) {
  const navigate = useNavigate();
  const [advertisements, setAdvertisements] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const videoRefs = useRef({});

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/admin/advertisements`);
        const ads = response.data.data;
        const uniqueAds = ads.sort(() => 0.5 - Math.random()).slice(0, numAds); // Randomly select unique ads
        setAdvertisements(uniqueAds);
      } catch (error) {
        console.error("Error fetching advertisements:", error);
      }
    };

    fetchAdvertisements();
  }, [uniqueKey, numAds]);

  const handleNavigateToListingPage = (getCurrentItem, section) => {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    window.scrollTo(0, 0);
    navigate(`/shop/listing`);
  };

  const handleMuteToggle = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      video.muted = !video.muted;
      // Force a re-render to update the button state
      setAdvertisements((prevAds) => [...prevAds]);
    }
  };



  return (
    <section className="w-full bg-black py-16">
      <div className="container mx-auto px-4">
        {advertisements.length > 0 && advertisements.map((ad) => (
          <div key={ad._id} className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl mb-8">
            <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded">
              Sponsored by {ad.title}
            </div>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[500px] md:h-[600px] lg:h-[700px]"
              ref={(el) => (videoRefs.current[ad._id] = el)}
              onPlay={() => setActiveVideoId(ad._id)}
            >
              <source src={ad.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* <div className="absolute top-4 right-4">
              <button
                className="bg-white/10 hover:bg-white/20 text-white border border-white px-6 py-2 rounded-lg transition mb-4"
                onClick={() => handleMuteToggle(ad._id)}
              >
                {videoRefs.current[ad._id]?.muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div> */}
            <div className="absolute inset-0 flex items-end justify-end p-10 bg-black/40">
              <button
                className="bg-white/10 hover:bg-white/20 text-white border border-white px-6 py-2 rounded-lg transition mb-4"
                onClick={() => handleNavigateToListingPage({ id: ad.brand, label: ad.title }, "brand")}
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default VideoSection;