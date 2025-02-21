import { useNavigate } from "react-router-dom";

function VideoSection() {
  const navigate = useNavigate();

  const handleShopNowClick = () => {
    window.scrollTo(0, 0); // Scroll to the top of the page
    navigate("/shop/listing");
  };

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
            <source src="/images/videoplayback (1).mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">New Collection</h2>
            <p className="text-lg mb-6">Discover our latest arrivals</p>
            <button
              className="bg-white/10 hover:bg-white/20 text-white border border-white px-6 py-2 rounded-lg transition"
              onClick={handleShopNowClick}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoSection;
