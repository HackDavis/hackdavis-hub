//import styles from './TableLocations.module.scss';
import Image from 'next/image';
//import vinyl from '/public/judges/hub/vinyl.svg';
//import bunnyHand from '/public/judges/hub/bunny-hand.svg';
//import vinylPlayer from '/public/judges/hub/vinyl-player.svg';
import mascots_around_couch from '@public/judges/landing/mascots_around_couch.svg';

export default function TableLocations() {
  /* const logOutStyle = {
    zIndex: 1,
    borderRadius: '15.497px',
    background: '#9EE7E5',
    boxShadow: '0px 3.874px 61.987px 0px rgba(255, 197, 61, 0.16)',
    color: '#173A52',
    textAlign: 'center',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: 'normal',
    letterSpacing: '0.32px',
    width: '90%',
    height: '43px',
    border: 'none',
    alignSelf: 'center',
    marginTop: '64px',
  };
  const figmaLink =
    'https://www.figma.com/proto/9frZI5Kc9f2c8o4ZIZG8fX/Judging-Table-Map?page-id=0:1&type=design&node-id=1-4&viewport=134,164,0.69&t=Jfp4HXeR7nRs3B6R-1&scaling=min-zoom&mode=design';
 */
  return (
    <div className="bg-white rounded-[32px] py-[34px] px-[30px] text-[#3F3F3F]">
      <p className="font-semibold text-[22px]">Question?</p>
      <p className="text-[18px]">
        Please ask a HackDavis director (dark blue shirt)!
      </p>
      <Image
        src={mascots_around_couch}
        alt="mascots around couch"
        className="w-full"
      />
    </div>
  );
}
