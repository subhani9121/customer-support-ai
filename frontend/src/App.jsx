import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    const userMessage = message.trim();

    // ------------------------------------------------
    // HANDLE GREETINGS WITHOUT CALLING THE BACKEND
    // ------------------------------------------------

    const greetingPattern =
      /^(hi|hii|hello|hey|good morning|good afternoon|good evening)[!. ]*$/i;

    if (greetingPattern.test(userMessage)) {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "user",
          text: userMessage,
        },
        {
          type: "ai",
          data: {
            answer: "Hi! 👋 How can I help you today?",
            category: "Greeting",
            confidence: 1,
            retrieved_faqs: [],
            escalation: false,
          },
        },
      ]);

      setMessage("");
      return;
    }

    // ------------------------------------------------
    // ADD CUSTOMER MESSAGE TO CHAT HISTORY
    // ------------------------------------------------

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        type: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    // ------------------------------------------------
    // SEND MESSAGE TO FASTAPI BACKEND
    // ------------------------------------------------

    try {
      const response = await fetch("https://customer-support-ai-wiwl4.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      // ------------------------------------------------
      // ADD AI RESPONSE TO CHAT HISTORY
      // ------------------------------------------------

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "ai",
          data: data,
        },
      ]);
    } catch (error) {
      // ------------------------------------------------
      // HANDLE CONNECTION ERROR
      // ------------------------------------------------

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "error",
          text: "Unable to connect to the support server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // CLEAR CHAT
  // ------------------------------------------------

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <h1>🤖 CloudDesk Support AI</h1>
          <p>Tier-1 Customer Support Assistant</p>
        </div>
      </header>

      {/* MAIN CHAT AREA */}
      <main className="chat-container">

        {/* WELCOME MESSAGE */}
        <div className="welcome">
          <h2>How can we help?</h2>

          <p>
            Ask a question about billing, technical issues,
            or account access.
          </p>
        </div>

        {/* CHAT HISTORY */}
        <div className="chat-history">

          {/* EMPTY CHAT */}
          {messages.length === 0 && (
            <div className="empty-chat">
              <div className="empty-icon">💬</div>

              <p>
                Start a conversation with CloudDesk Support AI.
              </p>
            </div>
          )}

          {/* DISPLAY ALL MESSAGES */}
          {messages.map((item, index) => (

            <div key={index}>

              {/* ----------------------------------------
                  CUSTOMER MESSAGE
              ----------------------------------------- */}

              {item.type === "user" && (
                <div className="message-row user-row">

                  <div className="message user-message">

                    <div className="message-label">
                      👤 You
                    </div>

                    <p>{item.text}</p>

                  </div>

                </div>
              )}

              {/* ----------------------------------------
                  AI RESPONSE
              ----------------------------------------- */}

              {item.type === "ai" && (

                <div className="message-row ai-row">

                  {/* HUMAN ESCALATION */}
                  {item.data.escalation ? (

                    <div className="message ai-message escalation">

                      <div className="message-label">
                        🚨 Human Review Required
                      </div>

                      <p>
                        {item.data.answer}
                      </p>

                      <p>
                        <strong>Reason:</strong>{" "}
                        {item.data.reason}
                      </p>

                    </div>

                  ) : (

                    /* NORMAL AI RESPONSE */

                    <div className="message ai-message">

                      <div className="message-label">
                        🤖 CloudDesk Support
                      </div>

                      <p className="answer">
                        {item.data.answer}
                      </p>

                      {/* CATEGORY + CONFIDENCE */}

                      <div className="details">

                        <span className="badge">
                          🏷️ Category:{" "}
                          {item.data.category}
                        </span>

                        <span className="badge confidence">
                          📊 Confidence:{" "}
                          {item.data.confidence}
                        </span>

                      </div>

                      {/* KNOWLEDGE BASE */}

                      {item.data.retrieved_faqs &&
                        item.data.retrieved_faqs.length > 0 && (

                          <div className="source">

                            📚 <strong>Knowledge Base:</strong>{" "}
                            FAQ retrieved successfully

                          </div>

                        )}

                    </div>

                  )}

                </div>
              )}

              {/* ----------------------------------------
                  ERROR MESSAGE
              ----------------------------------------- */}

              {item.type === "error" && (

                <div className="message-row ai-row">

                  <div className="message error">
                    ⚠️ {item.text}
                  </div>

                </div>

              )}

            </div>

          ))}

          {/* ----------------------------------------
              LOADING MESSAGE
          ----------------------------------------- */}

          {loading && (

            <div className="message-row ai-row">

              <div className="message ai-message loading">
                🤖 CloudDesk is thinking...
              </div>

            </div>

          )}

        </div>

        {/* ----------------------------------------
            INPUT AREA
        ----------------------------------------- */}

        <div className="input-area">

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {

              // ENTER = SEND
              // SHIFT + ENTER = NEW LINE

              if (e.key === "Enter" && !e.shiftKey) {

                e.preventDefault();

                sendMessage();
              }

            }}
            placeholder="Type your support question..."
            rows="3"
          />

          <div className="input-buttons">

            {/* SEND BUTTON */}

            <button
              className="send-button"
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "Processing..." : "Send Message"}
            </button>

            {/* CLEAR CHAT BUTTON */}

            {messages.length > 0 && (

              <button
                className="clear-button"
                onClick={clearChat}
              >
                Clear Chat
              </button>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default App;
