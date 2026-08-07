import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "./ProjectCard";
import { ServiceCard } from "./ServiceCard";
import { projects } from "@/lib/data/projects";
import { getServiceById, services } from "@/lib/data/services";

describe("overlay cards", () => {
  it("renders a project card linking to its case study", () => {
    const [project] = projects;
    render(<ProjectCard project={project} />);

    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe(`/projects/${project.slug}`);
    expect(screen.getByRole("heading").textContent).toBe(project.title);
    expect(
      screen.getByText(`${project.location} · ${project.year}`)
    ).toBeDefined();
    expect(
      screen.getByText(getServiceById(project.category)!.name)
    ).toBeDefined();
  });

  it("renders a service card linking to its detail page", () => {
    const [service] = services;
    render(<ServiceCard service={service} />);

    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe(`/services/${service.slug}`);
    expect(screen.getByRole("heading").textContent).toBe(service.name);
    expect(screen.getByText(service.tagline)).toBeDefined();
  });
});
