import './App.css'
import Sidebar from './Sidebar.jsx';
import ChatWindow from './chatWindow.jsx';
import { MyContext } from './MyContext.jsx';
function App() {
  const providerValues={};//passing values
  return (
    <div className='app'>
      <MyContext.Provider values={providerValues}>
         <Sidebar></Sidebar>
         <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

export default App
