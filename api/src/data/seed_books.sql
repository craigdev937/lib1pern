-- ============================================================
-- Seed data for the `books` table
-- ============================================================
-- NOTE on cover_url:
-- Where I'm confident in the ISBN, I've used the Open Library
-- covers API (a real, public image service):
--   https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg
-- For titles where I couldn't confidently verify the ISBN/cover,
-- I used a labeled placeholder from placehold.co so nothing is
-- silently wrong. Swap these out with real CDN/cover URLs before
-- using this in production.
-- ============================================================

INSERT INTO books (barcode, cover_url, title, authors, description, subjects, publication_date, publisher, pages, genre)
VALUES

-- Jeph Loeb
(
    '978-0785185390',
    'https://m.media-amazon.com/images/I/91els3H5n8L._UF1000,1000_QL80_.jpg',
    'Hulk by Jeph Loeb',
    ARRAY['Jeph Loeb'],
    'Red alert! There''s a sadistic new red-skinned Hulk in the Marvel Universe, with keen intelligence and a radioactive touch! Who or what is he? And with Marvel''s heroes powerless against him, will it take a Hulk to catch a Hulk? It''s an explosive battle as the red and green Hulks collide! But even as Bruce Banner is attacked by a pack of wild Wendigos, She-Hulk recruits a cavalry of super heroines including Valkyrie, Thundra, Ms. Marvel and Storm! Plus: the Defenders are reassembled to take down the Red Hulk, but he''s got a team of his own!',
    ARRAY['Comics', 'Superheroes', 'Crime', 'Mystery'],
    '2013-11-13',
    'Marvel Comics',
    432,
    'Graphic Novel'
),
(
    '9781401216033',
    'https://static.dc.com/2023-10/SMFAS_2023%20%28Cover%29.jpg',
    'Superman for All Seasons',
    ARRAY['Jeph Loeb'],
    'A retelling of Superman''s early years in Smallville and Metropolis, told through the eyes of four people who know him best.',
    ARRAY['Comics', 'Superheroes'],
    '1999-01-01',
    'DC Comics',
    248,
    'Graphic Novel'
),

-- Stephenie Meyer
(
    '9780316015844',
    'https://covers.openlibrary.org/b/isbn/9780316015844-L.jpg',
    'Twilight',
    ARRAY['Stephenie Meyer'],
    'A teenage girl falls in love with a vampire in a small town in the Pacific Northwest.',
    ARRAY['Young Adult', 'Fantasy', 'Romance'],
    '2005-10-05',
    'Little, Brown and Company',
    498,
    'Young Adult Fantasy'
),
(
    '9780316024969',
    'https://www.hachettebookgroup.com/wp-content/uploads/2025/12/9780316007726.jpg',
    'New Moon',
    ARRAY['Stephenie Meyer'],
    'Bella Swan is left devastated when the Cullens leave Forks, and she turns to her friendship with Jacob Black.',
    ARRAY['Young Adult', 'Fantasy', 'Romance'],
    '2006-09-06',
    'Little, Brown and Company',
    563,
    'Young Adult Fantasy'
),

-- Gail Simone
(
    '9781401225676',
    'https://comicsbugle.com/wp-content/uploads/2025/03/birds-of-prey-by-gail-simone-omnibus-vol-1.jpg',
    'Birds of Prey: Of Like Minds',
    ARRAY['Gail Simone'],
    'Oracle and Black Canary team up on covert missions in this acclaimed run on the Birds of Prey series.',
    ARRAY['Comics', 'Superheroes', 'Action'],
    '2003-01-01',
    'DC Comics',
    144,
    'Graphic Novel'
),
(
    '9781401237894',
    'https://image.nobleknight.com/d/webp1500/darkestreflection.webp',
    'Batgirl, Volume 1: The Darkest Reflection',
    ARRAY['Gail Simone'],
    'Barbara Gordon returns as Batgirl after years in the wheelchair as Oracle, facing a new threat called Mirror.',
    ARRAY['Comics', 'Superheroes'],
    '2012-01-01',
    'DC Comics',
    176,
    'Graphic Novel'
),

-- Rick Riordan
(
    '9780786838653',
    'https://images-us.bookshop.org/ingram/9781368051477.jpg?v=bf0df8c73e6d8eef6b82740a32861c88&width=600',
    'The Lightning Thief',
    ARRAY['Rick Riordan'],
    'A twelve-year-old boy discovers he is a demigod, son of Poseidon, and is thrust into a quest to prevent a war among the Greek gods.',
    ARRAY['Middle Grade', 'Fantasy', 'Mythology'],
    '2005-06-28',
    'Disney-Hyperion',
    377,
    'Fantasy'
),
(
    '9780786838660',
    'https://books.disney.com/content/uploads/2014/05/Sea-of-Monsters-New-TP.jpg',
    'The Sea of Monsters',
    ARRAY['Rick Riordan'],
    'Percy Jackson and his friends journey into the Sea of Monsters to save Camp Half-Blood and rescue a friend.',
    ARRAY['Middle Grade', 'Fantasy', 'Mythology'],
    '2006-04-01',
    'Disney-Hyperion',
    279,
    'Fantasy'
),

-- Suzanne Collins
(
    '9780439023528',
    'https://covers.openlibrary.org/b/isbn/9780439023528-L.jpg',
    'The Hunger Games',
    ARRAY['Suzanne Collins'],
    'In a dystopian future, Katniss Everdeen volunteers to take her sister''s place in a televised fight to the death.',
    ARRAY['Young Adult', 'Dystopian', 'Science Fiction'],
    '2008-09-14',
    'Scholastic Press',
    374,
    'Dystopian'
),
(
    '9780439023498',
    'https://m.media-amazon.com/images/I/71UIJCq7xJS._UF1000,1000_QL80_.jpg',
    'Catching Fire',
    ARRAY['Suzanne Collins'],
    'Katniss and Peeta face new dangers as their victory in the Hunger Games sparks rebellion across the districts.',
    ARRAY['Young Adult', 'Dystopian', 'Science Fiction'],
    '2009-09-01',
    'Scholastic Press',
    391,
    'Dystopian'
),

-- Toni Morrison
(
    '9781400033416',
    'https://covers.openlibrary.org/b/isbn/9781400033416-L.jpg',
    'Beloved',
    ARRAY['Toni Morrison'],
    'A formerly enslaved woman is haunted by the ghost of the daughter she killed to save her from slavery.',
    ARRAY['Literary Fiction', 'Historical Fiction'],
    '1987-09-02',
    'Alfred A. Knopf',
    324,
    'Literary Fiction'
),
(
    '9781400033423',
    'https://m.media-amazon.com/images/I/71v+8lq1QbL._AC_UF1000,1000_QL80_.jpg',
    'Song of Solomon',
    ARRAY['Toni Morrison'],
    'A young Black man''s journey of self-discovery, tracing his family history back through generations.',
    ARRAY['Literary Fiction'],
    '1977-09-01',
    'Alfred A. Knopf',
    337,
    'Literary Fiction'
),

-- Brandon Sanderson
(
    '9780765326355',
    'https://covers.openlibrary.org/b/isbn/9780765326355-L.jpg',
    'The Way of Kings',
    ARRAY['Brandon Sanderson'],
    'On a war-torn world of stone and storms, a soldier, a scholar, and a king are drawn into an ancient conflict.',
    ARRAY['Fantasy', 'Epic Fantasy'],
    '2010-08-31',
    'Tor Books',
    1007,
    'Epic Fantasy'
),
(
    '9780765350381',
    'https://covers.openlibrary.org/b/isbn/9780765350381-L.jpg',
    'Mistborn: The Final Empire',
    ARRAY['Brandon Sanderson'],
    'A young street thief discovers she has the powers of a Mistborn and joins a crew plotting to overthrow an immortal tyrant.',
    ARRAY['Fantasy', 'Epic Fantasy'],
    '2006-07-17',
    'Tor Books',
    541,
    'Epic Fantasy'
),

-- Greg Rucka
(
    '9781620100077',
    'https://m.media-amazon.com/images/I/51fgVxP1Z9L._AC_UF1000,1000_QL80_.jpg',
    'Whiteout',
    ARRAY['Greg Rucka'],
    'A U.S. Marshal stationed in Antarctica investigates the continent''s first-ever murder amid an approaching storm.',
    ARRAY['Comics', 'Crime', 'Thriller'],
    '1998-01-01',
    'Oni Press',
    128,
    'Graphic Novel'
),
(
    '9781569719465',
    'https://downthetubes.net/wp-content/uploads/2023/08/QC-02-664x1024.jpg',
    'Queen & Country, Volume 1',
    ARRAY['Greg Rucka'],
    'A British intelligence officer navigates dangerous field operations and office politics in this espionage series.',
    ARRAY['Comics', 'Espionage', 'Thriller'],
    '2001-01-01',
    'Oni Press',
    176,
    'Graphic Novel'
),

-- Ta-Nehisi Coates
(
    '9780812993547',
    'https://covers.openlibrary.org/b/isbn/9780812993547-L.jpg',
    'Between the World and Me',
    ARRAY['Ta-Nehisi Coates'],
    'A letter to the author''s teenage son about the reality of being Black in America.',
    ARRAY['Nonfiction', 'Memoir', 'Essay'],
    '2015-07-14',
    'Spiegel & Grau',
    152,
    'Nonfiction'
),
(
    '9780399590597',
    'https://covers.openlibrary.org/b/isbn/9780399590597-L.jpg',
    'The Water Dancer',
    ARRAY['Ta-Nehisi Coates'],
    'A young enslaved man discovers he has a mysterious power that could be the key to the underground war between slaveholders and the enslaved.',
    ARRAY['Historical Fiction', 'Literary Fiction'],
    '2019-09-24',
    'One World',
    416,
    'Historical Fiction'
);
