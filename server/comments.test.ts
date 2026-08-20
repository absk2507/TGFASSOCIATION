import { beforeEach, describe, expect, it, vi } from "vitest";

const { createComment, getComments, notifyOwner } = vi.hoisted(() => ({
  createComment: vi.fn(),
  getComments: vi.fn(),
  notifyOwner: vi.fn(),
}));

vi.mock("./db", () => ({ createComment, getComments }));
vi.mock("./_core/notification", () => ({ notifyOwner }));

import { appRouter } from "./routers";

describe("comments.submit", () => {
  beforeEach(() => {
    createComment.mockResolvedValue(undefined);
    notifyOwner.mockResolvedValue(true);
  });

  it("stores a public comment and notifies the project owner", async () => {
    const caller = appRouter.createCaller({ user: null } as never);

    const result = await caller.comments.submit({
      name: "Sita",
      email: "sita@example.com",
      message: "Beautiful TGF celebration.",
    });

    expect(createComment).toHaveBeenCalledWith({
      name: "Sita",
      email: "sita@example.com",
      message: "Beautiful TGF celebration.",
    });
    expect(notifyOwner).toHaveBeenCalledWith({
      title: "New TGF ASSOCIATION comment",
      content: "From: Sita\nEmail: sita@example.com\nComment: Beautiful TGF celebration.",
    });
    expect(result).toEqual({ success: true, notified: true });
  });

  it("returns stored comments to an administrator", async () => {
    const storedComments = [{ id: 1, name: "Sita", email: null, message: "Beautiful TGF celebration.", createdAt: new Date() }];
    getComments.mockResolvedValue(storedComments);
    const caller = appRouter.createCaller({ user: { role: "admin" } } as never);

    await expect(caller.comments.list()).resolves.toEqual(storedComments);
  });
});
