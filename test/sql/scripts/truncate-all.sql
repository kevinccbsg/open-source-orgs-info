--- Run script to truncate the data in all tables within the content schema
DO $$
DECLARE
  row record;
BEGIN
  FOR row IN
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'content'
  LOOP
    EXECUTE format('TRUNCATE content.%I RESTART IDENTITY CASCADE', row.table_name);
  END LOOP;
END;
$$ LANGUAGE plpgsql;