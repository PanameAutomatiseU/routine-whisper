-- Create the routines table with all required fields
CREATE TABLE public.routines (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL,
  date             date NOT NULL,
  happiness        text CHECK (happiness IN ('Low','Medium','High')),
  sleep_hours      numeric,
  deep_sleep_min   integer,
  rem_sleep_min    integer,
  score_sleep      numeric,
  focus_areas      text[]          
               CHECK (cardinality(focus_areas) <= 8),
  focus_desc       text,
  toltec_word      boolean DEFAULT false,
  toltec_personal  boolean DEFAULT false,
  toltec_assume    boolean DEFAULT false,
  toltec_best      boolean DEFAULT false,
  created_at       timestamp with time zone DEFAULT now(),
  updated_at       timestamp with time zone DEFAULT now()
);

-- Create unique constraint for user_id and date
CREATE UNIQUE INDEX uniq_routines_user_date
  ON public.routines(user_id, date);

-- Enable Row Level Security
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own routines"
  ON public.routines FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own routines"
  ON public.routines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routines"
  ON public.routines FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routines"
  ON public.routines FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_routines_updated_at
BEFORE UPDATE ON public.routines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for the routines table
ALTER TABLE public.routines REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.routines;