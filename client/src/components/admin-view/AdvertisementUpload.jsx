import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import axios from "axios";
import { addProductFormElements } from "@/config"; // Import the config file
const backendUrl = "https://lookgood.onrender.com"

function AdvertisementUpload() {
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState("");
  const [advertisements, setAdvertisements] = useState([]);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const videoRefs = useRef({});

  useEffect(() => {
    // Extract brands from addProductFormElements
    const brandOptions = addProductFormElements.find(
      (element) => element.name === "brand"
    ).options;
    setBrands(brandOptions);

    // Fetch advertisements
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/admin/advertisements`);
      setAdvertisements(response.data.data);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
    }
  };

  const handleVideoFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setVideoFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!videoFile || !title || !brand) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);
    formData.append("brand", brand);

    try {
      const response = await axios.post(
        `${backendUrl}/api/admin/advertisements/upload`,
        formData
      );
      if (response.data.success) {
        alert("Advertisement uploaded successfully!");
        setTitle("");
        setBrand("");
        setVideoFile(null);
        setError("");
        fetchAdvertisements(); // Refresh the advertisements list
      } else {
        setError("Failed to upload advertisement.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while uploading the advertisement.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (ad) => {
    setCurrentEditedId(ad._id);
    setTitle(ad.title);
    setBrand(ad.brand);
  };

  const handleUpdate = async () => {
    if (!title || !brand) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${backendUrl}/api/admin/advertisements/${currentEditedId}`,
        { title, brand }
      );
      if (response.data.success) {
        alert("Advertisement updated successfully!");
        setTitle("");
        setBrand("");
        setVideoFile(null);
        setError("");
        setCurrentEditedId(null);
        fetchAdvertisements(); // Refresh the advertisements list
      } else {
        setError("Failed to update advertisement.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while updating the advertisement.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoPlay = (id) => {
    setActiveVideoId(id);
    Object.keys(videoRefs.current).forEach((key) => {
      if (key !== id) {
        videoRefs.current[key].pause();
      }
    });
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">
          {currentEditedId ? "Edit Advertisement" : "Upload Advertisement"}
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <Label className="block mb-2">Video File</Label>
        <Input type="file" onChange={handleVideoFileChange} />
        <Label className="block mt-4 mb-2">Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <Label className="block mt-4 mb-2">Brand</Label>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select a brand</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.label}
            </option>
          ))}
        </select>
        <Button
          onClick={currentEditedId ? handleUpdate : handleUpload}
          className="mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : currentEditedId ? "Update Advertisement" : "Upload Advertisement"}
        </Button>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Uploaded Advertisements</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 w-1/2">Video</th>
              <th className="py-2 w-1/4 text-center">Title</th>
              <th className="py-2 w-1/4 text-center">Brand</th>
              <th className="py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {advertisements.map((ad) => (
              <tr key={ad._id} className={activeVideoId === ad._id ? "bg-gray-200" : ""}>
                <td className="py-2 w-1/2">
                  <video
                    controls
                    className={`w-full ${activeVideoId === ad._id ? "h-128" : "h-64"}`}
                    ref={(el) => (videoRefs.current[ad._id] = el)}
                    onPlay={() => handleVideoPlay(ad._id)}
                  >
                    <source src={ad.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </td>
                <td className="py-2 w-1/4 text-center">{ad.title}</td>
                <td className="py-2 w-1/4 text-center">{ad.brand}</td>
                <td className="py-2 text-center">
                  <Button onClick={() => handleEdit(ad)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdvertisementUpload;