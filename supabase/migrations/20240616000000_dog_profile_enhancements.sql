-- Add profile image URL and additional fields to dogs table
ALTER TABLE dogs
ADD COLUMN profile_image_url TEXT,
ADD COLUMN weight NUMERIC,
ADD COLUMN height NUMERIC,
ADD COLUMN microchip_number TEXT,
ADD COLUMN registration_number TEXT;

-- Create index for faster queries
CREATE INDEX dogs_owner_id_idx ON dogs(owner_id);
