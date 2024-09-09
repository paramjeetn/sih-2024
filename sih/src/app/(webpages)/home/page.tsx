import React from 'react';
import ComplaintBox from '@/components/ComplaintBox';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
<main className="flex-grow flex justify-between items-center bg-gray-100 p-6">
  <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full ml-4">
    <ComplaintBox />
  </div>
  <img 
    src="train.png" 
    alt="Description of the image" 
    className="w-4/5 h-auto ml-0 mr-20"
    style={{ background: 'none', boxShadow: 'none' }}
  />
</main>






</div>

  );
};

export default HomePage;