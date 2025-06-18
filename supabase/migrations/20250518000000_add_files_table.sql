-- Create grant table with PROJECTID as primary key
CREATE TABLE IF NOT EXISTS "grant" (
    "PROJECTID" TEXT PRIMARY KEY NOT NULL,
    "COST_CENTER_CODE" TEXT,
    "PL_STAFF_NO" INTEGER,
    "PL_NAME" TEXT,
    "PTJ_RESEARCH_ALLIANCE" TEXT,
    "RESEARCH_GROUP" TEXT,
    "PROJECT_TITLE" TEXT,
    "PRO_DATESTART" DATE,
    "PRO_DATEEND" DATE,
    "GRANT_TYPE" TEXT,
    "PROJECT_STATUS" TEXT,
    "SPONSOR_CATEGORY" TEXT,
    "SUBSPONSOR_NAME" TEXT,
    "PRO_APPROVED" NUMERIC,
    "file_path" TEXT
);

-- Create storage bucket for grant files
INSERT INTO storage.buckets (id, name, public)
VALUES ('grants', 'grants', true)
ON CONFLICT (id) DO NOTHING;

-- Set up policies for the grants bucket
CREATE POLICY "Grant files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'grants');

CREATE POLICY "Anyone can upload grant files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'grants');

CREATE POLICY "Anyone can update grant files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'grants');

CREATE POLICY "Anyone can delete grant files"
ON storage.objects FOR DELETE
USING (bucket_id = 'grants');