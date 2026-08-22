import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createComment, getComments } from "./db";
import { sendCommentEmailNotification } from "./email";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
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
        name: z.string()
          .trim()
          .min(1, "Please enter your name.")
          .max(120, "Name must be 120 characters or less."),
        message: z.string()
          .trim()
          .min(1, "Please enter your comment.")
          .max(2000, "Comment must be 2000 characters or less."),
      }))
      .mutation(async ({ input }) => {
        const trimmedName = input.name.trim();
        const trimmedMessage = input.message.trim();

        if (!trimmedName) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Please enter your name.",
          });
        }

        if (!trimmedMessage) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Please enter your comment.",
          });
        }

        // Store comment in database if available
        try {
          await createComment({
            name: trimmedName,
            email: null,
            message: trimmedMessage,
          });
        } catch (error) {
          console.warn("[Comments] Database storage not available or failed:", (error as Error).message);
        }

        // Dispatch email notification to tgfassociation@gmail.com
        const sent = await sendCommentEmailNotification({
          name: trimmedName,
          message: trimmedMessage,
          submittedAt: new Date(),
        });

        if (!sent) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Sorry, we couldn't send your comment. Please try again.",
          });
        }

        return { success: true, notified: true } as const;
      }),
    list: adminProcedure.query(async () => getComments()),
  }),
});

export type AppRouter = typeof appRouter;
