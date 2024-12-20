import Skeleton from "react-loading-skeleton";

const ReservationSkeleton = () => {
  return (
    <div>
      <Skeleton width={"30%"} height={30} className="mb-4 w-2" />
      {[1, 2, 3].map((_, i) => (
        <Skeleton key={i} height={80} className="space-y-4 mb-2"></Skeleton>
      ))}
    </div>
  );
};

export default ReservationSkeleton;
