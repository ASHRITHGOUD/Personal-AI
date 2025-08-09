import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats} = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({
                threadId: thread.threadId,
                title: thread.title || "Untitled Chat",
            }));
           //console.log(filteredData);
            setAllThreads(filteredData);
        } catch (err) {
            console.log("Error fetching threads:", err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);
 
    const createNewChat=()=>{
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }
   
    const changeThread = async (newThreadId) => {
  setCurrThreadId(newThreadId);
  try {
    const response = await fetch(`http://localhost:8000/api/thread/${newThreadId}`);
    const res = await response.json(); // ✅ wait for both fetch and json()

    console.log(res); // Should be an array of messages

    // Add a sanity check to ensure it's an array
    if (Array.isArray(res)) {
      setPrevChats(res);
    } else {
      setPrevChats([]); // fallback to empty if data isn't valid
    }

    setNewChat(false);
    setReply(null);
  } catch (err) {
    console.log("Error loading thread:", err);
  }
};


//delete
const deleteThread=async(threadId)=>{
   try{
    const response=await fetch(`http://localhost:8000/api/thread/${threadId}`,{method:"DELETE"});
    const res=await response.json();
    console.log(res);
    //updated
    setAllThreads(prev=>prev.filter(thread=>thread.threadId!==threadId));
    if(threadId==currThreadId){
      createNewChat();
    }
   }catch(err){
    console.log(err);
   }
}

    return (
        <div className="sidebar">
            {/* Logo Section */}
            <div className="sidebar-header">
                <div className="logo-container">
                    <img src="src/assets/logo.jpg" alt="AI Logo" className="logo-img" />
                </div>
                <button className="new-chat-btn" onClick={createNewChat}>
                    <i className="fa-solid fa-plus"></i>
                    <span>New Chat</span>
                </button>
            </div>
            {/*chat History*/}
            <div className="history-section">
  {allThreads?.map((thread, idx) => (
    <div 
      key={idx} 
      className={`thread-item ${currThreadId === thread.threadId ? 'highlighted' : ''}`}
      onClick={() => changeThread(thread.threadId)}
    >
      <i className="fa-regular fa-comments icon"></i>
      <span className="thread-title" title={thread.title}>{thread.title}</span>
      
      {/* Delete icon */}
      <i 
        className="fa-solid fa-trash"
        onClick={(e) => {
          e.stopPropagation();
          deleteThread(thread.threadId);
        }}
      ></i>
    </div>
  ))}
</div>
            {/* Footer */}
            <div className="sign">
               By ASH&hearts;
            </div>
        </div>
    );
}

export default Sidebar;
