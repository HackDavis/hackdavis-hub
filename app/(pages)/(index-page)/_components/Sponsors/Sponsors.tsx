import Logo from '../Marquee/Logo';
import Marquee from '../Marquee/Marquee';
import styles from './Sponsor.module.scss';

<<<<<<< HEAD
import Intel from 'public/index/Sponsors/intel.png';
import Intel_new from 'public/index/Sponsors/intel_logo.png';
=======
// tier 1 sponsors
// import Intel from 'public/index/Sponsors/intel_logo.png';
import csDepartment from 'public/index/Sponsors/cs.png';
import asucd from 'public/index/Sponsors/asucd.png';

// tier 2 sponsors
import pepsi from 'public/index/Sponsors/pepsi.png';
import chevron from 'public/index/Sponsors/chevron.png';
import cfc from 'public/index/Sponsors/cfc.jpg';
import glico from 'public/index/Sponsors/Glico.png';
import guayaki from 'public/index/Sponsors/gym.png';
import ucdLS from 'public/index/Sponsors/ls.png';
>>>>>>> origin/main

export default function Sponsors() {
  return (
    <div className={styles.container}>
      <Marquee iterations={2} duration={50}>
        {/* <Logo
          imgSrc={Intel}
          url="https://www.intel.com/content/www/us/en/homepage.html"
          alt="Intel Logo"
        /> */}
        <Logo
          imgSrc={csDepartment}
          url="https://cs.ucdavis.edu/"
          alt="UC Davis Computer Science Department Logo"
        />
        <Logo
          imgSrc={asucd}
          url="https://asucd.ucdavis.edu/"
          alt="ASUCD Logo"
        />
      </Marquee>
      <Marquee iterations={2} reverse duration={50}>
        <Logo imgSrc={pepsi} url="https://www.pepsi.com/" alt="Pepsi Logo" />
        <Logo
<<<<<<< HEAD
          imgSrc={Intel_new}
          url="https://www.intel.com/content/www/us/en/homepage.html"
          alt="Intel Logo"
        />
        <Logo
          imgSrc={Intel_new}
          url="https://www.intel.com/content/www/us/en/homepage.html"
          alt="Intel Logo"
        />
        <Logo
          imgSrc={Intel_new}
          url="https://www.intel.com/content/www/us/en/homepage.html"
          alt="Intel Logo"
=======
          imgSrc={chevron}
          url="https://www.chevron.com/"
          alt="Chevron Logo"
        />
        <Logo
          imgSrc={cfc}
          url="https://csi.ucdavis.edu/cfc/"
          alt="Club Financial Council Logo"
        />
        <Logo imgSrc={glico} url="https://www.glico.com/us/" alt="Glico Logo" />
        <Logo
          imgSrc={guayaki}
          url="https://guayaki.com/"
          alt="Guayaki Yerba Mate Logo"
        />
        <Logo
          imgSrc={ucdLS}
          url="https://lettersandscience.ucdavis.edu/"
          alt="UC Davis College of Letters & Science Logo"
>>>>>>> origin/main
        />
      </Marquee>
    </div>
  );
}
