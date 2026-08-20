"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const handleObserver = () => {
      const selector = ".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger";
      const reveals = document.querySelectorAll(selector);

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add("active");
              }
            });
          },
          {
            threshold: 0.08,
            rootMargin: "0px 0px -40px 0px"
          }
        );

        reveals.forEach(el => observer.observe(el));
      } else {
        reveals.forEach(el => el.classList.add("active"));
      }
    };

    const timer = setTimeout(handleObserver, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
