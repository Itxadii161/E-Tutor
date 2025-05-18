import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getMessages,
  createOrGetConversation,
  getUserConversations,
  getTutorById
} from '../../api/apiService';

const ChatComponent = ({ currentUser }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [showConversationList, setShowConversationList] = useState(true);
  // const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
  
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        const convos = await getUserConversations();
        setConversations(convos);

        if (tutorId) {
          const tutor = await getTutorById(tutorId);
          setOtherUser({
            ...tutor,
            isOnline: tutor.isOnline || false,
          });

          const conv = await createOrGetConversation(tutorId);
          setSelectedConversation(conv);

          const msgs = await getMessages(conv._id);
          setMessages(msgs);

          if (!convos.some((c) => c._id === conv._id)) {
            setConversations((prev) => [...prev, conv]);
          }

          if (isMobile) {
            setShowConversationList(false);
          }
        } else if (convos.length > 0) {
          const firstConvo = convos[0];
          setSelectedConversation(firstConvo);

          const other = firstConvo.members.find((m) => m._id !== currentUser._id);
          setOtherUser({
            ...other,
            isOnline: other.isOnline || false,
          });

          const msgs = await getMessages(firstConvo._id);
          setMessages(msgs);
        }
      } catch (error) {
        console.error('Chat initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [tutorId, currentUser._id, isMobile]);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000', {
      auth: { userId: currentUser._id },
    });

    socketRef.current.on('connect', () => {
      conversations.forEach((convo) => {
        socketRef.current.emit('joinRoom', convo._id);
      });
    });

    socketRef.current.on('newMessage', (message) => {
      if (message.conversationId === selectedConversation?._id) {
        setMessages((prevMessages) => {
          const optimisticIndex = prevMessages.findIndex(
            (msg) =>
              msg.isOptimistic &&
              msg.text === message.text &&
              msg.sender._id === message.sender._id
          );
    
          if (optimisticIndex !== -1) {
            const updatedMessages = [...prevMessages];
            updatedMessages[optimisticIndex] = message;
            return updatedMessages;
          }
    
          return [...prevMessages, message];
        });
      }
    });
    
    socketRef.current.on('userOnline', (userId) => {
      if (otherUser?._id === userId) {
        setOtherUser((prev) => ({ ...prev, isOnline: true }));
      }
    });

    socketRef.current.on('userOffline', (userId) => {
      if (otherUser?._id === userId) {
        setOtherUser((prev) => ({ ...prev, isOnline: false }));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [conversations, selectedConversation, otherUser?._id, currentUser._id]);

  useEffect(() => {
    if (!socketRef.current) return;
    conversations.forEach((convo) => {
      socketRef.current.emit('joinRoom', convo._id);
    });
  }, [conversations]);

  const handleSelectConversation = async (conversationId, otherUser) => {
    try {
      setLoading(true);
      setOtherUser(otherUser);
      const msgs = await getMessages(conversationId);
      setMessages(msgs);
      const selected = conversations.find((c) => c._id === conversationId);
      setSelectedConversation(selected);
      socketRef.current.emit('joinRoom', conversationId);
      
      if (isMobile) {
        setShowConversationList(false);
      }
    } catch (error) {
      console.error('Error selecting conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToConversations = () => {
    setShowConversationList(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation?._id) return;

    const messageToSend = newMessage;
    const tempMessage = {
      _id: Date.now().toString(),
      text: messageToSend,
      sender: {
        _id: currentUser._id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
      },
      conversationId: selectedConversation._id,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage('');

    socketRef.current.emit('sendMessage', {
      text: messageToSend,
      conversationId: selectedConversation._id,
      sender: currentUser._id,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[83vh] bg-gray-100">
      {/* Main Chat Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversation List */}
        {(showConversationList || !isMobile) && (
          <div className={`${isMobile ? 'w-full   bg-white' : 'w-80 border-r'} bg-white overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className="sticky top-0 z-10  bg-white p-3 border-b flex items-center justify-between shadow-sm">
              {isMobile && (
                <button 
                  onClick={() => navigate(-1)}
                  className="text-gray-600 p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
              <div className="w-5"></div>
            </div>

            {/* Search Bar */}
            <div className="p-3 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search or start new chat"
                  className="w-full bg-gray-100 rounded-lg py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Conversation Items */}
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500 ">
                No conversations yet
              </div>
            ) : (
              <div className="overflow-y-auto flex-1 ">
                {conversations.map((conv) => {
                  const other = conv.members.find((m) => m._id !== currentUser._id);
                  const lastMessage = messages.length > 0 
                    ? messages[messages.length - 1]?.text 
                    : 'Start a conversation';

                  return (
                    <div
                      key={conv._id}
                      onClick={() => handleSelectConversation(conv._id, other)}
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedConversation?._id === conv._id 
                          ? 'bg-gray-100' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {other?.profilePicture ? (
                              <img
                                src={other.profilePicture}
                                alt={other.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-600 font-medium">
                                {other?.fullName?.charAt(0) || 'U'}
                              </span>
                            )}
                          </div>
                          {isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-800 truncate">
                              {other?.fullName || 'Unknown User'}
                            </p>
                            <span className="text-xs text-gray-500">
                              {new Date(conv.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Chat Area */}
        {(!showConversationList || !isMobile) && (
          <div className={`flex-1 flex flex-col ${isMobile ? 'w-full h-[86vh]' : 'h-[83vh]'} bg-white`}>
            {selectedConversation ? (
              <>
                {/* Fixed Chat Header */}
                <div className="sticky top-0 z-10 bg-white p-3 border-b flex items-center shadow-sm">
                  {isMobile && (
                    <button 
                      onClick={handleBackToConversations}
                      className="text-gray-600 p-1 mr-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {otherUser?.profilePicture ? (
                          <img 
                            src={otherUser.profilePicture} 
                            alt={otherUser.fullName} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="text-gray-600 font-medium">
                            {otherUser?.fullName?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {otherUser?.fullName || 'Unknown User'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-600 p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>

                {/* Messages Container */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1  overflow-y-auto p-4 bg-gray-50"
                  style={{ 
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkEEjIZJ8P9JwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAJUlEQVQ4y2NgGAXDFmzatMmKAQ38f2TgKANHGTjKwFEGjjJwFAAAz7QH+W1Q5vIAAAAASUVORK5CYII=")'
                  }}
                >
                  <div className="[&::-webkit-scrollbar]:hidden space-y-2">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="w-16 h-16 mb-4 text-gray-300">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <p>No messages yet</p>
                        <p className="text-sm mt-1">Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isMe = msg.sender?._id?.toString() === currentUser._id?.toString();
                        const messageTime = new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        return (
                          <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                                isMe 
                                  ? 'bg-indigo-500 text-white rounded-tr-none' 
                                  : 'bg-white text-gray-800 rounded-tl-none shadow'
                              }`}
                            >
                              {!isMe && (
                                <p className="text-xs font-semibold text-indigo-600">
                                  {msg.sender?.firstName || 'Unknown'}
                                </p>
                              )}
                              <p className="text-sm">{msg.text}</p>
                              <p className={`text-xs mt-1 text-right ${
                                isMe ? 'text-indigo-100' : 'text-gray-500'
                              }`}>
                                {messageTime}
                                {isMe && (
                                  <span className="ml-1">
                                    {msg.isOptimistic ? (
                                      <span className="inline-block w-3 h-3">
                                        <svg viewBox="0 0 24 24" className="w-3 h-3 text-indigo-200">
                                          <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                                        </svg>
                                      </span>
                                    ) : (
                                      <span className="inline-block w-3 h-3">
                                        <svg viewBox="0 0 24 24" className="w-3 h-3 text-indigo-200">
                                          <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.68L7.91,10.59L6.5,12L11,16.5Z" />
                                        </svg>
                                      </span>
                                    )}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    {/* <div ref={messagesEndRef} /> */}
                  </div>
                </div>

                {/* Fixed Message Input */}
                <div className="sticky bottom-0 bg-white p-3 border-t shadow-sm">
                  <div className="flex items-center gap-2">
                    <button className="text-gray-500 p-2 rounded-full hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button className="text-gray-500 p-2 rounded-full hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-4 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className={`p-2 rounded-full ${
                        newMessage.trim() 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center p-6">
                  <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">No conversation selected</h3>
                  <p className="mt-2 text-gray-500">Select a conversation from the list or start a new one</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;