import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Custom warm colors for Hayat Foods
        terracotta: "#CD853F",
        cream: "#FFFDD0",
        brown: "#8B4513",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.9)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "slide-in": {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0"
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1"
          }
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0)"
          },
          "50%": {
            transform: "translateY(-10px)"
          }
        },
        "text-reveal": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px) rotateX(90deg)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) rotateX(0deg)"
          }
        },
        "typewriter": {
          "0%": {
            width: "0"
          },
          "100%": {
            width: "100%"
          }
        },
        "blink": {
          "0%, 50%": {
            borderColor: "transparent"
          },
          "51%, 100%": {
            borderColor: "currentColor"
          }
        },
        "ar-vr-rotate": {
          "0%": {
            transform: "rotateX(0deg) rotateY(0deg)"
          },
          "25%": {
            transform: "rotateX(90deg) rotateY(90deg)"
          },
          "50%": {
            transform: "rotateX(180deg) rotateY(180deg)"
          },
          "75%": {
            transform: "rotateX(270deg) rotateY(270deg)"
          },
          "100%": {
            transform: "rotateX(360deg) rotateY(360deg)"
          }
        },
        "collaborative-pulse": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "1"
          },
          "50%": {
            transform: "scale(1.05)",
            opacity: "0.8"
          }
        },
        "3d-flip": {
          "0%": {
            transform: "perspective(1000px) rotateY(0deg)"
          },
          "100%": {
            transform: "perspective(1000px) rotateY(180deg)"
          }
        },
        "morph-blob": {
          "0%, 100%": {
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%"
          },
          "25%": {
            borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%"
          },
          "50%": {
            borderRadius: "50% 40% 50% 60% / 30% 50% 70% 40%"
          },
          "75%": {
            borderRadius: "40% 50% 60% 30% / 70% 40% 50% 60%"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s ease-out",
        "accordion-up": "accordion-up 0.3s ease-out",
        "fade-in": "fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scale-in 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in": "slide-in 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "float": "float 3s ease-in-out infinite",
        "text-reveal": "text-reveal 1s cubic-bezier(0.4, 0, 0.2, 1)",
        "typewriter": "typewriter 2s steps(40, end)",
        "blink": "blink 1s infinite",
        "ar-vr-rotate": "ar-vr-rotate 8s ease-in-out infinite",
        "collaborative-pulse": "collaborative-pulse 2s ease-in-out infinite",
        "3d-flip": "3d-flip 1s cubic-bezier(0.4, 0, 0.2, 1)",
        "morph-blob": "morph-blob 8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
