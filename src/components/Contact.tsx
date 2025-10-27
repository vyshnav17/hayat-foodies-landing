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

      // Option 4: Send to Vercel serverless function (if you have one)
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submissionWithTimestamp)
      // });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

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

  return (
    <section id="contact" className="py-16 md:py-20 bg-primary text-primary-foreground">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
              Get in Touch
            </h2>
            <p className="text-base md:text-lg opacity-90 animate-fade-in">
              Have questions or want to know more about our products? We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
                <div className="animate-scale-in">
                  <div className="inline-flex items-center justify-center w-12 md:w-14 h-12 md:h-14 rounded-full bg-primary-foreground/10 mb-4">
                    <Phone className="w-5 md:w-6 h-5 md:h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="opacity-90 text-sm md:text-base">Contact us for inquiries</p>
                  <div className="opacity-90 text-sm md:text-base space-y-1">
                    {isMobile ? (
                      <>
                        <a href="tel:+919988636383" className="hover:underline">+91 9988636383</a><br></br>
                        <a href="tel:+918592056057" className="hover:underline">+91 8592056057</a><br></br>
                        <a href="tel:+918111928999" className="hover:underline">+91 81119 28999</a>
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

                <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-foreground/10 mb-4">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="opacity-90">hayatfoodsindia<br></br>@info.com</p>
                </div>

                <div className="col-span-2 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-foreground/10 mb-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="opacity-90">Kannur, Kerala, India</p>
                </div>
              </div>



              <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="font-semibold text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform duration-300"
                >
                  <a
                    href="https://wa.me/918111928999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <img
                      src={whatsAppLogo}
                      alt="WhatsApp"
                      className="w-6 h-6"
                    />
                    Contact Us Today
                  </a>
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-primary-foreground/5 rounded-lg p-6 md:p-8 backdrop-blur-sm">
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">Send us a Message</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your inquiry..."
                              className="min-h-[100px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full font-semibold text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform duration-300"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
