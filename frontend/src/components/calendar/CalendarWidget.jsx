import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

// Vite-safe modern imports for date-fns
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale'; 

import { useTasks } from '../../context/TaskContext';

// CSS imports
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './Calendar.css';
import '../dashboard/Modal.css'; 

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const dragAndDropFn = typeof withDragAndDrop === 'function' ? withDragAndDrop : withDragAndDrop.default;
const DragAndDropCalendar = dragAndDropFn(Calendar);

const CustomToolbar = (toolbar) => {
  const goToView = (view) => {
    toolbar.onView(view);
  };

  return (
    <div className="rbc-toolbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '2px solid #F0F0F0', marginBottom: '15px' }}>
      <span className="rbc-toolbar-label" style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1A1A1A', textAlign: 'left' }}>
        {toolbar.label}
      </span>
      
      <span className="rbc-btn-group">
        <button className={toolbar.view === 'month' ? 'rbc-active' : ''} onClick={() => goToView('month')}>Month</button>
        <button className={toolbar.view === 'week' ? 'rbc-active' : ''} onClick={() => goToView('week')}>Week</button>
        <button className={toolbar.view === 'day' ? 'rbc-active' : ''} onClick={() => goToView('day')}>Day</button>
      </span>
    </div>
  );
};

function CalendarWidget() {
  const { tasks, updateTaskDate, updateTaskStatus } = useTasks();
  const [currentView, setCurrentView] = useState('month');
  

  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = tasks
    .filter(task => task.dueDate) 
    .map(task => ({
      ...task, 
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true 
    }));

  const onEventDrop = ({ event, start }) => {
    updateTaskDate(event.id, start);
  };


  const onSelectEvent = (event) => {
    setSelectedEvent(event);
  };


  const handleMarkDone = () => {
    if (selectedEvent) {
      updateTaskStatus(selectedEvent.id, 'completed');
      setSelectedEvent(null); 
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#4CAF50'; 
    if (event.type === 'exam') backgroundColor = '#FF5252'; 
    if (event.type === 'lecture') backgroundColor = '#2196F3'; 

    const isCompleted = event.status === 'completed';

    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: isCompleted ? 0.5 : 0.9, 
        textDecoration: isCompleted ? 'line-through' : 'none', 
        color: 'white',
        border: 'none',
        display: 'block',
        fontSize: '0.8rem',
        fontWeight: '600',
        padding: '2px 5px'
      }
    };
  };

  return (
    <div className="widget-card flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="widget-header">
        <h3>Visualizing your academic success</h3>
      </div>
      
      <div className="calendar-container">
        <DragAndDropCalendar
          localizer={localizer}
          events={events}
          onEventDrop={onEventDrop}
          onSelectEvent={onSelectEvent} 
          resizable={false}
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          view={currentView}
          onView={setCurrentView}
          views={['month', 'week', 'day']}
          components={{
            toolbar: CustomToolbar
          }}
        />
      </div>

      <div className="calendar-legend">
        <span className="legend-item"><div className="color-box blue"></div> Lectures</span>
        <span className="legend-item"><div className="color-box red"></div> Exams</span>
        <span className="legend-item"><div className="color-box green"></div> Personal Study</span>
      </div>

      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: '380px' }}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>&times;</button>
            
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div className={`color-box ${selectedEvent.type === 'exam' ? 'red' : selectedEvent.type === 'lecture' ? 'blue' : 'green'}`}></div>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#888' }}>
                  {selectedEvent.type}
                </span>
              </div>
              <h2 style={{ fontSize: '1.4rem', margin: '0' }}>{selectedEvent.title}</h2>
            </div>

            <div style={{ marginBottom: '25px', color: '#636E72', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <p style={{ margin: '8px 0' }}><strong>📅 Date:</strong> {new Date(selectedEvent.start).toLocaleDateString()}</p>
              <p style={{ margin: '8px 0' }}><strong>📝 Details:</strong> {selectedEvent.description}</p>
              <p style={{ margin: '8px 0' }}><strong>📌 Status:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedEvent.status}</span></p>
            </div>

            {selectedEvent.status !== 'completed' ? (
              <button className="btn-primary" onClick={handleMarkDone} style={{ backgroundColor: '#4CAF50' }}>
                Mark Done
              </button>
            ) : (
              <div style={{ textAlign: 'center', padding: '12px', background: '#E8F5E9', color: '#2E7D32', borderRadius: '12px', fontWeight: '700' }}>
                ✅ Task is Completed
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarWidget;