import "./Chat.css";
import { MyContext } from "./MyContext";
import { useContext } from "react";

function Chat() {
    const { newChat, prevChats } = useContext(MyContext);

    return (
        <div className="chat-container">
            {/* ✅ Show "Start a new chat" if no previous messages */}
            {newChat && prevChats.length === 0 && (
                <h2 className="start-chat-text">Start a new Chat</h2>
            )}

            <div className="chats">
                {/* ✅ Loop through all chat messages */}
                {prevChats.map((chat, index) => (
                    <div
                        key={index}
                        className={chat.role === "user" ? "userDiv" : "gptDiv"}
                    >
                        <p
                            className={
                                chat.role === "user" ? "userMessage" : "gptMessage"
                            }
                        >
                            {chat.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Chat;
