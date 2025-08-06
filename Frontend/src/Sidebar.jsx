import "./Sidebar.css";
function Sidebar() {
    return (
        <div className="sidebar">
            {/* Logo Section */}
            <div className="sidebar-header">
                <div className="logo-container">
                    <img src="src/assets/logo.jpg" alt="AI Logo" className="logo-img" /> 
                </div>
                <button className="new-chat-btn">
                    <i className="fa-solid fa-plus"></i>
                    <span>New Chat</span>
                </button>
            </div>

            {/* Chat History Section */}
            <div className="history">
                <ul>
                    <li><i className="fa-regular fa-message"></i> Sample Thread 1</li>
                    <li><i className="fa-regular fa-message"></i> Sample Thread 2</li>
                    <li><i className="fa-regular fa-message"></i> Sample Thread 3</li>
                </ul>
            </div>

            {/* Footer */}
            <div className="sign">
                <i className="fa-solid fa-right-from-bracket"></i> Sign Out
            </div>
        </div>
    );
}

export default Sidebar;
