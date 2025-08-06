import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
    const { prompt, setPrompt, setReply, currThreadId, prevChats, setPrevChats } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const API_BASE = "http://localhost:8000/api";

    const getReply = async () => {
        if (!prompt.trim() || loading) return;

        setLoading(true);
        setErrorMsg("");

        try {
            // ✅ Send message to backend
            const response = await fetch(`${API_BASE}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: prompt, threadId: currThreadId }),
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const res = await response.json();
            console.log("✅ Server response:", res);

            // ✅ Append user and assistant messages directly
            setPrevChats((prevChats) => [
                ...prevChats,
                { role: "user", content: prompt },
                { role: "assistant", content: res.reply }
            ]);

            // ✅ Store the latest reply
            setReply(res.reply);

            // ✅ Clear the input
            setPrompt("");
        } catch (err) {
            console.error("❌ Chat Request Failed:", err.message);
            setErrorMsg("⚠️ Could not connect to the server. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatWindow">
            {/* ✅ Navbar */}
            <div className="navbar">
                <div className="navbar-left">
                    <img src="src/assets/logo.jpg" alt="Logo" className="navbar-logo" />
                    <span className="navbar-title">
                        PersonalAI
                        <i className="fa-solid fa-chevron-down dropdown-icon"></i>
                    </span>
                </div>
                <div className="userIconDiv">
                    <span className="userIcon">
                        <i className="fa-solid fa-user"></i>
                    </span>
                </div>
            </div>

            {/* ✅ Chat Area */}
            <div className="chatArea">
                <Chat />
                {loading && (
                    <div className="loader-overlay">
                        <ScaleLoader color="#4cafef" loading={loading} />
                        <p className="loading-text">Thinking...</p>
                    </div>
                )}
            </div>

            {/* ✅ Chat Input */}
            <div className="chatInput">
                <input
                    type="text"
                    placeholder="Ask anything"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && getReply()}
                />
                <button
                    id="submit"
                    onClick={getReply}
                    disabled={loading}
                    style={{ opacity: loading ? 0.6 : 1 }}
                >
                    {loading ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                        <i className="fa-solid fa-paper-plane"></i>
                    )}
                </button>
            </div>

            {/* ✅ Error Message */}
            {errorMsg && <p className="info" style={{ color: "red" }}>{errorMsg}</p>}

            {/* ✅ Info Text */}
            <p className="info">
                ⚠️ PersonalAI can make mistakes. Check important info. See Cookie Preferences.
            </p>
        </div>
    );
}

export default ChatWindow;
