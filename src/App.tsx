import React from 'react';
import ImageList from './components/ImageList';

const App: React.FC = () => {
  return (
    <main>
      <div className="min-h-screen bg-[#E5E5E5] flex justify-center items-center">
        <ImageList />
      </div>
    </main>
  );
};

export default App;
