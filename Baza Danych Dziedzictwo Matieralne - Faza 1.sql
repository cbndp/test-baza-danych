-- Create main places table and information for Stage 1 of database -- 
CREATE Table modern_regions (
region_id integer PRIMARY KEY,
modern_region varchar(255)
);

CREATE Table historical_regions (
histreg_id integer PRIMARY KEY,
historical_region varchar(255)
);

CREATE Table territories (
terr_id integer PRIMARY KEY,
territory_name varchar(255)
);

CREATE Table places (
place_id integer PRIMARY KEY,
latitude double,
longitude double,
mod_region_id integer,
hist_region_id integer,
region_id integer,
territory_id integer,
FOREIGN KEY (mod_region_id) REFERENCES modern_regions(region_id),
FOREIGN KEY (hist_region_id) REFERENCES historical_regions(histreg_id),
FOREIGN KEY (territory_id) REFERENCES territories(terr_id)
);

CREATE Table place_names (
name_id integer PRIMARY KEY,
place_id integer,
modern_name varchar(255),
historical_name varchar(255),
FOREIGN KEY (place_id) REFERENCES places(place_id)
);
 
CREATE Table place_catalogues (
catalogue_id integer PRIMARY KEY,
place_id integer,
catalogue_title varchar(255),
catalogue_pdf_url varchar(500),
notes text,
cloud_provider varchar(100),
file_size bigint,
file_type varchar(50),
upload_date datetime,
FOREIGN KEY (place_id) REFERENCES places(place_id)
);

ALTER TABLE places
CHANGE place_north latitude DOUBLE,
CHANGE place_east longitutde DOUBLE;

