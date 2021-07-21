--- Create table to store repositories
CREATE TABLE content.repository (
  id INT PRIMARY KEY,
  name VARCHAR (50) UNIQUE NOT NULL,
  url VARCHAR (200) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  size INTEGER NOT NULL,
  stargazers_count INTEGER NOT NULL,
  watchers_count INTEGER NOT NULL,
  language VARCHAR(50) NOT NULL,
  has_issues BOOLEAN NOT NULL,
  has_projects BOOLEAN NOT NULL,
  has_downloads BOOLEAN NOT NULL,
  has_wiki BOOLEAN NOT NULL,
  has_pages BOOLEAN NOT NULL,
  forks_count INTEGER NOT NULL,
  open_issues_count INTEGER NOT NULL,
  archived BOOLEAN NOT NULL,
  disabled BOOLEAN NOT NULL,
  default_branch VARCHAR(50) NOT NULL,
  license_key VARCHAR(20),
  license_name VARCHAR(200),
  license_url VARCHAR(200),
  -- custom logic columns
  ci VARCHAR(50),
  linter_file VARCHAR(50),
  has_linter BOOLEAN,
  has_tests BOOLEAN,
  -- digest columns
  digest_created_on TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  digest_updated_on TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

--- Create indexes to improve search performance
CREATE INDEX IF NOT EXISTS repository_id_idx
  ON content.repository(id);

-- Create trigger to automatically update the `updated_on` field on each update
CREATE TRIGGER update_last_modification_date
  BEFORE UPDATE ON content.repository
  FOR EACH ROW EXECUTE PROCEDURE update_last_modification_date();
