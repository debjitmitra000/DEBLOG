import React from 'react';
import { useNavigate } from 'react-router-dom';
import HOMEIMAGE from '../assets/image/Home.png'; 

function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="h-90 mt-24 flex flex-col text-blue-500 overflow-hidden">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Content Area */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12">
          <div className="max-w-lg mx-auto md:mx-0">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">DEBLOG</h1>
            <div className="h-1 w-24 bg-blue-500 mb-6"></div>
            <p className="text-xl text-blue-300 mb-8">Where Curiosity Meets Knowledge, and Passion Fuels Every Word.</p>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full border-2 border-[#37474f] flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-[#ffffff]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className="text-blue-100">Knowledge</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full border-2  border-[#37474f] flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-[#ffffff]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                  </svg>
                </div>
                <span className="text-blue-100">Resource</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full border-2 border-[#37474f] flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-[#ffffff]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className="text-blue-100">Create</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full border-2 border-[#37474f] flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-[#ffffff]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className="text-blue-100">Explore</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/post')}
                className="px-6 py-3 text-white border-2 border-blue-500 hover:bg-blue-500 hover:bg-opacity-20 transition-all duration-300 rounded-lg font-medium"
              >
                Explore Posts
              </button>
              <button 
                onClick={() => navigate('/post/new-post')}
                className="px-6 py-3 text-white border-2 border-blue-500 hover:bg-blue-500 hover:bg-opacity-20 transition-all duration-300 rounded-lg font-medium"
              >
                Create Post
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Content Area */}
        <div className="hidden md:flex w-1/2 relative">
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96">
            {/* Animated circles */}
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full opacity-20 animate-ping" style={{animationDuration: '3s'}}></div>
            <div className="absolute inset-8 border-4 border-blue-400 rounded-full opacity-20 animate-ping" style={{animationDuration: '4s'}}></div>
            <div className="absolute inset-16 border-4 border-blue-300 rounded-full opacity-20 animate-ping" style={{animationDuration: '5s'}}></div>
            
            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <img src={HOMEIMAGE} alt="Logo" />
                
              </div>
            </div>
          </div>
          
          {/* Corner decorations */}
          <div className="absolute top-8 right-8 w-32 h-32 border-t-4 border-r-4 border-blue-500 opacity-50"></div>
          <div className="absolute bottom-8 left-8 w-32 h-32 border-b-4 border-l-4 border-blue-500 opacity-50"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;