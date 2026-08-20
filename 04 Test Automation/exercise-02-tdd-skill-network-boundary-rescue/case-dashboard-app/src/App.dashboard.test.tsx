import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import App from "./App";
import { server } from "./test/server";

describe("case dashboard without TDD skill", () => {
  it("shows loading text while waiting", () => {
    server.use(http.get("/api/cases", async () => {
      await delay("infinite");
      return HttpResponse.json([]);
    }));
    render(<App />);
    expect(screen.getByText("Loading cases...")).toBeInTheDocument();
  });

  it("shows a returned case", async () => {
    render(<App />);
    expect(await screen.findByText("Northstar Health")).toBeInTheDocument();
  });

  it("shows server-empty copy", async () => {
    server.use(http.get("/api/cases", () => HttpResponse.json([])));
    render(<App />);
    expect(await screen.findByText("No cases are assigned yet.")).toBeInTheDocument();
  });

  it("shows filtered-empty copy", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText("Northstar Health");
    await user.type(screen.getByRole("textbox", { name: "Filter cases" }), "unknown customer");
    expect(screen.getByText('No cases match "unknown customer".')).toBeInTheDocument();
  });

  it("shows a request error and Retry", async () => {
    server.use(http.get("/api/cases", () => HttpResponse.json({ message: "down" }, { status: 503 })));
    render(<App />);
    expect(await screen.findByRole("alert")).toHaveTextContent("We could not load cases");
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("retries after a failed GET /api/cases", async () => {
    const user = userEvent.setup();
    let requests = 0;
    server.use(http.get("/api/cases", () => {
      requests += 1;
      if (requests === 1) return HttpResponse.json({ message: "temporary" }, { status: 503 });
      return HttpResponse.json([
        { id: "CASE-220", customer: "Recovered Co", owner: "support", summary: "Retry worked", status: "new" },
      ]);
    }));
    render(<App />);
    await screen.findByRole("alert");
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByText("Recovered Co")).toBeInTheDocument();
  });
});
