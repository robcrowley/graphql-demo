-- Up
CREATE TABLE Artist
(
  artistId INTEGER PRIMARY KEY AUTOINCREMENT,
  name NVARCHAR(128) NOT NULL,
  website NVARCHAR(128) NOT NULL
);

CREATE TABLE Label
(
  labelId INTEGER PRIMARY KEY AUTOINCREMENT,
  name NVARCHAR(128) NOT NULL,
  founded INTEGER NOT NULL
);

CREATE TABLE Album
(
  albumId INTEGER PRIMARY KEY AUTOINCREMENT,
  title NVARCHAR(128) NOT NULL,
  artistId INTEGER NOT NULL,
  labelId INTEGER NOT NULL,
  CONSTRAINT Album_fk_artistId FOREIGN KEY (artistId)
    REFERENCES Artist (artistId) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT Album_fk_labelId FOREIGN KEY (labelId)
    REFERENCES Label (labelId) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE User
(
  userId INTEGER PRIMARY KEY AUTOINCREMENT,
  name NVARCHAR(128) NOT NULL,
  login NVARCHAR(32) NOT NULL,
  password NVARCHAR(128) NOT NULL,
  CONSTRAINT login_unique UNIQUE (login)
);

CREATE TABLE ArtistWatch
(
  artistWatchId INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  artistId INTEGER NOT NULL,  
  CONSTRAINT User_fk_userId FOREIGN KEY (userId)
    REFERENCES User (userId) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT Artist_fk_artistId FOREIGN KEY (artistId)
    REFERENCES Artist (artistId) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE AlbumReview
(
  albumReviewId INTEGER PRIMARY KEY AUTOINCREMENT,
  albumId INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL,
  dateCreated DATE DEFAULT CURRENT_DATE, 
  CONSTRAINT User_fk_userId FOREIGN KEY (userId)
    REFERENCES User (userId) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT Album_fk_albumId FOREIGN KEY (albumId)
    REFERENCES Album (albumId) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO Label
  (name, founded)
VALUES
  ('Go! Beat', 1983);
INSERT INTO Label
  (name, founded)
VALUES
  ('Ninja Tunes', 1991);
INSERT INTO Label
  (name, founded)
VALUES
  ('Island', 1989);

INSERT INTO Artist
  (name, website)
VALUES
  ('Portishead', 'http://www.portishead.co.uk/');
INSERT INTO Artist
  (name, website)
VALUES
  ('The Herbaliser', 'http://herbaliser.com/');

INSERT INTO Album
  (title, artistId, labelId)
VALUES
  ('Dummy', 1, 1);
INSERT INTO Album
  (title, artistId, labelId)
VALUES
  ('Portishead (Self Titled)', 1, 1);
INSERT INTO Album
  (title, artistId, labelId)
VALUES
  ('Third', 1, 3);

INSERT INTO Album
  (title, artistId, labelId)
VALUES
  ('Remedies', 2, 2);
INSERT INTO Album
  (title, artistId, labelId)
VALUES
  ('Blow Your Headphones', 2, 2);

INSERT INTO User
  (name, login, password)
VALUES
  ('ndc conf', 'ndcconf', '$2a$10$kl3PHVkkPZ.Ajg4o17s/..W8IWK5ETMykKDgBNG1KO7GSsg2ddL2e' /* 2017 */);

INSERT INTO ArtistWatch
  (userId, artistId)
VALUES
  (1, 1);

INSERT INTO AlbumReview
  (albumId, userId, content, rating)
VALUES
  (1, 1, 'Dummy, the 1994 debut from Portishead is a masterwork of downbeat and desperation.', 9);

-- Down
DROP TABLE Label;
DROP TABLE Album;
DROP TABLE Artist;
DROP TABLE ArtistWatch;
DROP TABLE AlbumReview;
DROP TABLE User;