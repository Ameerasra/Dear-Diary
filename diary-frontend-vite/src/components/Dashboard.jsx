import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Navbar from './Navbar';

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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsModalType, setDetailsModalType] = useState('diary');

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
      backgroundColor: '#7c3aed',
      borderColor: '#7c3aed',
    })),
    ...reminders.map((reminder) => ({
      title: reminder.title,
      date: reminder.reminder_at,
      backgroundColor: '#8b5cf6',
      borderColor: '#8b5cf6',
    })),
  ];

  const openDetailsModal = (type) => {
    setDetailsModalType(type);
    setShowDetailsModal(true);
  };

  const renderDetailsContent = () => {
    if (detailsModalType === 'reminder') {
      if (!reminders.length) {
        return <p className="text-sm text-slate-500">No reminders created yet.</p>;
      }

      return (
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">{reminder.title}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${reminder.notified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {reminder.notified ? 'Notified' : 'Pending'}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {new Date(reminder.reminder_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (!diaryEntries.length) {
      return <p className="text-sm text-slate-500">No diary entries created yet.</p>;
    }

    return (
      <div className="space-y-3">
        {diaryEntries.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-900">{entry.entry_date}</p>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{entry.content}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="login-container">
      <div className="login-main dashboard-main">
        <div className="login-card dashboard-card">
         

          <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-500">Welcome back</p>
                <p className="text-xl font-semibold text-purple-950 mt-3">{user?.name || 'Friend'}</p>
                <p className="text-sm text-gray-500 mt-2">Here is your diary calendar and entry overview.</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-500">Diary Calendar</p>
                <div className="mt-4">
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={calendarEvents}
                    dateClick={handleDateClick}
                    height="auto"
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,dayGridWeek',
                    }}
                    dayMaxEvents={2}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <button
                type="button"
                onClick={() => openDetailsModal('diary')}
                className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-gray-500">Diary Entries</p>
                <p className="text-3xl font-bold text-purple-950">{diaryEntries.length}</p>
                <p className="mt-2 text-sm text-purple-700">Click to view saved entries</p>
              </button>
              <button
                type="button"
                onClick={() => openDetailsModal('reminder')}
                className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-gray-500">Reminders</p>
                <p className="text-3xl font-bold text-purple-950">{reminders.length}</p>
                <p className="mt-2 text-sm text-purple-700">Click to view saved reminders</p>
              </button>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="login-heading text-2xl">Create Reminder</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const title = e.target.title.value;
                    const reminderAt = e.target.reminderAt.value;
                    handleCreateReminder(title, reminderAt);
                    e.target.reset();
                  }}
                  className="login-form mt-4"
                >
                  <div className="login-input-group" style={{ '--index': 1 }}>
                    <label className="login-label">Reminder Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="login-input"
                      placeholder="Enter reminder"
                    />
                  </div>
                  <div className="login-input-group" style={{ '--index': 2 }}>
                    <label className="login-label">Date & Time</label>
                    <input
                      type="datetime-local"
                      name="reminderAt"
                      required
                      className="login-input"
                    />
                  </div>
                  <button type="submit" className="login-button">Add Reminder</button>
                </form>
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={() => navigate('/')} className="login-button bg-gray-500 hover:bg-gray-600">Home</button>
                <button onClick={logout} className="login-button">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-purple-900">
                  {detailsModalType === 'reminder' ? 'Reminders' : 'Diary Entries'}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                  {detailsModalType === 'reminder' ? 'Your reminders' : 'Your diary entries'}
                </h3>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-sm font-semibold text-slate-600 hover:text-slate-900">Close</button>
            </div>
            {renderDetailsContent()}
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-purple-900">Diary Entry</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">{isEditing ? 'Edit' : 'New'} entry for {selectedDate}</h3>
              </div>
              <button onClick={() => setShowPopup(false)} className="text-sm font-semibold text-slate-600 hover:text-slate-900">Close</button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="8"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-slate-900 outline-none"
              placeholder="Write your diary entry here..."
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
              {isEditing && (
                <button
                  onClick={handleDeleteEntry}
                  className="rounded-full border border-red-500 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-500/20"
                >
                  Delete Entry
                </button>
              )}
              <button
                onClick={handleSaveEntry}
                className="rounded-full bg-purple-950 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
