ALTER TABLE countries ALTER COLUMN id TYPE VARCHAR(20);
ALTER TABLE studios  ALTER COLUMN country_id TYPE VARCHAR(20);
ALTER TABLE games    ALTER COLUMN country_id TYPE VARCHAR(20);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS iso_code CHAR(2);
CREATE UNIQUE INDEX IF NOT EXISTS idx_countries_iso ON countries(iso_code) WHERE iso_code IS NOT NULL;

INSERT INTO countries (id, name, flag, iso_code) VALUES
  ('japan',       'Japan',               '🇯🇵', 'JP'),
  ('usa',         'United States',       '🇺🇸', 'US'),
  ('uk',          'United Kingdom',      '🇬🇧', 'GB'),
  ('germany',     'Germany',             '🇩🇪', 'DE'),
  ('france',      'France',              '🇫🇷', 'FR'),
  ('spain',       'Spain',               '🇪🇸', 'ES'),
  ('sweden',      'Sweden',              '🇸🇪', 'SE'),
  ('poland',      'Poland',              '🇵🇱', 'PL'),
  ('italy',       'Italy',               '🇮🇹', 'IT'),
  ('balkans',     'Balkans / C.Europe',  '🇷🇸', NULL),
  ('greece',      'Greece',              '🇬🇷', 'GR'),
  ('russia',      'Russia',              '🇷🇺', 'RU'),
  ('korea',       'South Korea',         '🇰🇷', 'KR'),
  ('china',       'China',               '🇨🇳', 'CN'),
  ('india',       'India',               '🇮🇳', 'IN'),
  ('turkey',      'Turkey',              '🇹🇷', 'TR'),
  ('canada',      'Canada',              '🇨🇦', 'CA'),
  ('australia',   'Australia',           '🇦🇺', 'AU'),
  ('brazil',      'Brazil',              '🇧🇷', 'BR'),
  ('argentina',   'Argentina',           '🇦🇷', 'AR'),
  ('colombia',    'Colombia',            '🇨🇴', 'CO'),
  ('mexico',      'Mexico',              '🇲🇽', 'MX'),
  ('northafrica', 'North Africa',        '🌍', NULL),
  ('subsafrica',  'Sub-Saharan Africa',  '🌍', NULL),
  ('seasia',      'Southeast Asia',      '🌏', NULL),
  ('greenland',   'Greenland',           '🇬🇱', 'GL')
ON CONFLICT (id) DO UPDATE
  SET iso_code = EXCLUDED.iso_code,
      flag     = EXCLUDED.flag;
