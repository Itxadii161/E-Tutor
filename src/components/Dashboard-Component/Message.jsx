import React, { useState } from "react";

const messagesData = [
  { id: 1, name: "Jane Cooper", lastMessage: "Yeah sure, tell me zafor", time: "just now", active: true },
  { id: 2, name: "Jenny Wilson", lastMessage: "Thank you so much, sir", time: "2 d", active: false },
  { id: 3, name: "Marvin McKinney", lastMessage: "You're welcome", time: "1 m", active: false },
  { id: 4, name: "Eleanor Pena", lastMessage: "Thank you so much, sir", time: "2 h", active: false },
  { id: 5, name: "Ronald Richards", lastMessage: "Sorry, I can't help you", time: "2 h", active: false },
];

// Simulating messages for each user (In real case, get from backend)
const chatHistory = {
  1: [
    { sender: "Jane", text: "Hello! Thanks for signing up.", time: "Today" },
    { sender: "You", text: "Hello, Good Evening", time: "Today" },
    { sender: "You", text: "I'm Zafor", time: "Today" },
    { sender: "You", text: "I have a question about your lecture.", time: "Today" },
    { sender: "Jane", text: "Yeah sure, tell me zafor", time: "Today" },
  ],
  2: [{ sender: "Jenny", text: "Hey! How can I help?", time: "Yesterday" }],
  3: [{ sender: "Marvin", text: "Welcome!", time: "Today" }],
  4: [{ sender: "Eleanor", text: "Glad to help!", time: "Last week" }],
  5: [{ sender: "Ronald", text: "I don't think I can help.", time: "2 days ago" }],
};

const Message = () => {
  const [activeChat, setActiveChat] = useState(messagesData[0]);
  const [chatMessages, setChatMessages] = useState(chatHistory[1]);
  const [newMessage, setNewMessage] = useState("");

  // Function to change chat when clicking another user
  const handleChatChange = (user) => {
    setActiveChat(user);
    setChatMessages(chatHistory[user.id] || []);
  };

  // Function to send a new message
  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const updatedMessages = [...chatMessages, { sender: "You", text: newMessage, time: "Now" }];
      setChatMessages(updatedMessages);
      chatHistory[activeChat.id] = updatedMessages; // Simulating backend update
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-[55%] bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 bg-white shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Message</h2>
        <input type="text" placeholder="Search" className="w-full p-2 mb-4 border border-gray-300 rounded-lg" />
        <div>
          {messagesData.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleChatChange(msg)}
              className={`p-3 rounded-lg cursor-pointer ${
                activeChat.id === msg.id ? "bg-orange-100" : "hover:bg-gray-200"
              }`}
            >
              <p className="font-bold">{msg.name}</p>
              <p className="text-sm text-gray-600">{msg.lastMessage}</p>
              <p className="text-xs text-gray-500">{msg.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="w-2/3 bg-white shadow-md p-6 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center border-b pb-3 mb-3">
          <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full mr-3" />
          <div>
            <p className="font-bold">{activeChat.name}</p>
            <p className="text-green-500 text-sm">Active Now</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"} mb-2`}>
              <div className={`p-3 rounded-lg max-w-xs ${msg.sender === "You" ? "bg-orange-500 text-white" : "bg-gray-200"}`}>
                <p>{msg.text}</p>
                <p className="text-xs text-gray-500">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t pt-3 flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
          />
          <button onClick={sendMessage} className="ml-3 bg-orange-500 text-white px-4 py-2 rounded-lg">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
