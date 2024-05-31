import React from 'react';

function RoomList({ data }) {
  const { rooms, notAvailableRooms } = data;

  // Map unavailable room IDs for quick lookup
  const unavailableRoomMap = notAvailableRooms.reduce((acc, room) => {
    acc[room._id] = acc[room._id] || [];
    acc[room._id].push(room);
    return acc;
  }, {});

  return (
    <div>
      <h1>Room Availability</h1>
      {rooms.map(room => (
        <div key={room._id}>
          <p>Room Number: {room.roomNumber}</p>
          <p>Filled Status: {room.filledStatus}</p>
          {unavailableRoomMap[room._id] ? (
            <p>Not Available:
              {unavailableRoomMap[room._id].map((unavail, index) => (
                <span key={index}>
                  (except {unavail.startTime} - {unavail.endTime})
                </span>
              ))}
            </p>
          ) : (
            <p>Available</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default RoomList;
