import React, { useEffect } from 'react';

const Home = () => {
  // Responsive content
  const showContent = () => {
    let windowWidth = window.innerWidth;

    if (windowWidth < 600) {
      return (
        <div className="reactive-home">
          <h1>Smartphone view</h1>
          <h2>Let's kreddit!</h2>
        </div>
      );
    } else if (windowWidth < 850) {
      return (
        <div className="reactive-home">
          <h1>SmallScreen view</h1>
          <h2>Let's kreddit!</h2>
        </div>
      );
    } else {
      return (
        <div className="reactive-home">
          <h1>Desktop view</h1>
          <h2>Let's kreddit!</h2>
        </div>
      );
    }
  };

  useEffect(() => {
    showContent();
  }, []);

  return (
    <section className='homepage'>
      {showContent()}
    </section>
  );
};

export default Home;
