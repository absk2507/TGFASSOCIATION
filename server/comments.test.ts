import { beforeEach, describe, expect, it, vi } from "vitest";

const { createComment, getComments, sendCommentEmailNotification } = vi.hoisted(() => ({
  createComment: vi.fn(),
  getComments: vi.fn(),
  sendCommentEmailNotification: vi.fn(),
}));

vi.mock("./db", () => ({ createComment, getComments }));
vi.mock("./email", () => ({ sendCommentEmailNotification }));

import { appRouter } from "./routers";

describe("comments.submit", () => {
  beforeEach(() => {
    createComment.mockResolvedValue(undefined);
    sendCommentEmailNotification.mockResolvedValue(true);
  });

  it("stores a valid comment and dispatches email notification", async () => {
    const caller = appRouter.createCaller({ user: null } as never);

    const result = await caller.comments.submit({
      name: "Sita",
      message: "Beautiful TGF celebration memories.",
    });

    expect(createComment).toHaveBeenCalledWith({
      name: "Sita",
      email: null,
      message: "Beautiful TGF celebration memories.",
    });
    expect(sendCommentEmailNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Sita",
        message: "Beautiful TGF celebration memories.",
      })
    );
    expect(result).toEqual({ success: true, notified: true });
  });

  it("rejects empty or missing name", async () => {
    const caller = appRouter.createCaller({ user: null } as never);

    await expect(
      caller.comments.submit({
        name: "   ",
        message: "Valid comment",
      })
    ).rejects.toThrow();
  });

  it("rejects empty or whitespace-only comment", async () => {
    const caller = appRouter.createCaller({ user: null } as never);

    await expect(
      caller.comments.submit({
        name: "Sita",
        message: "   ",
      })
    ).rejects.toThrow();
  });

  it("returns stored comments to an administrator", async () => {
    const storedComments = [{ id: 1, name: "Sita", email: null, message: "Beautiful TGF celebration.", createdAt: new Date() }];
    getComments.mockResolvedValue(storedComments);
    const caller = appRouter.createCaller({ user: { role: "admin" } } as never);

    await expect(caller.comments.list()).resolves.toEqual(storedComments);
  });
});
