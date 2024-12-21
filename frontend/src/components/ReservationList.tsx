import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ReservationSkeleton from "../skeletons/ReservationSkeleton";
import { extractUserIdFromToken } from "../utils";
import EditReservationModal from "./EditReservationModal";

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

export interface Reservation {
  reservationId: number;
  title: string;
  note: string;
  date: Date;
  time: string;
  status: string;
  bookingTableResponse: TableResponse;
  userResponse: UserResponse;
}

const ReservationList = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { user } = useAuth();


  const cancelModal = (): void => {
    setShowEditModal(false);
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      if (user?.token) {
        let userId = extractUserIdFromToken(user?.token);

        let url =
          user?.role === "manager"
            ? `${process.env.REACT_APP_APIURL}/reservations/list`
            : `${process.env.REACT_APP_APIURL}/reservations/list/${userId}`;
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

  useEffect(() => {
    fetchReservations();
  }, [user?.token]);

  useEffect(() => {
    if (!showEditModal) {
      fetchReservations();
    }
  }, [showEditModal]);

  const handleCancelReservation = async (id: number) => {
    try {
      let url = `${process.env.REACT_APP_APIURL}/reservations/cancel-reservation/${id}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.ok) {
        alert("Your reservation is Canceled!");
        fetchReservations();
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
              reservations
                .filter((r) => r.status !== "CANCELED")
                .map((reservation: Reservation) => (
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
                        <strong>Reservation Time:</strong> {reservation.time}
                      </p>
                      {user?.role === "manager" && (
                        <p>
                          <strong>Created Date & Time:</strong>{" "}
                          {new Date(reservation.date).toLocaleDateString()}-
                          {new Date(reservation.date).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowEditModal(!showEditModal)}
                        className="bg-blue-500 hover:bg-blue-600 text-white h-10 w-20 rounded-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleCancelReservation(reservation.reservationId)
                        }
                        className="bg-red-500 hover:bg-red-600 p-2 text-white h-10 rounded-sm"
                      >
                        Cancel Reservation
                      </button>
                    </div>
                    {showEditModal && (
                      <EditReservationModal
                        onClose={cancelModal}
                        reservation={reservation}
                      />
                    )}
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
