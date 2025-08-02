import React, { useState, useEffect } from 'react';
import './App.css';
import { FiClock, FiCalendar, FiBarChart2, FiPlusCircle, FiPlay, FiPause, FiTrash2 } from 'react-icons/fi';
import ConfirmDialog from './components/ConfirmDialog';
import { API_BASE_URL } from './config';

function App() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakTimer, setBreakTimer] = useState(0);
  const [timesheets, setTimesheets] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    clockIn: '',
    clockOut: '',
    project: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format current date and time in UTC
  const formatCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').slice(0, 19);
  };

  // Break timer functionality
  useEffect(() => {
    let interval;
    if (isBreakActive) {
      interval = setInterval(() => {
        setBreakTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreakActive]);

  // Format time for break timer display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleBreak = () => {
    setIsBreakActive(!isBreakActive);
    if (!isBreakActive) {
      setBreakTimer(0);
    }
  };

  // Fetch timesheets
  const fetchTimesheets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/timesheets`);
      if (!response.ok) throw new Error('Failed to fetch timesheets');
      const data = await response.json();
      setTimesheets(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching timesheets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/timesheets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdBy: 'ezStacksavvy' // Current user's login
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save timesheet');
      }

      const savedTimesheet = await response.json();
      setTimesheets([savedTimesheet, ...timesheets]);
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        clockIn: '',
        clockOut: '',
        project: '',
        notes: ''
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirmDialog(true);
  };

  // Handle actual deletion
  const confirmDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/timesheets/${deleteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete timesheet');
      setTimesheets(timesheets.filter(entry => entry._id !== deleteId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="container py-4">
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <div className="current-time-card mb-4">
        <h2 className="text-center fs-4 mb-0">
          {formatCurrentDateTime()} UTC
        </h2>
        <p className="text-center text-muted mb-0">
          Logged in as: ezStacksavvy
        </p>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <FiClock className="text-primary fs-4 me-2" />
            <h3 className="card-title mb-0">Break Timer</h3>
          </div>
          <div className="text-center">
            <p className="text-muted">
              {isBreakActive ? 'Break in progress' : 'Ready to start break'}
            </p>
            {breakTimer > 0 && (
              <div className="timer-display mb-3">{formatTime(breakTimer)}</div>
            )}
            <button 
              className={`btn ${isBreakActive ? 'btn-danger' : 'btn-primary'} d-flex align-items-center mx-auto`}
              onClick={toggleBreak}
            >
              {isBreakActive ? (
                <>
                  <FiPause className="me-2" /> End Break
                </>
              ) : (
                <>
                  <FiPlay className="me-2" /> Start Break
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <FiPlusCircle className="text-primary fs-4 me-2" />
            <h3 className="card-title mb-0">Add Work Entry</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-md-6 col-lg-3">
                <div className="form-floating">
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                  <label htmlFor="date">Date*</label>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="form-floating">
                  <input
                    type="time"
                    className="form-control"
                    id="clockIn"
                    value={formData.clockIn}
                    onChange={(e) => setFormData({...formData, clockIn: e.target.value})}
                    required
                  />
                  <label htmlFor="clockIn">Clock In*</label>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="form-floating">
                  <input
                    type="time"
                    className="form-control"
                    id="clockOut"
                    value={formData.clockOut}
                    onChange={(e) => setFormData({...formData, clockOut: e.target.value})}
                  />
                  <label htmlFor="clockOut">Clock Out</label>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="form-floating">
                  <select 
                    className="form-select"
                    id="project"
                    value={formData.project}
                    onChange={(e) => setFormData({...formData, project: e.target.value})}
                  >
                    <option value="">Select project/task</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Research">Research</option>
                  </select>
                  <label htmlFor="project">Project/Task</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-floating">
                  <textarea
                    className="form-control"
                    id="notes"
                    style={{ height: '100px' }}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  ></textarea>
                  <label htmlFor="notes">Notes</label>
                </div>
              </div>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary d-flex align-items-center"
              disabled={loading}
            >
              <FiPlusCircle className="me-2" />
              {loading ? 'Saving...' : 'Add Work Entry'}
            </button>
          </form>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <FiCalendar className="text-primary fs-4 me-2" />
            <h3 className="card-title mb-0">Recent Entries</h3>
          </div>
          <div className="table-responsive">
            {loading ? (
              <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Project</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timesheets.map((entry) => (
                    <tr key={entry._id}>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td>{entry.clockIn}</td>
                      <td>{entry.clockOut || '-'}</td>
                      <td>{entry.project || '-'}</td>
                      <td>{entry.notes || '-'}</td>
                      <td>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(entry._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Entry"
        message="Are you sure you want to delete this timesheet entry? This action cannot be undone."
      />
    </div>
  );
}

export default App;