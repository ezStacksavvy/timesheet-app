import React, { useState, useEffect } from 'react';
import './App.css';
import { FiClock, FiCalendar, FiPlusCircle, FiPlay, FiPause, FiTrash2 } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (isBreakActive) {
      interval = setInterval(() => {
        setBreakTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreakActive]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleBreak = () => {
    setIsBreakActive(!isBreakActive);
    if (!isBreakActive) {
      setBreakTimer(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Simulating API call
      const newTimesheet = {
        ...formData,
        id: Date.now(),
        createdBy: 'ezStacksavvy'
      };
      setTimesheets([newTimesheet, ...timesheets]);
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

  const handleDelete = (id) => {
    setTimesheets(timesheets.filter(entry => entry.id !== id));
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="row g-4">
        {/* Current Time Card */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <FiClock className="text-primary fs-3 me-2" />
                <h3 className="card-title mb-0 h4">Current Time (UTC)</h3>
              </div>
              <p className="text-center display-6 mb-0">
                {currentDateTime.toISOString().slice(0, 19).replace('T', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Break Timer Card */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <FiClock className="text-primary fs-3 me-2" />
                <h3 className="card-title mb-0 h4">Break Timer</h3>
              </div>
              <div className="text-center">
                <div className="display-6 mb-3">{formatTime(breakTimer)}</div>
                <button 
                  className={`btn ${isBreakActive ? 'btn-danger' : 'btn-primary'} btn-lg`}
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
        </div>

        {/* Add Entry Form */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <FiPlusCircle className="text-primary fs-3 me-2" />
                <h3 className="card-title mb-0 h4">Add Entry</h3>
              </div>
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
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
                      <label htmlFor="date">Date</label>
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
                      <label htmlFor="clockIn">Clock In</label>
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
                        <option value="">Select project</option>
                        <option value="Development">Development</option>
                        <option value="Design">Design</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Research">Research</option>
                      </select>
                      <label htmlFor="project">Project</label>
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
                  <div className="col-12">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Entry'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Timesheet Entries */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <FiCalendar className="text-primary fs-3 me-2" />
                <h3 className="card-title mb-0 h4">Recent Entries</h3>
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
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
                      <tr key={entry.id}>
                        <td>{entry.date}</td>
                        <td>{entry.clockIn}</td>
                        <td>{entry.clockOut || '-'}</td>
                        <td>{entry.project || '-'}</td>
                        <td>{entry.notes || '-'}</td>
                        <td>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {timesheets.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          No entries yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;