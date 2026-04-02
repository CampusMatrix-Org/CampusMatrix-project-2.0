import React from 'react';

function TodaySchedule() {
  const schedule = [
    { time: '08:00', title: 'UI/UX Design Principles', location: 'Design Studio', color: '#FF7043' },
    { time: '09:30', title: 'Advanced Java & OOP', location: 'Lab 1', color: '#0984E3' },
    { time: '11:00', title: 'Human-Computer Interaction', location: 'Room 402', color: '#00B894' },
    { time: '12:30', title: 'Lunch Break', location: 'Cafeteria', color: '#A0A0A0' },
    { time: '13:30', title: 'Macroeconomics', location: 'Lecture Hall A', color: '#FDCB6E' },
    { time: '15:00', title: 'Statistics & Probability', location: 'Hall B', color: '#6C5CE7' },
    { time: '16:30', title: 'Database Systems (MongoDB)', location: 'Lab 3', color: '#E17055' },
    { time: '18:00', title: 'CampusMatrix Frontend Sync', location: 'Online Meet', color: '#FF7043' },
    { time: '19:30', title: 'VotingApp API Contract Review', location: 'Library', color: '#00B894' },
    { time: '21:00', title: 'Graphic Design Portfolio Work', location: 'Home', color: '#0984E3' },
  ];

  return (
    <div className="widget-card flex-col">
      <div className="widget-header">
        <h3>Today's Schedule</h3>
        <a href="#see-full">See Full</a>
      </div>
      <div className="widget-scroll-area">
        <div className="timeline">
          {schedule.map((item, index) => (
            <div className="timeline-item" key={index}>
              <div className="time">{item.time}</div>
              <div className="timeline-card" style={{ borderLeftColor: item.color }}>
                <h4>{item.title}</h4>
                <p>{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TodaySchedule;