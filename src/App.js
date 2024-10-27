import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sun, Moon, Link as LinkIcon, ClipboardCopy, BarChart3 } from "lucide-react";


const App = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShortenUrl = async (e) => {
    e.preventDefault();
    if (!originalUrl) {
      toast.error("Please enter a valid URL!");
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axios.post("https://urlbackend.vercel.app/api/url", {
        url: originalUrl,
      });
      setShortUrl(`https://urlbackend.vercel.app/${response.data.id}`);
      toast.success("URL shortened successfully!");
    } catch (error) {
      toast.error("Failed to shorten the URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAnalytics = async (shortID) => {
    try {
      const response = await axios.get(
        `https://urlbackend.vercel.app/api/url/analytics/${shortID}`
      );
      setAnalytics(response.data.totalClicks);
      toast.success("Analytics fetched successfully!");
    } catch (error) {
      toast.error("Failed to fetch analytics.");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("URL copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy URL.");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <ToastContainer theme={isDarkMode ? "dark" : "light"} />
      
      {/* Header */}
      <header className={`fixed top-0 w-full ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg z-10`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LinkIcon className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold">URL Shortener</h1>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-40 pb-12 flex flex-col items-center">
        <div className={`w-full max-w-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-xl p-8`}>
          <h2 className="text-2xl font-bold text-center mb-8">
            Transform Your Long URLs into Short Links
          </h2>
          
          <form onSubmit={handleShortenUrl} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your long URL here..."
                className={`w-full px-4 py-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-300 focus:border-blue-500'
                } border-2 focus:outline-none transition-colors`}
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-[1.02] ${
                isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isLoading ? "Shortening..." : "Shorten URL"}
            </button>
          </form>

          {shortUrl && (
            <div className={`mt-8 p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <p className="text-sm font-medium mb-2">Your shortened URL:</p>
              <div className="flex items-center space-x-2">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 truncate flex-1"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={copyToClipboard}
                  className={`p-2 rounded-lg ${
                    isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                >
                  <ClipboardCopy className="w-5 h-5" />
                </button>
              </div>
              
              <button
                className="mt-4 flex items-center justify-center space-x-2 w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                onClick={() => handleGetAnalytics(shortUrl.split("/").pop())}
              >
                <BarChart3 className="w-4 h-4" />
                <span>View Analytics</span>
              </button>
            </div>
          )}

          {analytics !== null && (
            <div className={`mt-6 p-4 rounded-lg text-center ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <p className="text-lg font-semibold">Total Clicks</p>
              <p className="text-3xl font-bold text-blue-500">{analytics}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;