import { useState, useEffect } from "react";

const useIntersection = (element: HTMLElement | null) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (element == null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: element.scrollHeight / 2 + "px" }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [element]);

  return isVisible;
};

export default useIntersection;
