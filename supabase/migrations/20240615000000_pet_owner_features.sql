-- Create appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  type TEXT NOT NULL, -- e.g., 'Check-up', 'Vaccination', 'Grooming'
  vet_name TEXT,
  clinic TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX appointments_dog_id_idx ON appointments(dog_id);
CREATE INDEX appointments_date_idx ON appointments(date);
CREATE INDEX appointments_status_idx ON appointments(status);

-- Create gallery_images table
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  dog_id UUID REFERENCES dogs(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX gallery_images_owner_id_idx ON gallery_images(owner_id);
CREATE INDEX gallery_images_dog_id_idx ON gallery_images(dog_id);

-- Create gallery_collections table
CREATE TABLE gallery_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_id UUID REFERENCES gallery_images(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX gallery_collections_owner_id_idx ON gallery_collections(owner_id);

-- Create gallery_collection_images junction table
CREATE TABLE gallery_collection_images (
  collection_id UUID REFERENCES gallery_collections(id) ON DELETE CASCADE NOT NULL,
  image_id UUID REFERENCES gallery_images(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (collection_id, image_id)
);

-- Create health_records table
CREATE TABLE health_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  record_date DATE NOT NULL,
  record_type TEXT NOT NULL, -- e.g., 'Examination', 'Test', 'Procedure'
  description TEXT,
  provider TEXT,
  results TEXT,
  notes TEXT,
  documents JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX health_records_dog_id_idx ON health_records(dog_id);
CREATE INDEX health_records_record_date_idx ON health_records(record_date);

-- Create medications table
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX medications_dog_id_idx ON medications(dog_id);

-- Create reminders table
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  category TEXT NOT NULL, -- e.g., 'vaccination', 'checkup', 'medication', 'other'
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  completed BOOLEAN DEFAULT FALSE,
  notify_before INTEGER DEFAULT 1, -- days before to notify
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX reminders_owner_id_idx ON reminders(owner_id);
CREATE INDEX reminders_dog_id_idx ON reminders(dog_id);
CREATE INDEX reminders_due_date_idx ON reminders(due_date);

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_collection_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for appointments
CREATE POLICY "Users can view their own dogs' appointments"
  ON appointments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = appointments.dog_id
    AND dogs.owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert appointments for their own dogs"
  ON appointments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = appointments.dog_id
    AND dogs.owner_id = auth.uid()
  ));

CREATE POLICY "Users can update their own dogs' appointments"
  ON appointments FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = appointments.dog_id
    AND dogs.owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own dogs' appointments"
  ON appointments FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = appointments.dog_id
    AND dogs.owner_id = auth.uid()
  ));

-- Create RLS policies for gallery_images
CREATE POLICY "Users can view their own gallery images"
  ON gallery_images FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own gallery images"
  ON gallery_images FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own gallery images"
  ON gallery_images FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own gallery images"
  ON gallery_images FOR DELETE
  USING (owner_id = auth.uid());

-- Create RLS policies for gallery_collections
CREATE POLICY "Users can view their own gallery collections"
  ON gallery_collections FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own gallery collections"
  ON gallery_collections FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own gallery collections"
  ON gallery_collections FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own gallery collections"
  ON gallery_collections FOR DELETE
  USING (owner_id = auth.uid());

-- Create RLS policies for gallery_collection_images
CREATE POLICY "Users can view their own gallery collection images"
  ON gallery_collection_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM gallery_collections
    WHERE gallery_collections.id = gallery_collection_images.collection_id
    AND gallery_collections.owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own gallery collection images"
  ON gallery_collection_images FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM gallery_collections
    WHERE gallery_collections.id = gallery_collection_images.collection_id
    AND gallery_collections.owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own gallery collection images"
  ON gallery_collection_images FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM gallery_collections
    WHERE gallery_collections.id = gallery_collection_images.collection_id
    AND gallery_collections.owner_id = auth.uid()
  ));

-- Create RLS policies for health_records
CREATE POLICY "Users can view their own dogs' health records"
  ON health_records FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = health_records.dog_id
    AND dogs.owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert health records for their own dogs"
  ON health_records FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = health_records.dog_id
    AND dogs.owner_id = auth.uid()
  ));

CREATE POLICY "Users can update their own dogs' health records"
  ON health_records FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = health_records.dog_id
    AND dogs.owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own dogs' health records"
  ON health_records FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = health_records.dog_id
    AND dogs.owner_id = auth.uid()
  ));

-- Create RLS policies for medications
CREATE POLICY "Users can view their own dogs' medications"
  ON medications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = medications.dog_id
    AND dogs.owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert medications for their own dogs"
  ON medications FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = medications.dog_id
    AND dogs.owner_id = auth.uid()
  ));

CREATE POLICY "Users can update their own dogs' medications"
  ON medications FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = medications.dog_id
    AND dogs.owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own dogs' medications"
  ON medications FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = medications.dog_id
    AND dogs.owner_id = auth.uid()
  ));

-- Create RLS policies for reminders
CREATE POLICY "Users can view their own reminders"
  ON reminders FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own reminders"
  ON reminders FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own reminders"
  ON reminders FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own reminders"
  ON reminders FOR DELETE
  USING (owner_id = auth.uid());
