import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ReservationSkeleton from "../skeletons/ReservationSkeleton";
import { extractUserIdFromToken } from "../utils";

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
  reservationId: number;
  title: string;
  note: string;
  date: Date;
  time: String;
  bookingTableResponse: TableResponse;
  userResponse: UserResponse;
}

const ReservationList = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        if (user?.token) {
          let userId = extractUserIdFromToken(user?.token);

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
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [user?.token]);

  const handleCancelReservation = async (id: number) => {
    try {
      let url = `http://localhost:8080/reservations/cancel-reservation/${id}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.ok) {
        alert("Your reservation is Canceled!");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="mt-8">
      {loading ? (
        <ReservationSkeleton />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Reservations</h2>
          <ul className="space-y-4">
            {reservations.length > 0 && !loading ? (
              reservations.map((reservation: Reservation) => (
                <li
                  key={reservation.reservationId}
                  className="border p-4 rounded shadow-lg flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>User Name:</strong>{" "}
                      {reservation.userResponse.username}
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
                  <button
                    onClick={() =>
                      handleCancelReservation(reservation.reservationId)
                    }
                    className="bg-red-500 hover:bg-red-600 p-2 text-white h-10 rounded-sm"
                  >
                    Cancel Reservation
                  </button>
                </li>
              ))
            ) : (
              <p className="font-medium text-gray-500 text-md">
                There's no reservations here..Reserve a table!
              </p>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default ReservationList;
