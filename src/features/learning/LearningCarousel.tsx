import type { ReactNode } from "react";

import { Carousel } from "../../shared/components/carousel/Carousel";
import "./learning-carousel.css";

export function LearningCarousel({
  children,
  label,
  premium = false,
}: {
  children: ReactNode;
  label: string;
  premium?: boolean;
}) {
  return (
    <Carousel label={label} tone={premium ? "warning" : "accent"}>
      {children}
    </Carousel>
  );
}