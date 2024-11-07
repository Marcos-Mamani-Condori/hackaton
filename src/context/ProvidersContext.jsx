'use client'
import { BotProvider } from "@/context/BotContext";
import { DeviceProvider } from "@/context/DeviceContext";
import { InputFocusProvider } from "@/context/InputFocusContext";
import { ChatGlobalProvider } from '@/context/ChatGlobalContext';
import { ModalProvider } from '@/context/ModalContext';

const ProvidersContext = ({ children }) => {
  return (
    <ModalProvider>
    <DeviceProvider>
      <ChatGlobalProvider>
        <BotProvider>
          <InputFocusProvider>
          {children}
          </InputFocusProvider>
        </BotProvider>
      </ChatGlobalProvider>
    </DeviceProvider>
    </ModalProvider>
  );
};

export default ProvidersContext;