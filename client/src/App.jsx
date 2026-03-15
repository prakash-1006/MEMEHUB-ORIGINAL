 import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';


const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);
const API_URL = '/api';

function BottomNav({ onUploadClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
 
    return (
      <nav className="bottom-nav">
        <div className="bottom-nav-item" onClick={() => navigate('/login')} title="Login">
          <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span className="nav-label">Login</span>
        </div>
        <div className="bottom-nav-item" onClick={() => navigate('/signup')} title="Signup">
          <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span className="nav-label">Signup</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-item" onClick={() => navigate('/')} title="Home">
        <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span className="nav-label">Home</span>
      </div>
      <div className="bottom-nav-item" onClick={() => navigate('/search')} title="Search">
        <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <span className="nav-label">Search</span>
      </div>
      <div className="bottom-nav-item nav-upload" onClick={onUploadClick} title="Upload">
        <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        <span className="nav-label">Post</span>
      </div>
      <div className="bottom-nav-item" onClick={() => navigate('/messages')} title="Messages">
        <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
        <span className="nav-label">Chat</span>
      </div>
      <div className="bottom-nav-item" onClick={() => navigate(`/profile/${user.userId}`)} title="Profile">
        <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        <span className="nav-label">Profile</span>
      </div>
      <div className="bottom-nav-item" onClick={() => { logout(); navigate('/login'); }} title="Logout">
        <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
        </svg>
        <span className="nav-label">Logout</span>
      </div>
    </nav>
  );
}


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try { await login(email, password); } 
    catch (err) { setError(err.message); }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="submit-btn">Login</button>
        <p className="auth-switch">Don't have an account? <a href="/signup">Sign up</a></p>
      </form>
    </div>
  );
}

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try { await signup(username, email, password); setSuccess('Account created! Please login.'); } 
    catch (err) { setError(err.message); }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <div className="error-msg">{error}</div>}
        {success && <div style={{ color: '#00ff41', textAlign: 'center', marginBottom: '1rem' }}>{success}</div>}
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="submit-btn">Sign Up</button>
        <p className="auth-switch">Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
}

function Stories({ onAddStory }) {
  const [stories, setStories] = useState([]);
  const [ownStories, setOwnStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const fetchStories = async () => {
    try {
      const [allStoriesRes, ownStoriesRes] = await Promise.all([
        axios.get(`${API_URL}/stories`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/stories/my-stories`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setStories(allStoriesRes.data);
      setOwnStories(ownStoriesRes.data);
    } catch (err) { console.error('Error fetching stories:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    fetchStories();
  }, [token]);

  const viewStory = async (storyId) => {
    try {
      await axios.put(`${API_URL}/stories/${storyId}/view`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) { console.error('Error viewing story:', err); }
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';

  
  const hasOwnStories = ownStories.length > 0;

  return (
    <div className="stories-container">
      {}
      <div 
        className={`story-item ${hasOwnStories ? '' : 'add-story'}`} 
        onClick={() => hasOwnStories ? navigate(`/stories/${user.userId}`) : onAddStory()}
      >
        <div className="story-ring">
          <div className="story-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          {!hasOwnStories && <div className="add-story-icon">+</div>}
        </div>
        <span className="story-username">{hasOwnStories ? 'Your Stories' : 'Add Story'}</span>

      </div>
      
      {}
      {loading ? null : stories.map((group) => (
        group.stories[0] && (
          <div key={group.user._id} className="story-item" onClick={() => {
            viewStory(group.stories[0]._id);
            navigate(`/stories/${group.user._id}`);
          }}>
            <div className="story-ring">
              <div className="story-avatar">
                {group.user.profilePhoto ? (
                  <img src={group.user.profilePhoto} alt={group.user.username} />
                ) : getInitial(group.user.username)}
              </div>
            </div>
            <span className="story-username">{group.user.username}</span>
          </div>
        )
      ))}
    </div>
  );
}

// ==================== STORY VIEWER ====================
function StoryViewer() {
  const { userId } = useParams();
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchUserStories = async () => {
    try {
      const res = await axios.get(`${API_URL}/stories/user/${userId}`);
      setStories(res.data);
    } catch (err) { console.error('Error fetching stories:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    if (userId) fetchUserStories();
  }, [userId, token]);

  const markAsViewed = async () => {
    if (stories[currentIndex]) {
      try {
        await axios.put(`${API_URL}/stories/${stories[currentIndex]._id}/view`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) { console.error('Error viewing story:', err); }
    }
  };

  const nextStory = () => {
    markAsViewed();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate('/');
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    if (stories.length > 0) {
      const timer = setTimeout(() => {
        nextStory();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, stories]);

  if (loading) return <div className="loading">Loading...</div>;
  if (stories.length === 0) return <div className="empty-state"><h3>No stories</h3></div>;

  const currentStory = stories[currentIndex];

  return (
    <div className="story-viewer" onClick={nextStory}>
      <div className="story-viewer-content" onClick={(e) => e.stopPropagation()}>
        <div className="story-viewer-header">
          <div className="story-viewer-user">
            <div className="story-avatar-small">
              {currentStory.user?.profilePhoto ? (
                <img src={currentStory.user.profilePhoto} alt={currentStory.user.username} />
              ) : currentStory.user?.username?.charAt(0).toUpperCase()}
            </div>
            <span>{currentStory.user?.username}</span>
          </div>
          <button className="story-close" onClick={() => navigate('/')}>×</button>
        </div>
        {currentStory.mediaType === 'video' ? (
          <video src={currentStory.imageUrl} className="story-viewer-image" autoPlay controls={false} />
        ) : (
          <img src={currentStory.imageUrl} alt="Story" className="story-viewer-image" />
        )}
        <div className="story-progress">
          {stories.map((_, idx) => (
            <div key={idx} className={`story-progress-bar ${idx <= currentIndex ? 'active' : ''}`} />
          ))}
        </div>
      </div>
      <div className="story-nav-left" onClick={(e) => { e.stopPropagation(); prevStory(); }} />
      <div className="story-nav-right" onClick={(e) => { e.stopPropagation(); nextStory(); }} />
    </div>
  );
}

// ==================== MEME CARD ====================
function MemeCard({ meme, onLike, currentUserId }) {
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };
  const isLiked = meme.likes && meme.likes.includes(currentUserId);
  const likesCount = meme.likes ? meme.likes.length : 0;

  return (
    <div className="meme-card">
      <div className="meme-header">
        <div className="meme-avatar">{getInitial(meme.user?.username)}</div>
        <span className="meme-username">{meme.user?.username || 'Anonymous'}</span>
      </div>
      <img src={meme.imageUrl} alt={meme.caption} className="meme-image" />
      <div className="meme-actions">
        <button className={`meme-action-btn ${isLiked ? 'liked' : ''}`} onClick={() => onLike(meme._id)}>
          {isLiked ? '❤️' : '🤍'} {likesCount}
        </button>
      </div>
      <div className="meme-caption">
        <strong>{meme.user?.username || 'Anonymous'}</strong>
        <p>{meme.caption}</p>
      </div>
      <div className="meme-time">{formatDate(meme.createdAt)}</div>
    </div>
  );
}

// ==================== HOME ====================
function Home() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  const fetchMemes = async () => {
    try {
      const res = await axios.get(`${API_URL}/memes`);
      setMemes(res.data);
    } catch (err) { console.error('Error fetching memes:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    fetchMemes();
  }, []);

  const handleLike = async (memeId) => {
    if (!token) return alert('Please login to like');
    try {
      const res = await axios.put(`${API_URL}/memes/${memeId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMemes(memes.map(m => 
        m._id === memeId 
          ? { ...m, likes: res.data.liked ? [...(m.likes || []), user.userId] : (m.likes || []).filter(id => id !== user.userId) }
          : m
      ));
    } catch (err) { console.error('Error liking meme:', err); }
  };

  return (
    <div className="feed-container">
      {loading ? <div className="loading">Loading memes...</div> : 
       memes.length === 0 ? <div className="empty-state"><h3>No memes yet!</h3><p>Be the first to share!</p></div> :
       memes.map(meme => <MemeCard key={meme._id} meme={meme} onLike={handleLike} currentUserId={user?.userId} />)}
    </div>
  );
}

// ==================== UPLOAD MODAL ====================
function UploadModal({ isOpen, onClose, uploadType }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { token } = useAuth();

  if (!isOpen) return null;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('caption', caption);
      
      if (uploadType === 'story') {
        await axios.post(`${API_URL}/stories/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        alert('Mindiess uploaded!');
      } else {
        await axios.post(`${API_URL}/memes/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        alert('Post shared!');
      }
      setCaption(''); setImage(null); 
      onClose();
    } catch (err) { console.error('Error uploading:', err); alert('Failed to upload'); }
    finally { setUploading(false); }
  };

  const isStory = uploadType === 'story';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isStory ? '📱 New Story (24h)' : '➕ New Post'}</h3>

          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleUpload}>
          <input type="file" accept="image/*,video/*" onChange={(e) => setImage(e.target.files[0])} required />
          {image && <p className="file-name">{image.name}</p>}
          <textarea 
            placeholder={isStory ? "What's on your mind?" : "Write a caption..."} 
            value={caption} 
            onChange={(e) => setCaption(e.target.value)}
            className="caption-input"
          />
          <button type="submit" className="submit-btn" disabled={uploading}>
            {uploading ? 'Uploading...' : isStory ? 'Share Mindiess' : 'Share Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==================== SEARCH ====================
function Search() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/users/search/${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) { console.error('Error searching:', err); }
    finally { setLoading(false); }
  };

  const handleFollow = async (userId, isFollowing) => {
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await axios.put(`${API_URL}/users/${userId}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => {
        if (u._id === userId) {
          return {
            ...u,
            followers: isFollowing 
              ? u.followers?.filter(id => id.toString() !== user.userId.toString())
              : [...(u.followers || []), user.userId]
          };
        }
        return u;
      }));
    } catch (err) { console.error('Error following:', err); }
  };

  const isFollowing = (userObj) => {
    if (!user?.userId || !userObj.followers) return false;
    return userObj.followers.some(id => id.toString() === user.userId.toString());
  };

  return (
    <div className="feed-container">
      <div className="upload-section">
        <h3>🔍 Search Users</h3>
        <form className="upload-form" onSubmit={handleSearch}>
          <input type="text" placeholder="Search by username..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit" className="submit-btn">Search</button>
        </form>
      </div>
      {loading ? <div className="loading">Searching...</div> : 
       users.length === 0 ? <div className="empty-state"><h3>No users found</h3></div> :
       <div className="user-list">
         {users.map(u => (
           <div key={u._id} className="user-card">
             <div className="user-avatar" onClick={() => navigate(`/profile/${u._id}`)}>
               {u.profilePhoto ? <img src={u.profilePhoto} alt={u.username} /> : u.username?.charAt(0).toUpperCase()}
             </div>
             <div className="user-info">
               <h4 onClick={() => navigate(`/profile/${u._id}`)}>{u.username}</h4>
               <p>{u.bio || 'No bio yet'}</p>
             </div>
             {u._id !== user?.userId && (
               <button className={`follow-btn ${isFollowing(u) ? 'following' : ''}`} 
                 onClick={() => handleFollow(u._id, isFollowing(u))}>
                 {isFollowing(u) ? 'Following' : 'Follow'}
               </button>
             )}
           </div>
         ))}
       </div>}
    </div>
  );
}

// ==================== MESSAGES/CHAT ====================
function Messages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) { console.error('Error fetching users:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    fetchAllUsers();
  }, [token]);

  const selectUser = async (userObj) => {
    setSelectedUser(userObj);
    try {
      const res = await axios.get(`${API_URL}/messages/${userObj._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) { console.error('Error fetching messages:', err); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const res = await axios.post(`${API_URL}/messages`, 
        { recipientId: selectedUser._id, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) { console.error('Error sending message:', err); }
  };

  return (
    <div className="messages-container">
      <div className="users-sidebar">
        <h3>💬 Messages</h3>
        {loading ? <div className="loading">Loading...</div> :
         users.length === 0 ? <div className="empty-state"><p>No users found</p></div> :
         users.map(u => (
           <div key={u._id} className={`user-item ${selectedUser?._id === u._id ? 'active' : ''}`} onClick={() => selectUser(u)}>
             <div className="user-avatar-small">{u.profilePhoto ? <img src={u.profilePhoto} alt={u.username} /> : u.username?.charAt(0).toUpperCase()}</div>
             <span>{u.username}</span>
           </div>
         ))}
      </div>
      <div className="chat-area">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <span>{selectedUser.username}</span>
            </div>
            <div className="messages-list">
              {messages.map(m => (
                <div key={m._id} className={`message ${m.sender?.toString() === user?.userId ? 'sent' : 'received'}`}>
                  {m.content}
                </div>
              ))}
            </div>
            <form className="message-form" onSubmit={sendMessage}>
              <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="empty-state"><h3>Select a user to chat</h3></div>
        )}
      </div>
    </div>
  );
}

// ==================== PROFILE ====================
function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const fetchUserProfile = async (id) => {
    try {
      const [profileRes, memesRes] = await Promise.all([
        axios.get(`${API_URL}/users/${id}`),
        axios.get(`${API_URL}/memes/user/${id}`)
      ]);
      setProfile(profileRes.data);
      setMemes(memesRes.data);
      setBio(profileRes.data.bio || '');
      setProfilePhoto(profileRes.data.profilePhoto || '');
    } catch (err) { console.error('Error fetching profile:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    if (userId) fetchUserProfile(userId);
  }, [userId, token]);

  const handleSave = async () => {
    try {
      const res = await axios.put(`${API_URL}/users/profile`, 
        { bio, profilePhoto },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data);
      setEditing(false);
    } catch (err) { console.error('Error updating profile:', err); }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post(`${API_URL}/memes/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      setProfilePhoto(res.data.imageUrl);
    } catch (err) { console.error('Error uploading photo:', err); }
  };

  const handleFollow = async () => {
    if (!token) return alert('Please login');
    try {
      const isFollowing = profile.followers?.some(id => id.toString() === user.userId.toString());
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await axios.put(`${API_URL}/users/${userId}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUserProfile(userId);
    } catch (err) { console.error('Error following:', err); }
  };

  const handleLike = async (memeId) => {
    if (!token) return alert('Please login to like');
    try {
      const res = await axios.put(`${API_URL}/memes/${memeId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMemes(memes.map(m => 
        m._id === memeId 
          ? { ...m, likes: res.data.liked ? [...(m.likes || []), user.userId] : (m.likes || []).filter(id => id !== user.userId) }
          : m
      ));
    } catch (err) { console.error('Error liking meme:', err); }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return <div className="empty-state"><h3>User not found</h3></div>;

  const isOwnProfile = user?.userId?.toString() === profile._id?.toString();
  const isFollowing = profile.followers?.some(id => id.toString() === user?.userId?.toString());
  const followersCount = profile.followers ? profile.followers.length : 0;
  const followingCount = profile.following ? profile.following.length : 0;

  return (
    <div className="profile-container">
      <div className="profile-header">
        {editing ? (
          <div className="profile-edit">
            <div className="photo-upload-container">
              <div className="profile-avatar-large">
                {profilePhoto ? <img src={profilePhoto} alt={profile.username} /> : profile.username?.charAt(0).toUpperCase()}
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="photo-input" />
            </div>
            <textarea placeholder="Write your bio..." value={bio} onChange={(e) => setBio(e.target.value)} className="bio-input" />
            <div className="edit-actions">
              <button onClick={handleSave} className="submit-btn">Save</button>
              <button onClick={() => setEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="profile-avatar-large" onClick={() => profile._id === user?.userId && navigate(`/stories/${profile._id}`)} style={profile._id === user?.userId ? { cursor: 'pointer' } : {}}>
              {profile.profilePhoto ? <img src={profile.profilePhoto} alt={profile.username} /> : profile.username?.charAt(0).toUpperCase()}
            </div>
            <h2 className="profile-name">{profile.username}</h2>
            <p className="profile-bio">{profile.bio || 'No bio yet'}</p>
            <div className="profile-stats">
              <div className="profile-stat"><div className="profile-stat-value">{memes.length}</div><div className="profile-stat-label">Posts</div></div>
              <div className="profile-stat"><div className="profile-stat-value">{followersCount}</div><div className="profile-stat-label">Followers</div></div>
              <div className="profile-stat"><div className="profile-stat-value">{followingCount}</div><div className="profile-stat-label">Following</div></div>
            </div>
            {isOwnProfile ? (
              <button onClick={() => setEditing(true)} className="edit-profile-btn">✏️ Edit Profile</button>
            ) : (
              <button onClick={handleFollow} className={`follow-btn ${isFollowing ? 'following' : ''}`}>
                {isFollowing ? '✓ Following' : '+ Follow'}
              </button>
            )}
          </>
        )}
      </div>
      <h3 className="profile-posts-title">{isOwnProfile ? 'My Memes' : `${profile.username}'s Memes`}</h3>
      {memes.length === 0 ? <div className="empty-state"><p>No memes yet</p></div> :
       memes.map(meme => <MemeCard key={meme._id} meme={meme} onLike={handleLike} currentUserId={user?.userId} />)}
    </div>
  );
}

// ==================== AUTH PROVIDER ====================
function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (localStorage.getItem('token')) {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token: newToken, username, userId } = res.data;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify({ username, userId }));
      setToken(newToken);
      setUser({ username, userId });
      window.location.href = '/';
    } catch (err) { throw new Error(err.response?.data?.message || 'Login failed'); }
  };

  const signup = async (username, email, password) => {
    try { await axios.post(`${API_URL}/auth/signup`, { username, email, password }); } 
    catch (err) { throw new Error(err.response?.data?.message || 'Signup failed'); }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }) {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" />;
  return children;
}

// ==================== MAIN APP ====================
function App() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState('post');

  const handlePostClick = () => {
    setUploadType('post');
    setUploadOpen(true);
  };

  const handleStoryClick = () => {
    setUploadType('story');
    setUploadOpen(true);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <div className="content-wrapper">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/stories/:userId" element={<ProtectedRoute><StoryViewer /></ProtectedRoute>} />
              <Route path="/" element={
                <ProtectedRoute>
                  <div className="home-with-stories">
                    <Stories onAddStory={handleStoryClick} />
                    <Home />
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
            <BottomNav onUploadClick={handlePostClick} />
            <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} uploadType={uploadType} />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

