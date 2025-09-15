export default function SidebarMenuSkeleton({ count = 12 }) {
  return (
    <div className="space-y-2 px-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="h-4 bg-blue-200/20 rounded-md animate-pulse"
          style={{ width: "100%", height: "3rem" }}
        />
      ))}
    </div>
  );
}
