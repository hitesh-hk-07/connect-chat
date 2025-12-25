import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import ChatContainer from "@/components/chat/ChatContainer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, hsl(225 25% 8%) 0%, hsl(230 30% 12%) 100%)",
        }}
      >
        <div className="text-primary animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>ChatRoom - Real-time Chat</title>
        <meta name="description" content="Real-time chat application with multiple rooms and live messaging" />
      </Helmet>
      <main className="min-h-screen">
        <ChatContainer />
      </main>
    </>
  );
};

export default Index;
