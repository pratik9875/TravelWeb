-- Sample data. Run after schema.sql.

insert into places (name, type, city, lat, lng, price_min, price_max, tags, why_we_picked, phone)
values
('Sample Highway Inn', 'hotel', 'Satara', 17.6805, 74.0183, 800, 1500,
  '{parking,family-safe,clean}', 'Clean rooms, safe parking, 5 min off the highway.', '+910000000000'),
('Sample Dhaba', 'restaurant', 'Satara', 17.6900, 74.0000, 150, 400,
  '{veg,family-safe}', 'Hygienic kitchen, fresh thali, loved by truckers and families.', '+910000000001');
