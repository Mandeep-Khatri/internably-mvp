-- Add report details and update tracking.
ALTER TABLE "Report"
ADD COLUMN "details" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Preserve reports when a post is removed while keeping an enforceable target
-- relationship for active posts.
ALTER TABLE "Report"
ADD CONSTRAINT "Report_postId_fkey"
FOREIGN KEY ("postId") REFERENCES "Post"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Report_reporterId_status_idx" ON "Report"("reporterId", "status");
CREATE INDEX "Report_reportedUserId_status_idx" ON "Report"("reportedUserId", "status");
CREATE INDEX "Report_postId_status_idx" ON "Report"("postId", "status");
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");
