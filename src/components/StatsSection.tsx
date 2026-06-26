import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { label: "Customer Reviews", value: 56, suffix: "+" },
  { label: "Happy Customers", value: 1000, suffix: "+" },
  { label: "Products Available", value: 500, suffix: "+" },
  { label: "Customer Satisfaction", value: 100, suffix: "%" },
];

function Counter({ from, to, duration, inView }: { from: number, to: number, duration: number, inView: boolean }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!inView) return;
    
    let startTime: number;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        setCount(Math.min(to, Math.floor(from + (to - from) * (progress / duration))));
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(to);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration, inView]);

  return <span>{count}</span>;
}

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="stats" className="py-20 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-heading font-extrabold text-secondary mb-2 flex items-center justify-center">
                <Counter from={0} to={stat.value} duration={2000} inView={isInView} />
                <span>{stat.suffix}</span>
              </div>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}