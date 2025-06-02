-- Create labs table with LABID as primary key
CREATE TABLE IF NOT EXISTS "labs" (
    "LABID" TEXT PRIMARY KEY NOT NULL,
    "LAB_NAME" TEXT,
    "LAB_HEAD" TEXT,
    "LAB_HEAD_EMAIL" TEXT,
    "DEPARTMENT" TEXT,
    "RESEARCH_AREA" TEXT,
    "LAB_DESCRIPTION" TEXT,
    "LOCATION" TEXT,
    "ESTABLISHED_DATE" DATE,
    "LAB_STATUS" TEXT,
    "EQUIPMENT_COUNT" INTEGER,
    "STUDENT_CAPACITY" INTEGER,
    "BUDGET" NUMERIC,
    "LAB_TYPE" TEXT,
    "CONTACT_PHONE" TEXT,
    "file_path" TEXT
);

-- Create storage bucket for lab files
INSERT INTO storage.buckets (id, name, public)
VALUES ('labs', 'labs', true)
ON CONFLICT (id) DO NOTHING;

-- Set up policies for the labs bucket
CREATE POLICY "Lab files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'labs');

CREATE POLICY "Anyone can upload lab files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'labs');

CREATE POLICY "Anyone can update lab files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'labs');

CREATE POLICY "Anyone can delete lab files"
ON storage.objects FOR DELETE
USING (bucket_id = 'labs');
