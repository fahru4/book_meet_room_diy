
-- Valid roles
ALTER TABLE users
ADD CONSTRAINT users_role_check
CHECK (role IN ('ADMIN', 'USER'));

-- Valid booking statuses
ALTER TABLE bookings
ADD CONSTRAINT bookings_status_check
CHECK (status IN ('CONFIRMED', 'CANCELLED'));

-- Capacity must be positive
ALTER TABLE rooms
ADD CONSTRAINT rooms_capacity_check
CHECK (capacity > 0);

-- Booking end time must be after start time
ALTER TABLE bookings
ADD CONSTRAINT bookings_time_check
CHECK (end_time > start_time);

-- Required for GiST equality operators
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Prevent overlapping confirmed bookings in the same room
ALTER TABLE bookings
ADD CONSTRAINT bookings_no_overlap
EXCLUDE USING gist (
  room_id WITH =,
  tstzrange(start_time, end_time, '[)') WITH &&
)
WHERE (status = 'CONFIRMED');
