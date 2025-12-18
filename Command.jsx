import { useState, useRef, useEffect } from "react";
import "./chat.css";

export default function Command() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // ===== TEXT TO SPEECH =====
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  // ===== SEND MESSAGE =====
  const sendMessage = async (text, fromVoice = false) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply },
      ]);

      // 🔊 Speak ONLY if input was voice
      if (fromVoice) {
        speak(data.reply);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server error" },
      ]);
    }

    setInput("");
  };

  // ===== VOICE INPUT =====
  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      sendMessage(voiceText, true); // true → voice input
    };
  };

  // ===== AUTO SCROLL =====
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">🤖 Voice / Text Chatbot</div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or use mic..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
        />

        <button onClick={() => sendMessage(input)}>Send</button>

        <button className="mic-btn" onClick={startVoiceInput}>
          🎤
        </button>
      </div>
    </div>
  );
}
