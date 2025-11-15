import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Star, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  review: string;
  timestamp: string;
  verified?: boolean;
}

const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  rating: z.number().min(1, "Please select a rating").max(5, "Rating must be between 1 and 5"),
  review: z.string().min(10, "Review must be at least 10 characters"),
});

type ReviewForm = z.infer<typeof reviewSchema>;

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();

  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3 });
  const { elementRef: formRef, isVisible: formVisible } = useScrollAnimation({ threshold: 0.2 });
  const { elementRef: reviewsRef, isVisible: reviewsVisible } = useScrollAnimation({ threshold: 0.2 });

  const form = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: "",
      email: "",
      rating: 0,
      review: "",
    },
  });

  useEffect(() => {
    // Load reviews from API
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
          const reviewsData = await response.json();
          setReviews(reviewsData);
        } else {
          console.error('Failed to fetch reviews:', response.status, response.statusText);
          // Fallback to localStorage if API fails
          const savedReviews = localStorage.getItem('customerReviews');
          if (savedReviews) {
            try {
              const parsedReviews = JSON.parse(savedReviews);
              setReviews(parsedReviews);
              console.log('Loaded reviews from localStorage fallback');
            } catch (parseError) {
              console.error('Error parsing localStorage reviews:', parseError);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Fallback to localStorage if API fails
        const savedReviews = localStorage.getItem('customerReviews');
        if (savedReviews) {
          try {
            const parsedReviews = JSON.parse(savedReviews);
            setReviews(parsedReviews);
            console.log('Loaded reviews from localStorage fallback');
          } catch (parseError) {
            console.error('Error parsing localStorage reviews:', parseError);
          }
        }
      }
    };

    fetchReviews();
  }, []);

  const onSubmit = async (data: ReviewForm) => {
    setIsSubmitting(true);
    try {
      // Submit to API
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const result = await response.json();

      // Add the new review to the local state
      const newReview: Review = {
        id: result.review.id,
        name: result.review.name,
        email: result.review.email,
        rating: result.review.rating,
        review: result.review.review,
        timestamp: result.review.timestamp,
        verified: result.review.verified,
      };

      setReviews(prevReviews => [newReview, ...prevReviews]);

      toast({
        title: "Review submitted successfully!",
        description: "Thank you for your feedback. Your review is now visible to all visitors.",
      });

      form.reset();
    } catch (error) {
      console.error("Review submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type={interactive ? "button" : "button"}
            disabled={!interactive}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
            className={`transition-colors duration-200 ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
            whileHover={interactive ? { scale: 1.1 } : {}}
            whileTap={interactive ? { scale: 0.95 } : {}}
          >
            <Star
              className={`w-5 h-5 ${
                star <= (interactive ? hoveredRating || form.watch('rating') : rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              } transition-colors duration-200`}
            />
          </motion.button>
        ))}
      </div>
    );
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const reviewVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  };

  return (
    <div className="min-h-screen bg-cream/30">
      <SEO
        title="Customer Reviews - Hayat Foods | Share Your Experience"
        description="Read customer reviews and share your experience with Hayat Foods premium bakery products. Rate our chapati, buns, bread, and rusk from Kannur, Kerala."
        keywords="hayat foods reviews, customer reviews, hayat foods ratings, hayat foods feedback, hayat foods testimonials"
        url="https://vyshnav17.github.io/hayat-foodies-landing/reviews"
      />
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            ref={titleRef}
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-brown mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={titleVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Customer Reviews
            </motion.h1>
            <motion.p
              className="text-lg text-brown/80 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Share your experience with Hayat Foods and read what our customers have to say
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Review Form */}
            <motion.div
              ref={formRef}
              variants={formVariants}
              initial="hidden"
              animate={formVisible ? "visible" : "hidden"}
            >
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <motion.div whileFocus={{ scale: 1.02 }}>
                                <Input placeholder="Enter your full name" {...field} />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <motion.div whileFocus={{ scale: 1.02 }}>
                                <Input type="email" placeholder="your.email@example.com" {...field} />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rating</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                {renderStars(field.value, true, (rating) => field.onChange(rating))}
                                <p className="text-sm text-muted-foreground">
                                  {field.value > 0 ? `${field.value} star${field.value > 1 ? 's' : ''}` : 'Click to rate'}
                                </p>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="review"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Review</FormLabel>
                            <FormControl>
                              <motion.div whileFocus={{ scale: 1.02 }}>
                                <Textarea
                                  placeholder="Tell us about your experience with Hayat Foods..."
                                  className="min-h-[120px] resize-none"
                                  {...field}
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full font-semibold text-lg px-8 py-6 rounded-full transition-transform duration-300"
                        >
                          {isSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              Submitting...
                            </motion.div>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Submit Review
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reviews Display */}
            <motion.div
              ref={reviewsRef}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={reviewsVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-brown mb-6">What Our Customers Say</h2>

              {reviews.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      custom={index}
                      variants={reviewVariants}
                      initial="hidden"
                      animate={reviewsVisible ? "visible" : "hidden"}
                    >
                      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-brown">{review.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(review.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {renderStars(review.rating)}
                              <span className="text-sm font-medium">{review.rating}/5</span>
                            </div>
                          </div>
                          <p className="text-brown/80 leading-relaxed">{review.review}</p>
                          {review.verified && (
                            <div className="mt-3 flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 font-medium">Verified Purchase</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Reviews;
