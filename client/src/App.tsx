import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [latestMessage, setLatestMessage] = useState('');
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket(import.meta.env.VITE_WS_BASEURL || 'ws://localhost:5000');

    // Set WebSocket instance in state
    setSocket(ws);

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      const handleMessage = (event: MessageEvent) => {
        console.log(event.data);
        setLatestMessage(event.data);
      };

      socket.onmessage = handleMessage;

      // Cleanup event listener when WebSocket or component unmounts
      return () => {
        socket.onmessage = null;
      };
    }
  }, [socket]);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(inputMessage);
      setInputMessage(''); // Clear input field after sending
    } else {
      console.log('WebSocket is not connected.');
    }
  };

  if (!socket) return <div>Loading...</div>;

  return (
    <div className="App">
      <h1>Latest Message: {latestMessage}</h1>
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </div>

  );
}

export default App;
