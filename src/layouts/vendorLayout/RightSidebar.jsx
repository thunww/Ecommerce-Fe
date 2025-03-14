import Bell from '../../assets/image/bell.png';
import Message from '../../assets/image/message.jpg';
import Phone from '../../assets/image/phone.png';

const RightSidebar = () => {
  return (
    <div className="fixed top-16 right-0 h-screen w-16 bg-white shadow-lg border-l flex flex-col items-center py-4 space-y-10">
      <img src={Bell} alt="Icon 1" className="w-8 h-8" />
      <img src={Phone} alt="Icon 2" className="w-8 h-8" />
      <img src={Message} alt="Icon 3" className="w-8 h-8" />
    </div>
  );
};

export default RightSidebar;
