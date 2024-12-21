import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Reservation } from "./ReservationList";

export type Status = { name: string };
export const STATUS = [
  { name: "PENDING" },
  { name: "IN_PROGRESS" },
  { name: "RESERVED" },
  { name: "CANCELED" },
];

function EditReservationModal({
  onClose,
  reservation,
}: {
  onClose: () => void;
  reservation: Reservation;
}) {
  const { user } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    setTitle(reservation.title);
    setNote(reservation.note);
    setTime(reservation.time);
    setStatus(reservation.status);
  }, []);

  const editReservation = async (e: FormEvent, id: number) => {
    e.preventDefault();
    try {
      let url = `${process.env.REACT_APP_APIURL}/reservations/${id}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          title,
          note,
          time,
          status,
        }),
      });

      if (response.ok) {
        alert("You have updated your reservation!");
        onClose();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-55">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <form onSubmit={(e) => editReservation(e, reservation.reservationId)}>
            <h2 className="text-2xl font-bold mb-4">
              Reservation ID: #{reservation.reservationId}
            </h2>
            <label className="block mb-2">
              <span className="text-gray-700">Title</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full border p-2 rounded"
              />
            </label>
            <label className="block mb-2">
              <span className="text-gray-700">Note</span>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="block w-full border p-2 rounded"
              />
            </label>
            <label className="block mb-2">
              <span className="text-gray-700">Time</span>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="block w-full border p-2 rounded"
              />
            </label>
            {user?.role === "manager" && (
              <>
                <label className="block mb-2">
                  <span className="text-gray-700">Status</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border p-2 w-full mt-2"
                  >
                    {STATUS.map((s, index) => (
                      <option key={index} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Cancel
            </button>
            &nbsp;
            <button
              //   onClick={(e) => editReservation(e,reservation.reservationId)}
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Reservation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditReservationModal;
