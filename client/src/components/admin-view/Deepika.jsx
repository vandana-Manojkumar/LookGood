import { useNavigate } from "react-router-dom";

function Deepika() {
  const navigate = useNavigate();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    window.scrollTo(0, 0);
    navigate(`/shop/listing`);
  }

  return (
    <section className="w-full bg-black py-16">
      <div className="container mx-auto px-4">
        <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full"
            poster="/images/video-poster.jpg" // Optional poster image
          >
            <source src="/images/levis-deepika.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay Container */}
          <div className="absolute inset-0 flex items-end justify-end p-10 bg-black/40">
            <button
              className="bg-white/10 hover:bg-white/20 text-white border border-white px-6 py-2 rounded-lg transition"
              onClick={() => handleNavigateToListingPage({
                id: "levi",
                label: "Levi's",
                logo: <img 
                  src="/images/download (2).png" 
                  alt="Levi's logo"
                  className="w-24 h-12 object-contain"
                />
              }, "brand")}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Deepika;