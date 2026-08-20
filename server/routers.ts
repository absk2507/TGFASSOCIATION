import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { createComment, getComments } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  comments: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().trim().min(1).max(120).optional(),
        email: z.string().trim().email().max(320).optional(),
        message: z.string().trim().min(3).max(2000),
      }))
      .mutation(async ({ input }) => {
        await createComment({
          name: input.name || null,
          email: input.email || null,
          message: input.message,
        });

        const sender = input.name || "Anonymous visitor";
        const emailLine = input.email ? `\nEmail: ${input.email}` : "";
        const preview = input.message.length > 1200 ? `${input.message.slice(0, 1200)}…` : input.message;
        const notified = await notifyOwner({
          title: "New TGF ASSOCIATION comment",
          content: `From: ${sender}${emailLine}\nComment: ${preview}`,
        });

        return { success: true, notified } as const;
      }),
    list: adminProcedure.query(async () => getComments()),
  }),
});

export type AppRouter = typeof appRouter;
