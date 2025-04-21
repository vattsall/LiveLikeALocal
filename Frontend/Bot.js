
import React, { useState } from 'react';
import './Chat.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const SendMessage = () => {
        if (input.trim() !== '') {
            setMessages([...messages, { text: input, sender: 'user' }]);
            setInput('');
           
        }
    };

    const FileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setMessages([...messages, { text: `File uploaded: ${file.name}`, sender: 'system' }]);
     
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <div className="profile">
                    <img src="profile.jpg" alt="Profile Picture" className="profile-pic" />
                    <div className="profile-info">
                        <h2>Chatbot Name</h2>
                        <p>Online</p>
                    </div>
                </div>
                <h1>Chat Heading</h1>
            </div>
            <div className="chat-body">
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender}`}>
                            {message.text}
                        </div>
                    ))}
                </div>
            </div>
            <div className="chat-footer">
                <input type="file" id="file-upload" className="file-upload" onChange={handleFileUpload} />
                <input
                    type="text"
                    id="message-input"
                    className="message-input"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button id="send-button" className="send-button" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Bot;

