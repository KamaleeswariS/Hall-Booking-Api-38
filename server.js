const express = require('express');
const app = express();
app.use(express.json());

let rooms = [];
let bookings = [];

// 1. Create a Room
app.post('/create-room', (req, res) => {
    const { room_name, seats_available, amenities, price_per_hour } = req.body;
    const newRoom = {
        room_id: rooms.length + 1,
        room_name,
        seats_available,
        amenities,
        price_per_hour,
        booked_status: 'Available'
    };
    rooms.push(newRoom);
    res.status(201).json({ message: "Room created successfully", room: newRoom });
});

// 2. Book a Room
app.post('/book-room', (req, res) => {
    const { customer_name, date, start_time, end_time, room_id } = req.body;
    const room = rooms.find(room => room.room_id == room_id);

    if (!room || room.booked_status === 'Booked') {
        return res.status(400).json({ message: "Room not available" });
    }

    const newBooking = {
        booking_id: bookings.length + 1,
        customer_name,
        room_id,
        date,
        start_time,
        end_time,
        booking_status: "Confirmed"
    };
    bookings.push(newBooking);
    room.booked_status = 'Booked';
    res.status(201).json({ message: "Room booked successfully", booking: newBooking });
});

// 3. List all rooms with booking data
app.get('/list-rooms', (req, res) => {
    res.status(200).json(rooms);
});

// 4. List all customers with booked data
app.get('/list-customers', (req, res) => {
    const customersWithBookings = bookings.map(booking => {
        const room = rooms.find(room => room.room_id == booking.room_id);
        return {
            customer_name: booking.customer_name,
            room_name: room.room_name,
            date: booking.date,
            start_time: booking.start_time,
            end_time: booking.end_time
        };
    });
    res.status(200).json(customersWithBookings);
});

// 5. List how many times a customer has booked a room
app.get('/customer-booking-history', (req, res) => {
    const { customer_name } = req.query;
    const customerBookings = bookings.filter(booking => booking.customer_name === customer_name);
    res.status(200).json(customerBookings);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
