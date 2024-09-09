"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Box, Avatar, Button, TextField, Typography, Paper } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

// Smooth scroll effect
const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
  ref.current?.scrollIntoView({ behavior: 'smooth' });
};

// Message fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface MessageProps {
  sender: 'user' | 'bot' | 'admin';
  text?: string;
}

// Container for messages
const MessageContainer = styled(Box)<MessageProps>(({ sender }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
  animation: `${fadeIn} 0.4s ease-in-out`,
  justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
}));

// Styled message bubble
const MessageBubble = styled(Paper)<MessageProps>(({ sender }) => ({
  padding: '15px 20px',
  borderRadius: '30px',
  backgroundColor: sender === 'user' ? '#4B88A2' : '#f1f1f1',
  color: sender === 'user' ? '#fff' : '#333',
  maxWidth: '70%',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: sender === 'user' ? '#3A738C' : '#e6e6e6',
  },
}));

interface Message {
  sender: 'user' | 'bot' | 'admin';
  text?: string;
}

// Simulated API Responses (Replace this with actual API call)
const fetchTrainData = (userQuery: string): string => {
  if (userQuery.toLowerCase().includes('pnr')) {
    return 'Your PNR Status is: Confirmed, Coach S1, Seat 34.';
  } else if (userQuery.toLowerCase().includes('train status')) {
    return 'Train 12345 is running on time and will arrive at Delhi at 14:30.';
  } else if (userQuery.toLowerCase().includes('refund')) {
    return "You can apply for a refund through the IRCTC website under the 'Ticket Cancellation' section.";
  } else {
    return 'Sorry, I am not sure about that. Please try rephrasing or check the Indian Railways website.';
  }
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hi there! 👋 How can I assist you today with Rail Madad?' },
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [showAdminButton, setShowAdminButton] = useState<boolean>(false); // Track unhandled queries
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages are updated
  useEffect(() => {
    scrollToBottom(messageEndRef);
  }, [messages]);

  const handleSendMessage = () => {
    if (userInput.trim()) {
      const userMessage = userInput;
      setMessages([...messages, { sender: 'user', text: userMessage }]);
      setUserInput('');

      // Simulate API call and response delay
      setTimeout(() => {
        const botResponse = fetchTrainData(userMessage);

        // Check if the bot's response is unhandled
        if (botResponse.includes('Sorry, I am not sure about that')) {
          setShowAdminButton(true); // Show the Contact Admin button for unhandled queries
        } else {
          setShowAdminButton(false); // Reset the admin button for handled queries
        }

        setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
      }, 1000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleAdminRedirect = () => {
    alert('Redirecting to Admin...');
  };

  // Firestore query example
  const getDepartmentData = async () => {
    try {
      const q = query(
        collection(db, 'departments'),
        where('email', '==', 'admin@example.com') // Replace with actual email or identifier
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
      });
    } catch (error) {
      console.error('Error fetching documents: ', error);
    }
  };

  useEffect(() => {
    getDepartmentData();
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '700px', // Increased chatbox width
        margin: '40px auto', // Proper margin for centering the chatbox
        backgroundColor: '#fff',
        borderRadius: '24px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Poppins, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        height: '600px', // Increased chatbox height
        overflow: 'hidden', // Prevents overflow outside the box
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          padding: '16px',
          backgroundColor: '#4B88A2',
          color: '#fff',
          textAlign: 'center',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Rail Madad Chatbot
        </Typography>
      </Box>

      {/* Chat Window */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto', // Scrollable chat area
          padding: '20px',
          backgroundColor: '#F9F9F9',
        }}
      >
        {messages.map((msg, index) => (
          <MessageContainer key={index} sender={msg.sender}>
            {msg.sender === 'bot' && (
              <Avatar
                src="/botAvatar.jpg"
                alt="Bot"
                sx={{ marginRight: '10px', border: '2px solid #4B88A2' }}
              />
            )}
            {msg.sender === 'user' && (
              <Avatar
                src="/userAvatar.jpg"
                alt="You"
                sx={{ marginLeft: '10px', border: '2px solid #4B88A2' }}
              />
            )}
            {msg.sender === 'admin' ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAdminRedirect}
                sx={{
                  marginTop: '10px',
                  borderRadius: '20px',
                  backgroundColor: '#FF6B6B',
                  '&:hover': {
                    backgroundColor: '#E85858',
                  },
                }}
              >
                Contact Admin
              </Button>
            ) : (
              <MessageBubble sender={msg.sender}>
                <Typography variant="body1" sx={{ fontSize: '15px', lineHeight: '1.6' }}>
                  {msg.text}
                </Typography>
              </MessageBubble>
            )}
          </MessageContainer>
        ))}
        <div ref={messageEndRef} />
        {/* Show "Contact Admin" button inside the chat for unhandled queries */}
        {showAdminButton && (
          <MessageContainer sender="admin">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAdminRedirect}
              sx={{
                marginTop: '10px',
                borderRadius: '20px',
                backgroundColor: '#FF6B6B',
                '&:hover': {
                  backgroundColor: '#E85858',
                },
              }}
            >
              Contact Admin
            </Button>
          </MessageContainer>
        )}
      </Box>

      {/* Input Section */}
      <Box
        sx={{
          display: 'flex',
          padding: '16px',
          backgroundColor: '#fff',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px',
        }}
      >
        <TextField
          fullWidth
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
          variant="outlined"
          size="small"
          sx={{
            backgroundColor: '#fff',
            borderRadius: '30px',
            boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)',
            '& input': {
              padding: '12px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
            },
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          sx={{
            marginLeft: '10px',
            borderRadius: '30px',
            padding: '10px 20px',
            backgroundColor: '#4B88A2',
            '&:hover': {
              backgroundColor: '#3A738C',
            },
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            '&:active': {
              transform: 'scale(0.98)',
            },
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chatbot;