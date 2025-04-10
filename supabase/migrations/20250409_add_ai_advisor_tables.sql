-- Migration: Add AI Advisor tables for health reminders and saved advice

CREATE TABLE health_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  category TEXT,
  priority TEXT,
  completed BOOLEAN DEFAULT FALSE,
  notify_before INTEGER DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE saved_advice (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE health_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_advice ENABLE ROW LEVEL SECURITY;

-- Policies for health_reminders
CREATE POLICY "Users can view their own health reminders"
  ON health_reminders FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own health reminders"
  ON health_reminders FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own health reminders"
  ON health_reminders FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own health reminders"
  ON health_reminders FOR DELETE
  USING (user_id = auth.uid());

-- Policies for saved_advice
CREATE POLICY "Users can view their own saved advice"
  ON saved_advice FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own saved advice"
  ON saved_advice FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own saved advice"
  ON saved_advice FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own saved advice"
  ON saved_advice FOR DELETE
  USING (user_id = auth.uid());
