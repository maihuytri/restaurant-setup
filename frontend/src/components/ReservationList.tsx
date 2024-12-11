import React, { useEffect, useState } from 'react';

interface Reservation {
    id: number;
    userId: number;
    tableId: number;
    dateTime: string; // ISO 8601 format
}

const ReservationList = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/reservations')
            .then((response) => response.json())
            .then((data) => setReservations(data))
            .catch((error) => console.error('Error fetching reservations:', error));
    }, []);

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Reservations</h2>
            <ul className="space-y-4">
                {reservations.map((reservation) => (
                    <li key={reservation.id} className="border p-4 rounded shadow-lg">
                        <p>
                            <strong>User ID:</strong> {reservation.userId}
                        </p>
                        <p>
                            <strong>Table ID:</strong> {reservation.tableId}
                        </p>
                        <p>
                            <strong>Date & Time:</strong> {new Date(reservation.dateTime).toLocaleString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReservationList;
