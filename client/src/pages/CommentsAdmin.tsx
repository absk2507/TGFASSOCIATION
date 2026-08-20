/**
 * Owner-only review screen for visitor messages submitted through the public
 * TGF ASSOCIATION comment box. The dashboard wrapper handles sign-in chrome.
 */
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Mail, MessageSquareText } from "lucide-react";

export default function CommentsAdmin() {
  const comments = trpc.comments.list.useQuery();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6 py-4">
        <div>
          <Badge className="bg-[#26275e] text-white hover:bg-[#26275e]">TGF ADMIN</Badge>
          <h1 className="mt-3 font-display text-4xl tracking-tight text-[#29263b]">Visitor comments</h1>
          <p className="mt-2 text-sm text-muted-foreground">Every submission from the public TGF comment box is stored here. The project owner also receives an alert when a comment arrives.</p>
        </div>

        {comments.isLoading && <p className="text-sm text-muted-foreground">Loading comments…</p>}
        {comments.isError && <Card><CardContent className="p-6 text-sm text-destructive">Comments could not be loaded. Confirm that you are signed in as the project owner and try again.</CardContent></Card>}
        {comments.data?.length === 0 && <Card><CardContent className="p-6 text-sm text-muted-foreground">No visitor comments have arrived yet.</CardContent></Card>}

        <div className="space-y-3">
          {comments.data?.map(comment => (
            <Card key={comment.id} className="border-[#dfd0b2] bg-[#fffcf5] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-lg text-[#29263b]">
                  <span className="flex items-center gap-2"><MessageSquareText className="h-4 w-4 text-[#a75e2b]" />{comment.name || "Anonymous visitor"}</span>
                  <span className="text-xs font-normal text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {comment.email && <a className="inline-flex items-center gap-2 text-sm font-medium text-[#277170] hover:underline" href={`mailto:${comment.email}`}><Mail className="h-3.5 w-3.5" />{comment.email}</a>}
                <p className="whitespace-pre-wrap text-sm leading-6 text-[#59545e]">{comment.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
