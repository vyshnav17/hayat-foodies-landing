import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import whatsAppLogo from "@/assets/WhatsApp.png";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3 });
  const { elementRef: contactInfoRef, isVisible: contactInfoVisible } = useScrollAnimation({ threshold: 0.2 });
  const { elementRef: formRef, isVisible: formVisible } = useScrollAnimation({ threshold: 0.2 });

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      // Log the submitted data to console (for development)
      console.log("Contact Form Submission:", data);

      // Store in localStorage for persistence (works on Vercel)
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      const submissionWithTimestamp = {
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      submissions.push(submissionWithTimestamp);
      localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

      // Option 1: Send to a backend API (replace with your actual API endpoint)
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      // Option 2: Send email using EmailJS (install emailjs-com first)
      // await emailjs.send('your_service_id', 'your_template_id', data, 'your_user_id');

      // Option 3: Send to Google Forms or other form services
      // const formData = new FormData();
      // Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      // await fetch('your-form-endpoint', { method: 'POST', body: formData });

      // Send to Vercel serverless function
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you soon.",
      });

      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfoVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };



  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <section id="contact" className="py-16 md:py-20 bg-primary text-primary-foreground">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            ref={titleRef}
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={titleVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Get in Touch
            </motion.h2>
            <motion.p
              className="text-base md:text-lg opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Have questions or want to know more about our products? We'd love to hear from you!
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Info */}
            <motion.div
              ref={contactInfoRef}
              className="space-y-6"
              variants={contactInfoVariants}
              initial="hidden"
              animate={contactInfoVisible ? "visible" : "hidden"}
            >
              <motion.div
                className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6"
                variants={contactInfoVariants}
              >
                <div>
                  <div className="inline-flex items-center justify-center w-12 md:w-14 h-12 md:h-14 rounded-full bg-primary-foreground/10 mb-4">
                    <Phone className="w-5 md:w-6 h-5 md:h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="opacity-90 text-sm md:text-base">Contact us for inquiries</p>
                  <div className="opacity-90 text-sm md:text-base space-y-1">
                    {isMobile ? (
                      <>
                        <a href="tel:+919988636383" className="hover:underline">
                          +91 9988636383
                        </a><br></br>
                        <a href="tel:+918592056057" className="hover:underline">
                          +91 8592056057
                        </a><br></br>
                        <a href="tel:+918111928999" className="hover:underline">
                          +91 81119 28999
                        </a>
                      </>
                    ) : (
                      <>
                        <p>+91 9988636383</p><br></br>
                        <p>+91 8592056057</p><br></br>
                        <p>+91 81119 28999</p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-foreground/10 mb-4">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="opacity-90">hayatfoodsindia<br></br>@info.com</p>
                </div>

                <div className="col-span-2">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-foreground/10 mb-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="opacity-90">Kannur, Kerala, India</p>
                </div>
              </motion.div>

              <motion.div
                variants={contactItemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="font-semibold text-lg px-8 py-6 rounded-full transition-transform duration-300"
                >
                  <motion.a
                    href="https://wa.me/918111928999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.img
                      src={whatsAppLogo}
                      alt="WhatsApp"
                      className="w-6 h-6"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    Contact Us Today
                  </motion.a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              ref={formRef}
              variants={formVariants}
              initial="hidden"
              animate={formVisible ? "visible" : "hidden"}
            >
              <motion.div
                className="bg-primary-foreground/5 rounded-lg p-6 md:p-8 backdrop-blur-sm"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.h3
                  className="text-xl md:text-2xl font-bold mb-6 text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={formVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                  transition={{ delay: 0.2 }}
                >
                  Send us a Message
                </motion.h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={formVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                      transition={{ delay: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <motion.div whileFocus={{ scale: 1.02 }}>
                                <Input placeholder="Your full name" {...field} />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={formVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                      transition={{ delay: 0.4 }}
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <motion.div whileFocus={{ scale: 1.02 }}>
                                <Input type="email" placeholder="your.email@example.com" {...field} />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={formVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                      transition={{ delay: 0.5 }}
                    >
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <motion.div whileFocus={{ scale: 1.02 }}>
                                <Input placeholder="Your phone number" {...field} />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={formVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                      transition={{ delay: 0.6 }}
                    >
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <motion.div whileFocus={{ scale: 1.02 }}>
                                <Textarea
                                  placeholder="Tell us about your inquiry..."
                                  className="min-h-[100px] resize-none"
                                  {...field}
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={formVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full font-semibold text-lg px-8 py-6 rounded-full transition-transform duration-300"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            Sending...
                          </motion.div>
                        ) : (
                          <>
                            <motion.div
                              whileHover={{ rotate: 15, scale: 1.2 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Send className="w-5 h-5 mr-2" />
                            </motion.div>
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
