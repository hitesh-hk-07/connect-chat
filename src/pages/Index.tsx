import { Helmet } from "react-helmet";
import ChatContainer from "@/components/chat/ChatContainer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Realtime Chat | Connect & Communicate</title>
        <meta name="description" content="A modern realtime chat application with beautiful dark theme and smooth animations. Connect with others instantly." />
      </Helmet>
      <main className="min-h-screen">
        <ChatContainer />
      </main>
    </>
  );
};

export default Index;
