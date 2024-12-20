import Skeleton from "react-loading-skeleton";

const TableSkeleton = () => {
  return (
    <div>
      <Skeleton width={"20%"} height={30} className="mb-4 w-2" />
      {[1, 2, 3].map(() => (
        <Skeleton height={80} className="space-y-4 mb-2"></Skeleton>
      ))}
    </div>
  );
};

export default TableSkeleton;
