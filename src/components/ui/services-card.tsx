"use client";

import * as React from "react";
import { motion } from "motion/react";
import { ArrowRight, Settings, Layers, Crosshair, Zap, Wrench, Briefcase, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

// Shadcn UI Carousel Imports
import useEmblaCarousel, {
  type EmblaCarouselType,
} from "embla-carousel-react";
import { Button } from "@/components/ui/button";

// --- Carousel Context ---
type CarouselApi = EmblaCarouselType | undefined;
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

// --- Main Carousel Component ---
const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);
      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

// --- Carousel Content ---
const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

// --- Carousel Item ---
const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

// --- Carousel Controls ---
const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-12 w-12 rounded-full",
        "right-4 top-1/2 -translate-y-1/2 z-20",
        className,
      )}
      onClick={scrollNext}
      disabled={!canScrollNext}
      {...props}
    >
      <ArrowRight className="h-6 w-6" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

// --- Service Card & Carousel Section ---
export interface Service {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  imageUrl?: string;
}

// Sub-component for individual cards
const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "relative flex h-[500px] w-full flex-col justify-between overflow-hidden rounded-[2.5rem] p-10 bg-gradient-to-br border border-white/10 group",
        service.gradient
      )}
    >
      {/* Background Image with Overlay */}
      {service.imageUrl && (
        <img 
            src={service.imageUrl} 
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:scale-110 transition-transform duration-700"
        />
      )}

      {/* Card Content */}
      <div className="z-10 flex flex-col items-start text-left">
        <span className="mb-8 text-xs font-bold tracking-widest text-white/40 uppercase">
          ( {service.number} )
        </span>
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md mb-auto group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <service.icon className="h-10 w-10 text-white" />
        </div>
      </div>
      <div className="z-10 mt-6">
        <h3 className="mb-3 text-2xl font-bold text-white tracking-tight">
          {service.title}
        </h3>
        <p className="text-sm text-white/70 leading-relaxed max-w-[90%]">
          {service.description}
        </p>
      </div>

      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
    </motion.div>
  );
};

// Main exportable component
export const ServiceCarousel = ({ services }: { services: Service[] }) => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-6">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="relative"
      >
        <CarouselContent>
        {services.map((service, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-3">
                <ServiceCard service={service} index={index} />
            </div>
            </CarouselItem>
        ))}
        </CarouselContent>
        <CarouselNext className="bg-white/10 border-white/20 hover:bg-white text-white hover:text-black transition-all" />
      </Carousel>
    </div>
  );
};

export default function AnimatedServiceCardDemo({ id }: { id?: string }) {
    const services: Service[] = [
        {
          number: "01",
          title: "Precision Milling",
          description: "High-speed 5-axis milling for complex aerospace and automotive components with micron-level tolerances.",
          icon: Crosshair,
          gradient: "from-blue-600/20 to-blue-900/40",
          imageUrl: "https://images.unsplash.com/photo-1565173153514-66632488a032?auto=format&fit=crop&q=80&w=800"
        },
        {
          number: "02",
          title: "Lathe Turning",
          description: "Automated CNC turning centers for high-volume production of cylindrical parts with perfect surface finishes.",
          icon: Settings,
          gradient: "from-purple-600/20 to-purple-900/40",
          imageUrl: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800"
        },
        {
          number: "03",
          title: "Value Engineering",
          description: "Optimizing material selection and production workflows to maximize efficiency and reduce manufacturing costs.",
          icon: Briefcase,
          gradient: "from-emerald-600/20 to-emerald-900/40",
          imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
        },
        {
          number: "04",
          title: "Rapid Prototyping",
          description: "Turn your CAD designs into physical prototypes in hours with our advanced CNC and 3D modeling solutions.",
          icon: Zap,
          gradient: "from-amber-600/20 to-amber-900/40",
          imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800"
        },
        {
          number: "05",
          title: "Surface Finishing",
          description: "Premium anodizing, powder coating, and polishing services to ensure your parts look as good as they perform.",
          icon: Layers,
          gradient: "from-cyan-600/20 to-cyan-900/40",
          imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800"
        },
        {
          number: "06",
          title: "Assembly & Testing",
          description: "Full-service mechanical assembly and rigorous quality testing for ready-to-use industrial modules.",
          icon: Wrench,
          gradient: "from-rose-600/20 to-rose-900/40",
          imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800"
        },
        {
          number: "07",
          title: "Consulting",
          description: "Expert engineering consulting to help you navigate complex technical challenges and production scaling.",
          icon: Cpu,
          gradient: "from-indigo-600/20 to-indigo-900/40",
          imageUrl: "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&q=80&w=800"
        },
    ];

    return (
      <section id={id} className="w-full bg-[#0A0A0A] py-24 px-4 min-h-[600px]">
        <div className="max-w-[1400px] mx-auto mb-16 px-6 flex flex-col items-center text-center">
            <span className="text-blue-500 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Our Expertise</span>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
                Innovative <br /> Engineering Services.
            </h2>
        </div>
        <ServiceCarousel services={services} />
      </section>
    );
}
