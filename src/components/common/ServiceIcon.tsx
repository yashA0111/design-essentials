import {
  Building2,
  Container,
  House,
  Landmark,
  Layers,
  Presentation,
} from "lucide-react";

type ServiceIconProps = {
  icon: string;
  className?: string;
  strokeWidth?: number;
};

/**
 * Maps the icon name stored on a service to its Lucide glyph.
 */
export function ServiceIcon({ icon, className, strokeWidth }: ServiceIconProps) {
  switch (icon) {
    case "Container":
      return <Container className={className} strokeWidth={strokeWidth} />;
    case "Landmark":
      return <Landmark className={className} strokeWidth={strokeWidth} />;
    case "Presentation":
      return <Presentation className={className} strokeWidth={strokeWidth} />;
    case "Layers":
      return <Layers className={className} strokeWidth={strokeWidth} />;
    case "Building2":
      return <Building2 className={className} strokeWidth={strokeWidth} />;
    default:
      return <House className={className} strokeWidth={strokeWidth} />;
  }
}
