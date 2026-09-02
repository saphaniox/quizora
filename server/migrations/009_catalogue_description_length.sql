ALTER TABLE catalogue_section_edits
  DROP CONSTRAINT IF EXISTS catalogue_section_edits_draft_description_check,
  DROP CONSTRAINT IF EXISTS catalogue_section_edits_published_description_check;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'catalogue_section_edits_draft_description_length_check'
  ) THEN
    ALTER TABLE catalogue_section_edits
      ADD CONSTRAINT catalogue_section_edits_draft_description_length_check
      CHECK (char_length(trim(draft_description)) BETWEEN 10 AND 500);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'catalogue_section_edits_published_description_length_check'
  ) THEN
    ALTER TABLE catalogue_section_edits
      ADD CONSTRAINT catalogue_section_edits_published_description_length_check
      CHECK (char_length(trim(published_description)) BETWEEN 10 AND 500);
  END IF;
END $$;
