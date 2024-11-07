import ChatBox from '@/components/ChatBox'; 
import InputBox from '@/components/InputBox'; 
import ConnectedUsers from '@/components/ConnectedUsers'; 

const Chat = () => {
  return (
    // Con (mx-2 md:mx-10 lg:mx-[10rem]) hacemos la responsividad en modo móvil, escritorio y tablet
    <div className="mx-2 md:mx-10 lg:mx-[10rem] grid grid-rows-12 col-span-12 row-span-12">
      <ConnectedUsers className="row-span-1"/>

      <ChatBox className="row-span-11" />
      <InputBox className="row-span-1" />
    </div>
  );
};

export default Chat;
