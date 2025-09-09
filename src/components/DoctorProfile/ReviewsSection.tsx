import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { IReview } from "@/models";
import { Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function ReviewsSection({ doctorId }: { doctorId: string }) {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  console.log("reviews", reviews);
  const getVetReviews = async (pageNum: number, pageLimit: number) => {
    if (!doctorId) {
      toast.error("Doctor data not found.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `/api/veterinarian/reviews/${doctorId}?page=${pageNum}&limit=${pageLimit}`
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch reviews");
      }
      const data = await res.json();
      setReviews(data?.data?.reviews || []);
      setTotal(data?.data?.pagination?.total || 0);
      setPages(data?.data?.pagination?.pages || 0);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      getVetReviews(page, limit);
    }
  }, [doctorId, page, limit]);

  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    for (let i = 1; i <= pages; i++) nums.push(i);
    return nums;
  }, [pages]);

  reviews.length > 0 ? (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-600" />
          Patient Reviews ({total})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading && (
            <div className="text-sm text-gray-500">Loading reviews...</div>
          )}

          {!loading && reviews.length === 0 && (
            <div className="text-sm text-gray-500">No reviews yet.</div>
          )}

          {reviews.map((review: any) => (
            <div
              key={review._id}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={review?.parentId?.profileImage || ""} />
                    <AvatarFallback>
                      {(review?.parentId?.name || "U")
                        .split(" ")
                        .map((n: string) => n.charAt(0))
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review?.parentId?.name || "Anonymous"}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {/* {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (review.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))} */}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}

          {pages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-gray-500">
                Page {page} of {pages}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                    />
                  </PaginationItem>
                  {pageNumbers.map((n) => (
                    <PaginationItem key={n}>
                      <PaginationLink
                        href="#"
                        isActive={n === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(n);
                        }}
                      >
                        {n}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < pages) setPage(page + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  ) : loading ? (
    <>
      {loading && (
        <div className="text-sm text-gray-500">Loading reviews...</div>
      )}
    </>
  ) : (
    <div className="text-sm text-gray-500">No reviews yet.</div>
  );
}
