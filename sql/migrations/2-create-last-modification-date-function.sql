--- Create method to automatically update last modification date
CREATE OR REPLACE FUNCTION update_last_modification_date()
  RETURNS trigger AS
  $FUNC_BODY$
    BEGIN
      NEW.digest_updated_on := timezone('utc'::text, now());
      RETURN NEW;
    END;
  $FUNC_BODY$
  LANGUAGE plpgsql;
