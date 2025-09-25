const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5000', 'http://0.0.0.0:5000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const quizRoutes = require('./routes/quiz');
const questionRoutes = require('./routes/question');
const counselingRoutes = require('./routes/counseling');
const studyPlanRoutes = require('./routes/studyPlan');
const timetableRoutes = require('./routes/timetable');
const syllabusRoutes = require('./routes/syllabus');
const analyticsRoutes = require('./routes/analytics');

// Import services
const ChatService = require('./services/chatService');
const CommunityService = require('./services/communityService');

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5000', 'http://0.0.0.0:5000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('public/uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vinsh-ai', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/counseling', counselingRoutes);
app.use('/api/study-plans', studyPlanRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Socket.IO for real-time features
io.use(require('./middleware/socketAuth'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.user.id);
  
  // Join user to their personal room
  socket.join(`user_${socket.user.id}`);
  
  // Community chat events
  socket.on('join_community', (data) => {
    CommunityService.joinCommunity(socket, data);
  });
  
  socket.on('send_message', (data) => {
    CommunityService.handleMessage(socket, data);
  });
  
  // AI Chat events
  socket.on('ai_chat_message', async (data) => {
    try {
      const response = await ChatService.processMessage(socket.user.id, data.message);
      socket.emit('ai_chat_response', response);
    } catch (error) {
      socket.emit('ai_chat_error', { error: 'Failed to process message' });
    }
  });
  
  // Study session events
  socket.on('start_study_session', (data) => {
    // Handle study session start
    socket.to(`user_${socket.user.id}`).emit('study_session_started', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, 'localhost', () => {
  console.log(`VinshAI Backend Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});