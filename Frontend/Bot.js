
import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSendMessage = () => {
        if (input.trim() !== '') {
            setMessages([...messages, { text: input, sender: 'user' }]);
            setInput('');
            // Here you can add the logic to send the message to your backend
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setMessages([...messages, { text: `File uploaded: ${file.name}`, sender: 'system' }]);
            // Here you can add the logic to handle the file upload
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

export default Chatbot;
3. Create the CSS File
Create a new file called Chatbot.css in the src directory and add the following CSS:

Copy
/* src/Chatbot.css */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
}

.chat-container {
    width: 400px;
    height: 600px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.chat-header {
    background-color: #007bff;
    color: #fff;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.profile {
    display: flex;
    align-items: center;
}

.profile-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.profile-info h2 {
    margin: 0;
    font-size: 16px;
}

.profile-info p {
    margin: 0;
    font-size: 12px;
}

.chat-body {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
}

.chat-messages {
    list-style: none;
    padding: 0;
}

.message {
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
}

.message.user {
    background-color: #dcf8c6;
    align-self: flex-end;
}

.message.system {
    background-color: #f1f1f1;
    align-self: flex-start;
}

.chat-footer {
    background-color: #f1f1f1;
    padding: 15px;
    display: flex;
    align-items: center;
}

.file-upload {
    margin-right: 10px;
}

.message-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
}

.send-button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.send-button:hover {
    background-color: #0056b3;
}
