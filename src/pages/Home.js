import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop, faLaptop, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import Homepage from '../assets/img/homepage.jpg';
import '../styles/css/home.css';

const Home = () => {
  const { t } = useTranslation('home');

  // Responsive content
  const showContent = () => {
    let windowWidth = window.innerWidth;
    let instruction = <p>{t('content.instruction')}</p>;

    if (windowWidth < 600) {
      return (
        <div className="reactive-home">
          <div className="display-mode">
            <FontAwesomeIcon icon={faMobileAlt} color='' size='lg' />
            <h1><dfn><abbr title={t('content.smartphone-title')}>{t('content.smartphone')}</abbr></dfn></h1>
          </div>
          <div className="instruction">
            {instruction}
          </div>
          <h2 className='slogan'>{t('content.slogan')}</h2>
        </div>
      );
    } else if (windowWidth < 850) {
      return (
        <div className="reactive-home">
          <div className="display-mode">
            <FontAwesomeIcon icon={faLaptop} color='' size='lg' />
            <h1><dfn><abbr title={t('content.smallscreen-title')}>{t('content.smallscreen')}</abbr></dfn></h1>
          </div>
          <div className="instruction">
            {instruction}
          </div>
          <h2 className='slogan'>{t('content.slogan')}</h2>
        </div>
      );
    } else {
      return (
        <div className="reactive-home">
          <div className="display-mode">
            <FontAwesomeIcon icon={faDesktop} color='' size='lg' />
            <h1><dfn><abbr title={t('content.desktop-title')}>{t('content.desktop')}</abbr></dfn></h1>
          </div>
          <div className="instruction">
            {instruction}
          </div>
          <h2 className='slogan'>{t('content.slogan')}</h2>
        </div>
      );
    }
  };

  useEffect(() => {
    showContent();
  }, [t]);

  return (
    <section className='homepage' style={{ backgroundImage: `url('${Homepage}')` }}>
      {showContent()}
    </section>
  );
};

export default Home;
