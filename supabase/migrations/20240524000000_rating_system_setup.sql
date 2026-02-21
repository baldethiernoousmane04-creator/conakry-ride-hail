-- Migration: 20240524000000_rating_system_setup.sql
-- Description: Setup ratings table and update user profile ratings automatically.

-- Ensure rides table exists for foreign key reference
CREATE TABLE IF NOT EXISTS public.rides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.profiles(id),
    driver_id UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'pending', -- 'pending', 'ongoing', 'completed', 'cancelled'
    pickup_address TEXT,
    destination_address TEXT,
    fare NUMERIC(15,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ratings Table
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES public.rides(id) ON DELETE CASCADE,
    rater_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rated_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating_value INTEGER NOT NULL CHECK (rating_value >= 1 AND rating_value <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Rides Policies
CREATE POLICY "Users can view their own rides" ON public.rides
    FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = driver_id);

-- Ratings Policies
CREATE POLICY "Ratings are viewable by everyone" 
    ON public.ratings FOR SELECT 
    USING (true);

CREATE POLICY "Users can create their own ratings" 
    ON public.ratings FOR INSERT 
    WITH CHECK (auth.uid() = rater_user_id);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_ratings_trip_id ON public.ratings(trip_id);
CREATE INDEX IF NOT EXISTS idx_ratings_rater_id ON public.ratings(rater_user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_rated_id ON public.ratings(rated_user_id);
CREATE INDEX IF NOT EXISTS idx_rides_customer_id ON public.rides(customer_id);
CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON public.rides(driver_id);

-- Function to update profile rating automatically
CREATE OR REPLACE FUNCTION public.update_profile_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the average rating for the rated user
    UPDATE public.profiles
    SET 
        rating = (
            SELECT ROUND(AVG(rating_value)::numeric, 1)
            FROM public.ratings
            WHERE rated_user_id = NEW.rated_user_id
        ),
        total_rides = (
            SELECT COUNT(DISTINCT trip_id)
            FROM public.ratings
            WHERE rated_user_id = NEW.rated_user_id
        )
    WHERE id = NEW.rated_user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on rating insertion
DROP TRIGGER IF EXISTS on_rating_created ON public.ratings;
CREATE TRIGGER on_rating_created
    AFTER INSERT ON public.ratings
    FOR EACH ROW EXECUTE PROCEDURE public.update_profile_rating();