import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop, faLaptop, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/css/home.css';

const Home = () => {
  // Responsive content
  const showContent = () => {
    let windowWidth = window.innerWidth;
    let instruction = <p>This is a discussion website imitating Reddit, 
                          just feel free to explore what it presents!</p>;

    if (windowWidth < 600) {
      return (
        <div className="reactive-home">
          <div className="display-mode">
            <FontAwesomeIcon icon={faMobileAlt} color='' size='lg' />
            <h1><dfn><abbr title='Width is less than 600px'>Smartphone view</abbr></dfn></h1>
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
            <h1><dfn><abbr title='Width is less than 850px'>SmallScreen view</abbr></dfn></h1>
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
            <h1><dfn><abbr title='Width is more than 850px'>Desktop view</abbr></dfn></h1>
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
