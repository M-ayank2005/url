import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sun, Moon, Link as LinkIcon, ClipboardCopy, BarChart3, Github, Twitter } from "lucide-react";

const App = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [recentUrls, setRecentUrls] = useState(() => {
    const saved = localStorage.getItem("recentUrls");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("recentUrls", JSON.stringify(recentUrls));
  }, [recentUrls]);

  const handleShortenUrl = async (e) => {
    e.preventDefault();
    if (!originalUrl) {
      toast.error("Please enter a valid URL!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("https://urlbackend-3bwm.onrender.com/api/url/", {
        url: originalUrl,
      });
      const newShortUrl = `https://urlbackend-3bwm.onrender.com/${response.data.id}`;
      setShortUrl(newShortUrl);
      setRecentUrls(prev => {
        const updated = [{ url: originalUrl, shortUrl: newShortUrl, date: new Date().toISOString() }, ...prev].slice(0, 5);
        return updated;
      });
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
        `https://urlbackend-3bwm.onrender.com/api/url/analytics/${shortID}`
      );
      setAnalytics(response.data.totalClicks);
      toast.success("Analytics fetched successfully!");
    } catch (error) {
      toast.error("Failed to fetch analytics.");
    }
  };

  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy URL.");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-200 ${
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
            <h1 className="text-xl font-bold hidden sm:block">URL Shortener</h1>
            <h1 className="text-xl font-bold sm:hidden">URLi</h1>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-all duration-300 ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-24 flex flex-col items-center">
        <div className={`w-full max-w-2xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-xl p-6 md:p-8`}>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Transform Your Long URLs
            </h2>
            <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Create short, memorable links in seconds
            </p>
          </div>
          
          <form onSubmit={handleShortenUrl} className="space-y-4">
            <div className="relative">
              <input
                type="url"
                placeholder="Paste your long URL here..."
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
                isLoading 
                  ? 'bg-gray-400' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
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
                  onClick={() => copyToClipboard(shortUrl)}
                  className={`p-2 rounded-lg transition-colors ${
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

          {/* Recent URLs Section */}
          {recentUrls.length > 0 && (
            <div className={`mt-8 p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Recent URLs</h3>
              <div className="space-y-4">
                {recentUrls.map((item, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <p className="text-sm truncate text-gray-500">{item.url}</p>
                    <div className="flex items-center justify-between mt-2">
                      <a
                        href={item.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 text-sm truncate"
                      >
                        {item.shortUrl}
                      </a>
                      <button
                        onClick={() => copyToClipboard(item.shortUrl)}
                        className={`p-1.5 rounded-md ${
                          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <ClipboardCopy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`fixed bottom-0 w-full ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 URL Shortener. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
              <a
                href="https://github.com/M-ayank2005/url"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className={`text-center mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Made with ❤️ by Mayank
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;