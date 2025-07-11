-- CreateTable
CREATE TABLE "about_content" (
    "id" INTEGER NOT NULL,
    "title" TEXT,
    "intro_paragraph" TEXT,
    "main_paragraph" TEXT,
    "conclusion_paragraph" TEXT,
    "closing_statement" TEXT,

    CONSTRAINT "about_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "equipment_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("equipment_id")
);

-- CreateTable
CREATE TABLE "event" (
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "time" TEXT,
    "location" TEXT,
    "category" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "registration_required" BOOLEAN DEFAULT false,
    "registration_deadline" DATE,
    "contact_email" TEXT NOT NULL,
    "image" TEXT DEFAULT '/api/placeholder/400/250',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "status" TEXT NOT NULL DEFAULT 'Upcoming',
    "event_id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "grant" (
    "project_id" TEXT NOT NULL,
    "cost_center_code" TEXT,
    "pl_staff_no" BIGINT,
    "pl_name" TEXT,
    "ptj_research_alliance" TEXT,
    "research_group" TEXT,
    "project_title" TEXT,
    "pro_date_start" DATE,
    "pro_date_end" DATE,
    "type" TEXT,
    "status" TEXT,
    "sponsor_category" TEXT,
    "subsponsor_name" TEXT,
    "approved_amount" REAL,
    "sponsor_name" TEXT,
    "grant_id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "grant_pkey" PRIMARY KEY ("grant_id")
);

-- CreateTable
CREATE TABLE "lab" (
    "lab_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lab_name" TEXT,
    "lab_head" TEXT,
    "email" TEXT,
    "research_area" TEXT,
    "description" TEXT,
    "location" TEXT,
    "status" TEXT,
    "type" TEXT,
    "contact_phone" TEXT,

    CONSTRAINT "labs_pkey" PRIMARY KEY ("lab_id")
);

-- CreateTable
CREATE TABLE "lab_equipment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "quantity" SMALLINT NOT NULL DEFAULT 0,
    "equipment_id" UUID NOT NULL,
    "lab_id" UUID NOT NULL,

    CONSTRAINT "lab_equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "project_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "publication" (
    "pub_refno" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "journal" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "impact" REAL,
    "date" DATE NOT NULL,
    "level" TEXT NOT NULL,
    "author_id" SMALLINT NOT NULL,
    "research_alliance" TEXT,
    "rg_name" TEXT,
    "author_name" TEXT NOT NULL,
    "publication_id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "publication_pkey" PRIMARY KEY ("publication_id")
);

-- CreateIndex
CREATE INDEX "idx_events_category" ON "event"("category");

-- CreateIndex
CREATE INDEX "idx_events_date" ON "event"("date");

-- CreateIndex
CREATE INDEX "idx_events_priority" ON "event"("priority");

-- CreateIndex
CREATE INDEX "idx_events_status" ON "event"("status");

-- CreateIndex
CREATE UNIQUE INDEX "lab_equipment_id_key" ON "lab_equipment"("id");

-- AddForeignKey
ALTER TABLE "lab_equipment" ADD CONSTRAINT "lab_equipment_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("equipment_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lab_equipment" ADD CONSTRAINT "lab_equipment_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "lab"("lab_id") ON DELETE CASCADE ON UPDATE NO ACTION;

