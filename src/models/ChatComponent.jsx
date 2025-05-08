import React, { useEffect, useState } from 'react';
import { getUserConversations, getConversationMessages, sendMessage } from '../api/apiService';

const ChatComponent = ({ currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (currentUser?._id) {
      getUserConversations(currentUser._id)
        .then(setConversations)
        .catch(console.error)
        .finally(() => setLoadingConversations(false));
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedUser) {
      setLoadingMessages(true);
      getConversationMessages(currentUser._id, selectedUser._id)
        .then(setMessages)
        .catch(console.error)
        .finally(() => setLoadingMessages(false));
    }
  }, [selectedUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const outgoing = {
      _id: Date.now().toString(),
      content: newMessage,
      sender: currentUser._id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, outgoing]);
    setNewMessage('');

    try {
      const { message } = await sendMessage({
        senderId: currentUser._id,
        receiverId: selectedUser._id,
        content: newMessage,
      });
      setMessages((prev) => [...prev, message]);
    } catch (err) {
      console.error(err);
      alert('Error sending message.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen max-w-6xl mx-auto bg-white rounded-lg overflow-hidden shadow-xl">
      {/* Conversations List */}
      <div className={`w-full lg:w-1/3 bg-gradient-to-br from-indigo-50 to-white border-r border-indigo-100 p-4 overflow-y-auto ${selectedUser ? 'hidden lg:block' : 'block'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-900">Messages</h2>
          <div className="relative mt-2">
            <input
              type="text"
              placeholder="Search conversations..."
              className="pl-8 pr-4 py-2 text-sm rounded-full border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
            />
            <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loadingConversations ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          Array.isArray(conversations) && conversations.length > 0 ? (
            <div className="space-y-2">
              {conversations.map((conv) => {
                const user = conv.tutor?._id === currentUser._id ? conv.student : conv.tutor;
                const isActive = selectedUser?._id === user._id;
                return (
                  <div
                    key={conv._id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-100 border-l-4 border-indigo-500' 
                        : 'hover:bg-indigo-50'
                    }`}
                  >
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-medium">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      {isActive && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">
                        {conv.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No conversations</h3>
              <p className="mt-1 text-sm text-gray-500">Start a new conversation with someone</p>
            </div>
          )
        )}
      </div>

      {/* Chat Area */}
      <div className={`w-full lg:w-2/3 flex flex-col ${selectedUser ? 'block' : 'hidden lg:flex'}`}>
        {/* Header */}
        {selectedUser ? (
          <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <button 
                onClick={() => setSelectedUser(null)} 
                className="mr-4 lg:hidden text-gray-500 hover:text-gray-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50">
            <svg className="h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Select a conversation</h3>
            <p className="mt-1 text-sm text-gray-500">Choose from your existing conversations or start a new one</p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-white to-indigo-50 space-y-4">
          {selectedUser ? (
            loadingMessages ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              Array.isArray(messages) && messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`relative rounded-2xl p-4 max-w-xs lg:max-w-md shadow-sm ${msg.sender === currentUser._id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 text-right ${msg.sender === currentUser._id ? 'text-indigo-100' : 'text-gray-500'}`}>
                        {msg.timestamp}
                      </p>
                      {msg.sender === currentUser._id && (
                        <div className="absolute -right-1.5 bottom-3 w-3 h-3 bg-indigo-600 transform rotate-45"></div>
                      )}
                      {msg.sender !== currentUser._id && (
                        <div className="absolute -left-1.5 bottom-3 w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg className="h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="mt-2 text-gray-500">No messages yet. Start the conversation!</p>
                </div>
              )
            )
          ) : null}
        </div>

        {/* Input */}
        {selectedUser && (
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="
0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l4 4-4 4m13-8l4 4-4 4" />
</svg>
</button>
<input
type="text"
placeholder="Type a message..."
className="flex-1 px-4 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
value={newMessage}
onChange={(e) => setNewMessage(e.target.value)}
onKeyDown={handleKeyPress}
/>
<button className="bg-indigo-500 text-white px-4 py-2 rounded-full" onClick={handleSendMessage} >
Send
</button>
</div>
</div>
)}
</div>
</div>
);
};

export default ChatComponent;