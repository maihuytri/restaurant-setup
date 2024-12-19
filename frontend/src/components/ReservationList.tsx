import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface TableResponse {
  id: number;
  name: string;
  capacity: number;
  status: string;
}

interface UserResponse {
  id: number;
  username: string;
}

interface Reservation {
  id: number;
  title: string;
  note: string;
  date: Date;
  time: String;
  bookingTableResponse: TableResponse;
  userResponse: UserResponse;
}

const ReservationList = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [userId] = useState<number>(5);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (user?.token) {
          let url =
            user?.role === "manager"
              ? `http://localhost:8080/reservations/list`
              : `http://localhost:8080/reservations/list/${userId}`;
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          });
          const data: Reservation[] = await response.json();
          setReservations(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchReservations();
  }, [user?.token]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Reservations</h2>
      <ul className="space-y-4">
        {reservations.map((reservation) => (
          <li
            key={reservation.id}
            className="border p-4 rounded shadow-lg flex justify-between items-center"
          >
            <div>
              <p>
                <strong>User Name:</strong> {reservation.userResponse.username}
              </p>
              <p>
                <strong>Table ID:</strong>{" "}
                {reservation.bookingTableResponse.name}
              </p>
              <p>
                <strong>Date & Time:</strong>{" "}
                {new Date(reservation.date).toLocaleString()}
              </p>
            </div>
            <button className="bg-red-500 hover:bg-red-600 p-2 text-white h-10 rounded-sm">
              Cancel Reservation
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationList;
