import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Clé API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) console.error("Clé API manquante");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const MAX_RETRIES = 4;

function EmojiChat({ mood, onSave }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(""); // ← Contrôlé
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Fonction d'exécution (API + retry)
  const executeSend = async (messageToSend, attempt = 0) => {
    if (attempt > 0) {
      setChatHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { sender: "bot", text: "..." };
        return newHistory;
      });
    }

    setIsLoading(true);
    setRetryCount(attempt + 1);

    try {
      const prompt = `
        Tu es "Le Confident Émoji", un chatbot bienveillant.
        L'humeur actuelle de l'utilisateur est : ${mood}.
        Le message de l'utilisateur est : "${messageToSend}".
        Ta seule et unique règle : répondre UNIQUEMENT avec des émojis, sans texte.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const botResponseText = response.text().trim() || "Robot";

      setChatHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { sender: "bot", text: botResponseText };
        return newHistory;
      });

      setIsLoading(false);
      setRetryCount(0);
    } catch (error) {
      console.error(`[Retry ${attempt + 1}]`, error);

      if ((error.status === 503 || error.status === 429) && attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 1000;
        setTimeout(() => executeSend(messageToSend, attempt + 1), delay);
        return;
      }

      setChatHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = {
          sender: "bot",
          text: "Erreur serveur – réessaie plus tard",
        };
        return newHistory;
      });
      setIsLoading(false);
      setRetryCount(0);
    }
  };

  // Fonction déclenchée par l’utilisateur
  const handleSend = () => {
    const messageToSend = currentMessage.trim();
    if (!messageToSend || isLoading) return;

    const userMessage = { sender: "user", text: messageToSend };
    const botPlaceholder = { sender: "bot", text: "..." };

    setChatHistory((prev) => [...prev, userMessage, botPlaceholder]);
    setCurrentMessage(""); // ← On vide APRÈS l'ajout
    executeSend(messageToSend);
  };

  const handleSaveClick = () => {
    if (isLoading) return;
    onSave(mood, chatHistory);
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <button
        onClick={handleSaveClick}
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "12px",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontSize: "1rem",
          fontWeight: "bold",
          marginBottom: "15px",
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        Sauvegarder et Fermer
      </button>

      <h2 style={{ textAlign: "center", margin: "0 0 15px 0" }}>
        Tu te sens {mood}. Raconte-moi tout.
      </h2>

      <div
        style={{
          height: "300px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "12px",
          overflowY: "auto",
          marginBottom: "12px",
          background: "#f9f9f9",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {chatHistory.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", fontSize: "0.9rem", margin: 0 }}>
            Commence la conversation...
          </p>
        ) : (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                margin: "6px 0",
              }}
            >
              <span
                style={{
                  background: msg.sender === "user" ? "#dcf8c6" : "#ffffff",
                  color: msg.sender === "user" ? "#000" : "#333",
                  padding: "10px 14px",
                  borderRadius: "18px",
                  display: "inline-block",
                  maxWidth: "80%",
                  wordWrap: "break-word",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  fontSize: "1.1rem",
                }}
              >
                {msg.text}
              </span>
            </div>
          ))
        )}
      </div>

      {/* INPUT CORRIGÉ : Le texte apparaît en temps réel */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)} // ← Mise à jour instantanée
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // ← Empêche le saut de ligne
              handleSend();
            }
          }}
          placeholder={
            retryCount > 0
              ? `Réessai... (${retryCount}/${MAX_RETRIES})`
              : "Écris ton message..."
          }
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "24px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            outline: "none",
            background: isLoading ? "#f5f5f5" : "#fff",
            transition: "all 0.2s",
             color: "#000", 
          }}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !currentMessage.trim()}
          style={{
            width: "48px",
            height: "48px",
            fontSize: "1.6rem",
            background:
              retryCount > 0
                ? "#ffc107"
                : currentMessage.trim()
                ? "#34a853"
                : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "50%",
            cursor:
              isLoading || !currentMessage.trim() ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            transition: "all 0.2s",
          }}
        >
          {isLoading ? "Horaire" : retryCount > 0 ? "Recommencer" : "Envoyer"}
        </button>
      </div>

      {retryCount > 0 && (
        <p
          style={{
            fontSize: "0.8rem",
            color: "#ff9800",
            textAlign: "center",
            margin: "5px 0",
          }}
        >
          Serveur surchargé – tentative {retryCount}/{MAX_RETRIES}...
        </p>
      )}
    </div>
  );
}

export default EmojiChat;