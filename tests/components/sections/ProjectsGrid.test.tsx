import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { projects } from "@/lib/data/projects";
import { services } from "@/lib/data/services";

const categoriesWithProjects = services.filter((service) =>
  projects.some((project) => project.category === service.id)
);

describe("ProjectsGrid", () => {
  it("shows every project and a filter for each populated category", () => {
    render(<ProjectsGrid />);

    expect(screen.getAllByRole("link")).toHaveLength(projects.length);
    for (const service of categoriesWithProjects) {
      expect(
        screen.getByRole("button", { name: service.name })
      ).toBeDefined();
    }
  });

  it("filters projects down to the selected category", () => {
    render(<ProjectsGrid />);
    const [service] = categoriesWithProjects;
    const button = screen.getByRole("button", { name: service.name });

    act(() => {
      button.click();
    });

    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getAllByRole("link")).toHaveLength(
      projects.filter((project) => project.category === service.id).length
    );
  });
});
