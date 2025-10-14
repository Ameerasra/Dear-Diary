import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [content, setContent] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchDiaryEntries();
    fetchReminders();
    fetchNotifications();
  }, [user, navigate]);

  const fetchDiaryEntries = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/diary');
      setDiaryEntries(response.data);
    } catch (error) {
      console.error('Error fetching diary entries:', error);
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/reminders');
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleDateClick = async (info) => {
    const date = info.dateStr;
    setSelectedDate(date);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/diary/check?entry_date=${date}`);
      if (response.data.exists) {
        const entryResponse = await axios.get(`http://127.0.0.1:8000/api/diary/show?entry_date=${date}`);
        setContent(entryResponse.data.content);
        setIsEditing(true);
      } else {
        setContent('');
        setIsEditing(false);
      }
      setShowPopup(true);
    } catch (error) {
      console.error('Error checking diary entry:', error);
    }
  };

  const handleSaveEntry = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/diary', {
        entry_date: selectedDate,
        content,
      });
      fetchDiaryEntries();
      setShowPopup(false);
      setContent('');
    } catch (error) {
      console.error('Error saving diary entry:', error);
    }
  };

  const handleDeleteEntry = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/diary?entry_date=${selectedDate}`);
      fetchDiaryEntries();
      setShowPopup(false);
      setContent('');
    } catch (error) {
      console.error('Error deleting diary entry:', error);
    }
  };

  const handleCreateReminder = async (title, reminderAt) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/reminders', {
        title,
        reminder_at: reminderAt,
      });
      fetchReminders();
      fetchNotifications();
    } catch (error) {
      console.error('Error creating reminder:', error);
    }
  };

  const handleMarkNotificationRead = async (notificationId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const calendarEvents = [
    ...diaryEntries.map((entry) => ({
      title: 'Diary Entry',
      date: entry.entry_date,
      backgroundColor: 'blue',
    })),
    ...reminders.map((reminder) => ({
      title: reminder.title,
      date: reminder.reminder_at,
      backgroundColor: 'red',
    })),
  ];

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <button onClick={logout}>Logout</button>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            {notification.message}
            <button onClick={() => handleMarkNotificationRead(notification.id)}>Mark as Read</button>
          </li>
        ))}
      </ul>
      <h3>Calendar</h3>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        dateClick={handleDateClick}
      />
      {showPopup && (
        <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '20px', border: '1px solid black' }}>
          <h3>{isEditing ? 'Edit' : 'Create'} Diary Entry for {selectedDate}</h3>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            cols="30"
          />
          <div>
            <button onClick={handleSaveEntry}>Save</button>
            {isEditing && <button onClick={handleDeleteEntry}>Delete</button>}
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
      <h3>Create Reminder</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.title.value;
          const reminderAt = e.target.reminderAt.value;
          handleCreateReminder(title, reminderAt);
          e.target.reset();
        }}
      >
        <div>
          <label>Title:</label>
          <input type="text" name="title" required />
        </div>
        <div>
          <label>Date and Time:</label>
          <input type="datetime-local" name="reminderAt" required />
        </div>
        <button type="submit">Create Reminder</button>
      </form>
    </div>
  );
};

export default Dashboard;