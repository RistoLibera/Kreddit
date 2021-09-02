import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop, faLaptop, faMars, faMobileAlt, faVenus } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  // Responsive content
  const showContent = () => {
    let windowWidth = window.innerWidth;
    let instruction = <p>This is a discussionn website imitating Reddit, 
                          feel free to explore what this has!</p>;
    if (windowWidth < 600) {
      return (
        <div className="reactive-home">
          <div className="display-mode">
            <FontAwesomeIcon icon={faMobileAlt} color='' size='lg' />
            <h1>Smartphone view</h1>
          </div>
            {instruction}
          <h2>Let's kreddit!</h2>
        </div>
      );
    } else if (windowWidth < 850) {
      return (
        <div className="reactive-home">
          <div className="display-mode">
            <FontAwesomeIcon icon={faLaptop} color='' size='lg' />
            <h1>SmallScreen view</h1>
          </div>
            {instruction}
          <h2>Let's kreddit!</h2>
        </div>
      );
    } else {
      return (
        <div className="reactive-home">
          <div className="display-mode">
            <FontAwesomeIcon icon={faDesktop} color='' size='lg' />
            <h1>Desktop view</h1>
          </div>
            {instruction}
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
