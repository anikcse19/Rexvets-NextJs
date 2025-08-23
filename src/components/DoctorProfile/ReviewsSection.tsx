import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReviewsSection({
  doctor,
  showAll,
  setShowAll,
}: {
  doctor: any;
  showAll: boolean;
  setShowAll: (val: boolean) => void;
}) {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-600" />
          Patient Reviews ({doctor.totalReviews})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(showAll ? doctor.reviews : doctor.reviews.slice(0, 4)).map(
            (review: any) => (
              <div
                key={review.id}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.patientName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Pet: {review.petName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            )
          )}

          {doctor.reviews.length > 4 && (
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" /> Show Less Reviews
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" /> View All{" "}
                  {doctor.reviews.length} Reviews
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
