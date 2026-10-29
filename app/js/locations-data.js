/*
 * Retellings — shared location data
 * Generated from pages/locations.html. Edit here; the interactive book,
 * popup cards, and tour planner all read from this single source.
 *
 * Each location: id, name, category, categoryLabel, stories[] (Dubliners
 * chapters it appears in), image, alt, description, mapLink, lat, lng.
 * Coordinates are approximate central-Dublin positions for the map.
 */

const DUBLINERS_CHAPTERS = [
  "The Sisters",
  "An Encounter",
  "Araby",
  "Eveline",
  "After the Race",
  "Two Gallants",
  "The Boarding House",
  "A Little Cloud",
  "Counterparts",
  "Clay",
  "A Painful Case",
  "Ivy Day in the Committee Room",
  "A Mother",
  "Grace",
  "The Dead"
];

const CHAPTERS = [
  {
    "number": 1,
    "title": "The Sisters",
    "locationIds": [
      "great-britain-street",
      "johnny-rush-s",
      "st-catherine-s-church",
      "marborough-street"
    ],
    "count": 4
  },
  {
    "number": 2,
    "title": "An Encounter",
    "locationIds": [
      "canal-bridge",
      "pigeon-house",
      "north-strand-road",
      "wharf-road",
      "virtiol-works",
      "river-liffey",
      "buckingham-street"
    ],
    "count": 7
  },
  {
    "number": 3,
    "title": "Araby",
    "locationIds": [
      "north-richmond-street",
      "christian-brothers-school",
      "buckingham-street"
    ],
    "count": 3
  },
  {
    "number": 4,
    "title": "Eveline",
    "locationIds": [],
    "count": 0
  },
  {
    "number": 5,
    "title": "After the Race",
    "locationIds": [
      "westland-row-station",
      "naas-road",
      "st-stephen-s-green",
      "trinity-college-dublin"
    ],
    "count": 4
  },
  {
    "number": 6,
    "title": "Two Gallants",
    "locationIds": [
      "dame-street",
      "st-stephen-s-green",
      "rutland-square",
      "dorset-street",
      "baggot-street",
      "donnybrook-tram",
      "trinity-college-dublin",
      "o-connell-bridge",
      "merrion-street",
      "grattan-bridge",
      "earl-street",
      "nassau-street",
      "kildare-street",
      "the-kildare-street-club",
      "hume-street",
      "duke-s-lawn",
      "capel-street",
      "city-hall",
      "george-s-street",
      "westmoreland-street",
      "college-of-surgeons"
    ],
    "count": 21
  },
  {
    "number": 7,
    "title": "The Boarding House",
    "locationIds": [
      "spring-gardens",
      "belfry-of-george-s-church"
    ],
    "count": 2
  },
  {
    "number": 8,
    "title": "A Little Cloud",
    "locationIds": [
      "river-liffey",
      "dame-street",
      "bewley-s",
      "capel-street",
      "george-s-street",
      "north-wall"
    ],
    "count": 6
  },
  {
    "number": 9,
    "title": "Counterparts",
    "locationIds": [
      "dame-street",
      "temple-bar",
      "shelbourne-road",
      "crowe-street",
      "o-connell-bridge",
      "tivoli-theatre",
      "westmoreland-street",
      "o-neill-s-shop",
      "fleet-street"
    ],
    "count": 9
  },
  {
    "number": 10,
    "title": "Clay",
    "locationIds": [
      "dorset-street",
      "nelson-s-pillar"
    ],
    "count": 2
  },
  {
    "number": 11,
    "title": "A Painful Case",
    "locationIds": [
      "river-liffey",
      "baggot-street",
      "lucan-road",
      "chapelizod-bridge"
    ],
    "count": 4
  },
  {
    "number": 12,
    "title": "Ivy Day in the Committee Room",
    "locationIds": [
      "suffolk-street",
      "kavanagh-s"
    ],
    "count": 2
  },
  {
    "number": 13,
    "title": "A Mother",
    "locationIds": [
      "queen-s-theatre",
      "ancient-concert-rooms",
      "ormond-quay"
    ],
    "count": 3
  },
  {
    "number": 14,
    "title": "Grace",
    "locationIds": [
      "crowe-street",
      "dublin-castle",
      "westmoreland-street"
    ],
    "count": 3
  },
  {
    "number": 15,
    "title": "The Dead",
    "locationIds": [
      "trinity-college-dublin",
      "o-connell-bridge",
      "phoenix-park",
      "theatre-royal",
      "port-and-docks",
      "adam-and-eve-s",
      "ancient-concert-rooms",
      "shannon-waves"
    ],
    "count": 8
  }
];

const LOCATIONS = [
  {
    "id": "great-britain-street",
    "name": "Great Britain Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "The Sisters"
    ],
    "image": "assets/GreatBritainSt.png",
    "alt": "Great Britain Street",
    "description": "After the 1891 death of Charles Stewart Parnell, a leading Irish Nationalist, the name was changed from “Great Britain” to “Parnell” Street.",
    "mapLink": "https://maps.app.goo.gl/fqU3AMzcZndKzYGP6",
    "lat": 53.3519,
    "lng": -6.2628
  },
  {
    "id": "canal-bridge",
    "name": "Canal Bridge",
    "category": "waterway",
    "categoryLabel": "Rivers & Canals",
    "stories": [
      "An Encounter"
    ],
    "image": "assets/CanalBridge.png",
    "alt": "Canal Bridge",
    "description": "It’s a bridge crossing the Royal Canal and is generally identified as Newcomen Bridge, in the North Strand area (Nuimgeography, 2019).",
    "mapLink": "https://maps.app.goo.gl/1VkVjncdrfNuaX1w6",
    "lat": 53.3594,
    "lng": -6.2443
  },
  {
    "id": "pigeon-house",
    "name": "Pigeon House",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "An Encounter"
    ],
    "image": "assets/PigeonHouse.png",
    "alt": "Pigeon House",
    "description": "The Pigeon House was the electricity and power station which served the city of Dublin. It is now a deserted port (O’Connor, 1990).",
    "mapLink": "https://maps.app.goo.gl/2M1dDt8zis3TRbtp9",
    "lat": 53.3436,
    "lng": -6.192
  },
  {
    "id": "north-strand-road",
    "name": "North Strand Road",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "An Encounter"
    ],
    "image": "assets/NorthStrand.png",
    "alt": "North Strand Road",
    "description": "North Strand Road is a street in the Northside of Dublin.",
    "mapLink": "https://maps.app.goo.gl/UaiCTewAjNrN45FF8",
    "lat": 53.3579,
    "lng": -6.2446
  },
  {
    "id": "wharf-road",
    "name": "Wharf Road",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "An Encounter"
    ],
    "image": "assets/WharfRoad.png",
    "alt": "Wharf Road",
    "description": "The Wharf Road, now East Wall Road, is a road that runs along the top of the wall built to keep the River Tolka on course on its way to the sea so that it doesn’t flood the city’s northern-eastern neighborhoods and industrial complexes.",
    "mapLink": "https://maps.app.goo.gl/xeFEZh6ypFLhLqCa6",
    "lat": 53.3524,
    "lng": -6.236
  },
  {
    "id": "north-richmond-street",
    "name": "North Richmond Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Araby"
    ],
    "image": "assets/RiverLiffey.png",
    "alt": "River Liffey",
    "description": "North Richmond Street is a quiet cul-de-sac on Dublin’s north side and forms the opening setting of Araby. Joyce uses it to establish the confined domestic world of the narrator before his journey toward the bazaar begins.",
    "mapLink": "https://maps.app.goo.gl/WMqrf22SxW1bbe7j7",
    "lat": 53.3586,
    "lng": -6.2517
  },
  {
    "id": "virtiol-works",
    "name": "Virtiol Works",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "An Encounter"
    ],
    "image": "assets/virtiolworks.png",
    "alt": "section of the 'Plan of the City of Dublin' map showing were the Virtiol Works building used to be.",
    "description": "Vitriol (sulphuric acid) was used for bleaching linen cloth from the mid-18th century onward.",
    "mapLink": "https://maps.app.goo.gl/UaiCTewAjNrN45FF8",
    "lat": 53.3607,
    "lng": -6.2456
  },
  {
    "id": "river-liffey",
    "name": "River Liffey",
    "category": "waterway",
    "categoryLabel": "Rivers & Canals",
    "stories": [
      "An Encounter",
      "A Little Cloud",
      "A Painful Case"
    ],
    "image": "assets/RiverLiffey.png",
    "alt": "River Liffey",
    "description": "The Liffey is Dublin's main river, cutting through the heart of the city and splitting it into a northern and southern half.",
    "mapLink": "https://maps.app.goo.gl/v3opxChXTQK1Joyw9",
    "lat": 53.3466,
    "lng": -6.2595
  },
  {
    "id": "christian-brothers-school",
    "name": "Christian Brothers School",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "Araby"
    ],
    "image": "assets/christianbrothersschool.jpg",
    "alt": "River Liffey",
    "description": "The Christian Brothers’ School on North Richmond Street is mentioned in Araby and also appears in Ivy Day in the Committee Room. It reflects the strong presence of Catholic education in everyday Dublin life during Joyce’s time.",
    "mapLink": "https://maps.app.goo.gl/9sJfv4pR14egPqmY8",
    "lat": 53.3589,
    "lng": -6.252
  },
  {
    "id": "buckingham-street",
    "name": "Buckingham Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "An Encounter",
      "Araby"
    ],
    "image": "assets/buckinghamstreet.png",
    "alt": "Section of Letts, Son & Co. 1883 Plan of the city of Dublin map showing the entire length of Buckingham Street and the Railway Terminus. Made available at the David Rumsey Map Collection online",
    "description": "Buckingham Street lies on the north side of Dublin and forms part of the boy’s route toward the bazaar in Araby. The street helps trace his movement from a quiet residential neighborhood into the wider city.",
    "mapLink": "https://maps.app.goo.gl/nZrJ7tstfd4RpQj29",
    "lat": 53.3543,
    "lng": -6.2472
  },
  {
    "id": "westland-row-station",
    "name": "Westland Row Station",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "After the Race"
    ],
    "image": "assets/westlandrowstation.jpg",
    "alt": "A modern-day photo of the former Westland Row train station",
    "description": "Westland Row Station appears in both Araby and After the Race as a point of travel and departure. It represents Dublin’s growing modern transport network at the turn of the twentieth century.",
    "mapLink": "https://maps.app.goo.gl/moShyem36XMLYs5g6",
    "lat": 53.3434,
    "lng": -6.2492
  },
  {
    "id": "naas-road",
    "name": "Naas Road",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "After the Race"
    ],
    "image": "assets/naasroad.jpg",
    "alt": "A modern-day photo of Naas road",
    "description": "Naas Road forms the western approach into Dublin and is mentioned in After the Race. The racing cars travel along this road as they speed toward the city, symbolizing modernity and excitement.",
    "mapLink": "https://maps.app.goo.gl/AFq6dy5kSrfu6t3N7",
    "lat": 53.3253,
    "lng": -6.3399
  },
  {
    "id": "dame-street",
    "name": "Dame Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Two Gallants",
      "A Little Cloud",
      "Counterparts"
    ],
    "image": "assets/damestreet.jpg",
    "alt": "A modern-day photo of Dame street.",
    "description": "Dame Street is one of Dublin’s major city-centre streets and a hub of commercial activity. In Two Gallants and A Little Cloud, it forms part of the busy urban landscape through which the characters move.",
    "mapLink": "https://maps.app.goo.gl/GPGYjr6VuWb1AWgo7",
    "lat": 53.3441,
    "lng": -6.266
  },
  {
    "id": "st-stephen-s-green",
    "name": "St Stephen’s Green",
    "category": "park",
    "categoryLabel": "Parks",
    "stories": [
      "After the Race",
      "Two Gallants"
    ],
    "image": "assets/stephensgreen.png",
    "alt": "Detroit Publishing Co. St Stephen’s Green Park, Dublin, County Dublin, Ireland (LC-DIG-ppmsc-009877), c. 1890-1900. Library of Congress, Washington, D.C.",
    "description": "St Stephen’s Green is Dublin’s best-known public park and a landmark in the city centre. In Two Gallants, Lenehan passes through the park during his wanderings across Dublin.",
    "mapLink": "https://maps.app.goo.gl/m1fxGSbXZyt5tp2F8",
    "lat": 53.3381,
    "lng": -6.259
  },
  {
    "id": "rutland-square",
    "name": "Rutland Square",
    "category": "park",
    "categoryLabel": "Parks",
    "stories": [
      "Two Gallants"
    ],
    "image": "assets/rutlandsquare.jpg",
    "alt": "Rutland Square and Rutland Square Church in black and white.",
    "description": "Rutland Square is the first location mentioned in Two Gallants. Its Georgian setting reflects the faded elegance of nineteenth-century Dublin. It was renamed to Parnell Square in 1933 and features the Garden of Rememberance park.",
    "mapLink": "https://maps.app.goo.gl/zagjrejDbUT7pxSE9",
    "lat": 53.3531,
    "lng": -6.2635
  },
  {
    "id": "dorset-street",
    "name": "Dorset Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Two Gallants",
      "Clay"
    ],
    "image": "assets/dorsetstreet.jpg",
    "alt": "Eason & Son. View of a Dublin Street (Dorset Street), Drumcondra, Co. Dublin. 1900.",
    "description": "Dorset Street is a busy northside street in Dublin and appears early in Two Gallants. It forms part of the route taken by the characters as they walk through the city.",
    "mapLink": null,
    "lat": 53.3573,
    "lng": -6.265
  },
  {
    "id": "baggot-street",
    "name": "Baggot Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Two Gallants",
      "A Painful Case"
    ],
    "image": "assets/baggotstreet.jpg",
    "alt": "A row of houses in Lower Baggot Street, Dublin",
    "description": "Baggot St. runs southeast from St. Stephen’s Green to the Grand Canal.",
    "mapLink": "https://maps.app.goo.gl/iztuQnuKXGnmfLtt6",
    "lat": 53.3363,
    "lng": -6.2497
  },
  {
    "id": "donnybrook-tram",
    "name": "Donnybrook Tram",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "Two Gallants"
    ],
    "image": "assets/donnybrooktram.jpg",
    "alt": "Dublin Tram No. 26 on route to the Donnybrook tramway",
    "description": "The Donnybrook tram line was launched in 1873, it connected Merion Square to Donnybrook’s southern terminus. The Donnybrook tramway is no longer in operation, but is now used as the Donnybrook Bus Garage.",
    "mapLink": "https://maps.app.goo.gl/74gJQDgERBcu3NtM9",
    "lat": 53.3222,
    "lng": -6.2322
  },
  {
    "id": "trinity-college-dublin",
    "name": "Trinity College Dublin",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "After the Race",
      "Two Gallants",
      "The Dead"
    ],
    "image": "assets/trinitycollege.jpg",
    "alt": "Trinity College Dublin, late 19th century",
    "description": "Trinity College was founded in 1592 by Elizabeth I. It was built upon the grounds of All Hallows, a former Augustinian priory that had been dissolved during the Reformation.",
    "mapLink": "https://maps.app.goo.gl/eKxH9ADKXphahcSD9",
    "lat": 53.3438,
    "lng": -6.2546
  },
  {
    "id": "temple-bar",
    "name": "Temple Bar",
    "category": "rest-pub",
    "categoryLabel": "Restaurants & Pubs",
    "stories": [
      "Counterparts"
    ],
    "image": "assets/TempleBar.jpg",
    "alt": "The Temple Bar Pub on Temple Lane, Dublin, photographed in 2008",
    "description": "Temple Bar is an area on the south bank of the River Liffey in central Dublin, lined with pubs and restaurants. Farrington moves through this zone on his drinking crawl. Today it’s best known as the city’s main tourist and nightlife district.",
    "mapLink": "https://maps.app.goo.gl/4PrTkDyaBF5Q4enV6",
    "lat": 53.3453,
    "lng": -6.2635
  },
  {
    "id": "shelbourne-road",
    "name": "Shelbourne Road",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Counterparts"
    ],
    "image": "assets/ShelbourneRoad.jpg",
    "alt": "Shelbourne House on Shelbourne Road, Dublin, photographed in 2023",
    "description": "Shelbourne Road is a “lower-middle-class” residential street in Ballsbridge, connecting Merrion Road toward the Bath Avenue/Haddington Road area. It's where Farrington exits the tram at the end of his exhausting night.",
    "mapLink": "https://maps.app.goo.gl/YssN8pKivxZuEr9K8",
    "lat": 53.3331,
    "lng": -6.2309
  },
  {
    "id": "nelson-s-pillar",
    "name": "Nelson's Pillar",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "Clay"
    ],
    "image": "assets/Nelson_s_Pillar.jpg",
    "alt": "Nelson's Pillar on Sackville-Street, Dublin, 1829",
    "description": "Nelson’s Pillar stood on O’Connell Street and was a major city-centre landmark and meeting point, shaping how people navigated central Dublin. It was destroyed in 1966.",
    "mapLink": "https://maps.app.goo.gl/U7yptH7RbLzMgnP26",
    "lat": 53.3497,
    "lng": -6.2603
  },
  {
    "id": "lucan-road",
    "name": "Lucan Road",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "A Painful Case"
    ],
    "image": "assets/LucanBridge.jpg",
    "alt": "Lucan Bridge and surrounds, 1814",
    "description": "The Lucan Road runs westward along the south side of the Liffey, connecting Chapelizod to Lucan, the town to the city. Its westward direction connotes a departure, an escape from the city.",
    "mapLink": "https://maps.app.goo.gl/bk4SKWinZJho6wLi9",
    "lat": 53.357,
    "lng": -6.361
  },
  {
    "id": "crowe-street",
    "name": "Crowe Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Counterparts",
      "Grace"
    ],
    "image": "assets/CroweStreet.jpeg",
    "alt": "Crowe Street in Dublin, photographed in 2026",
    "description": "Crowe Street is located in the Temple Bar area south of the River Liffey. In Grace, it is the location of Tom Kernan’s workplace in the city.",
    "mapLink": "https://maps.app.goo.gl/xeVAenYKyEd8WPrs7",
    "lat": 53.3452,
    "lng": -6.2625
  },
  {
    "id": "suffolk-street",
    "name": "Suffolk Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Ivy Day in the Committee Room"
    ],
    "image": "assets/SuffolkStreet.jpg",
    "alt": "Suffolk Street entrance to the head office of National Bank Ltd., 1926",
    "description": "Suffolk Street is a short street connecting the Grafton Street area with St Andrew’s Street. In Ivy Day in the Committee Room, it serves as a meeting point within Dublin’s political city centre.",
    "mapLink": "https://maps.app.goo.gl/k3oEHJTmghJsFNf28",
    "lat": 53.3434,
    "lng": -6.2603
  },
  {
    "id": "o-connell-bridge",
    "name": "O’Connell Bridge",
    "category": "waterway",
    "categoryLabel": "Rivers & Canals",
    "stories": [
      "Two Gallants",
      "Counterparts",
      "The Dead"
    ],
    "image": "assets/OConnellBridge.jpg",
    "alt": "O'Connell Bridge, Dublin, photographed in 2005",
    "description": "O’Connell Bridge is one of Dublin’s central bridges connecting the north and south sides of the city. It appears in both Counterparts and The Dead, marking an important crossing point in Joyce’s Dublin.",
    "mapLink": "https://maps.app.goo.gl/i6RqpANZ7QvAUoj78",
    "lat": 53.3473,
    "lng": -6.2592
  },
  {
    "id": "phoenix-park",
    "name": "Phoenix Park",
    "category": "park",
    "categoryLabel": "Parks",
    "stories": [
      "The Dead"
    ],
    "image": "assets/PhoenixPark.jpg",
    "alt": "Phoenix Park, Dublin, photographed in 2011",
    "description": "A 17th-century, 707-hectare park, created for royal hunting, mentioned as “the Park”, the Parkgate in the Dubliners.",
    "mapLink": "https://maps.app.goo.gl/VcZa8zjNFVvhZBxD7",
    "lat": 53.3559,
    "lng": -6.3298
  },
  {
    "id": "johnny-rush-s",
    "name": "Johnny Rush’s",
    "category": "rest-pub",
    "categoryLabel": "Restaurants & Pubs",
    "stories": [
      "The Sisters"
    ],
    "image": "assets/JohnnyRushs.jpg",
    "alt": "The exterior of the pub Johnny Rush's, Dublin",
    "description": "Johnny Rush’s is a pub, located on South William St., Historically, it was a real business located near Findlater’s place.",
    "mapLink": "https://maps.app.goo.gl/sKKSqnhexQJwHi9k8",
    "lat": 53.3417,
    "lng": -6.2626
  },
  {
    "id": "bewley-s",
    "name": "Bewley’s",
    "category": "rest-pub",
    "categoryLabel": "Restaurants & Pubs",
    "stories": [
      "A Little Cloud"
    ],
    "image": "assets/Bewleys.jpg",
    "alt": "The exterior of Bewley's cafe on Grafton's Street, Dublin",
    "description": "A cafe, located in Grafton Street, which was frequented by Irish literary and artistic figures, including James Joyce.",
    "mapLink": "https://maps.app.goo.gl/hBRDgzzapSicGpW39",
    "lat": 53.3413,
    "lng": -6.2601
  },
  {
    "id": "theatre-royal",
    "name": "Theatre Royal",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "The Dead"
    ],
    "image": "assets/TheatreRoyal.jpg",
    "alt": "Theatre Royal, Hawkins Street, Dublin, photographed between 1910-1930",
    "description": "One of three major early 20th-century Dublin theatres, it was primarily used for dramatic presentations. It was demolished in 1962.",
    "mapLink": "https://maps.app.goo.gl/rxdo7cdNqb5UzcwDA",
    "lat": 53.3464,
    "lng": -6.2567
  },
  {
    "id": "port-and-docks",
    "name": "Port and Docks",
    "category": "waterway",
    "categoryLabel": "Rivers & Canals",
    "stories": [
      "The Dead"
    ],
    "image": "assets/portanddock.jpg",
    "alt": "This photo of the North Wall shows some of the docks and ports along the eastern end of the Liffey. Photographed by Robert French between 1865 and 1914.",
    "description": "Also known as Dublin Port, established in 1707 and was headquartered at different places along the Liffey river.",
    "mapLink": "https://maps.app.goo.gl/R3jm5drynADhb9UbA",
    "lat": 53.3478,
    "lng": -6.2208
  },
  {
    "id": "queen-s-theatre",
    "name": "Queen’s Theatre",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "A Mother"
    ],
    "image": "assets/Queenstheater.jpg",
    "alt": "The Queen's Theatre, Dublin was built on the site of several previous buildings of entertainment.",
    "description": "The theatre, often called simply the Queen’s Theatre or the Queen’s, was characteristically known as a venue for comic and musical acts. In 1969, the theatre was demolished.",
    "mapLink": "https://maps.app.goo.gl/zsMyLGABFSabmHu96",
    "lat": 53.3448,
    "lng": -6.2538
  },
  {
    "id": "chapelizod-bridge",
    "name": "Chapelizod Bridge",
    "category": "rest-pub",
    "categoryLabel": "Restaurants & Pubs",
    "stories": [
      "A Painful Case"
    ],
    "image": "assets/Chapelizodbridge.png",
    "alt": "Screenshot of the Google Maps version showing the Chapelizod Bridge.",
    "description": "It is the unnamed pub only distinguished in the story by its location at the Chapelizod bridge, with its connotations of romance and history, that offers Duffy the ability to feel tenderly.",
    "mapLink": "https://maps.app.goo.gl/wmoZizpuKQ2Kyy1J9",
    "lat": 53.3556,
    "lng": -6.3497
  },
  {
    "id": "adam-and-eve-s",
    "name": "Adam and Eve’s",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "The Dead"
    ],
    "image": "assets/Adamandeves.jpg",
    "alt": "Adam and Eve’s (Church of the Immaculate Conception) as seen from the south bank of the Liffey in Merchant’s Quay. Photograph by Jasmine Mulliken, May 31, 2015.",
    "description": "Adam and Eve’s, the Fransiscan church was, from 1889 on, officially the Church of the Immaculate Conception.",
    "mapLink": "https://maps.app.goo.gl/WcBJPCJXdCNkDHrS8",
    "lat": 53.3448,
    "lng": -6.272
  },
  {
    "id": "ancient-concert-rooms",
    "name": "Ancient Concert Rooms",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "A Mother",
      "The Dead"
    ],
    "image": "assets/antientconcertroomsbefore.jpg",
    "alt": "Antient Concert Rooms building. From archiseek.",
    "description": "The Antient Concert Rooms at 52 Pearse Street was demolished in the mid-20th century. Today, the site has been replaced by office buildings and facilities used by Trinity College Dublin.",
    "mapLink": null,
    "lat": 53.3443,
    "lng": -6.2505
  },
  {
    "id": "ormond-quay",
    "name": "Ormond Quay",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "A Mother"
    ],
    "image": "assets/ormondquay.jpg",
    "alt": "View of the River Liffey and Ormond Quay, Lower, taken from south quays].” Photograph by J.J. Clarke. From the Clarke Photographic Collection at the National Library of Ireland.",
    "description": "Ormond Quay is one of many waterfront spans of street lining the Liffey in central Dublin. Situated on the north bank, its upper (western) and lower (eastern) sections are bisected by Capel Street as it becomes Grattan Bridge.",
    "mapLink": "https://maps.app.goo.gl/ib8YjNd2URZ7ueBo6",
    "lat": 53.3464,
    "lng": -6.266
  },
  {
    "id": "merrion-street",
    "name": "Merrion Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Two Gallants"
    ],
    "image": "assets/merrionstreet.png",
    "alt": "A section of an 1883 Letts Sns & Co. “Plan of the City of Dubln” map showing Merrion Street and Merrion Square. From the online David Rumsey Historical Map Collection.",
    "description": "In Joyce’s time, Merrion Street was lined with Georgian townhouses built after Leinster House in 1748. Corley likely worked in one of these affluent homes.",
    "mapLink": "https://maps.app.goo.gl/7vpDfuc1ZKLYUcaS6",
    "lat": 53.3395,
    "lng": -6.2501
  },
  {
    "id": "grattan-bridge",
    "name": "Grattan Bridge",
    "category": "waterway",
    "categoryLabel": "Rivers & Canals",
    "stories": [
      "Two Gallants"
    ],
    "image": "assets/Grattan-Bridge.jpg",
    "alt": "Grattan Bridge, Dublin City, Co. Dublin, photographed by Robert French between 1865 and 1914. From the Lawrence Photograph Collection at the National Library of Ireland.",
    "description": "Grattan Bridge crosses the Liffey and joins Capel Street to Parliament Street; originally known as Essex Bridge before later rebuilds/renaming.",
    "mapLink": "https://maps.app.goo.gl/PrTPcTFCYqLZhkou7",
    "lat": 53.3458,
    "lng": -6.2666
  },
  {
    "id": "dublin-castle",
    "name": "Dublin Castle",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "Grace"
    ],
    "image": "assets/dublincastle.jpg",
    "alt": "Dublin Castle, Dublin City, Co. Dublin, photographed by Robert French between 1865 and 1914. From the Lawrence Photograph Collection at the National Library of Ireland.",
    "description": "Situated in the heart of Dublin in Dame Street. A 13th-century structure built on Viking ruins and served as the headquarters of British administration in Ireland for over 700 years.",
    "mapLink": "https://maps.app.goo.gl/7Wuv9ZJLQhrHzBZ99",
    "lat": 53.3429,
    "lng": -6.2674
  },
  {
    "id": "shannon-waves",
    "name": "Shannon Waves",
    "category": "waterway",
    "categoryLabel": "Rivers & Canals",
    "stories": [
      "The Dead"
    ],
    "image": "assets/Shannonwaves.jpg",
    "alt": "Shannon River, Foynes, Co. Limerick, photographed between 1865 and 1914 by Robert French. From the Lawrence Photograph Collection at the National Library of Ireland.",
    "description": "Refers to River Shannon, located in the west of Ireland , flows southward from the Cuilcagh Mountains in County Cavan to the Atlantic Ocean, passing through 11 counties.",
    "mapLink": "https://maps.app.goo.gl/rnSMDirZdiyf6nE56",
    "lat": 52.6647,
    "lng": -8.6231
  },
  {
    "id": "tivoli-theatre",
    "name": "Tivoli Theatre",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "Counterparts"
    ],
    "image": "assets/tivolitheatre.jpg",
    "alt": "The Tivoli Theatre on Burgh Quay, on the south bank of the Liffey. The theatre would have been a block north of Mulligan’s and a block east of the Scotch House. Photographed between 1901 and 1914 by Robert French, from the National Library of Ireland’s Lawrence Photograph Collection.",
    "description": "Formerly The Grand Lyric Hall / Lyric Theatre of Varieties, the Tivoli Theatre was located in Burgh Quay on the south bank of the Liffey, was later acquired by the Irish Press newspaper group in 1930.",
    "mapLink": "https://maps.app.goo.gl/az9ZcZHU3eof7mf4A",
    "lat": 53.3466,
    "lng": -6.256
  },
  {
    "id": "kavanagh-s",
    "name": "Kavanagh’s",
    "category": "rest-pub",
    "categoryLabel": "Restaurants & Pubs",
    "stories": [
      "Ivy Day in the Committee Room"
    ],
    "image": "assets/kavanagh.jpg",
    "alt": "This would have been just a couple doors down from Kavanagh’s. Photo taken between 1860 and 1883 by James Simonton or Frederick Holland Mares, held by the National Library of Ireland as part of the Stereo Pairs Photograph Collection.",
    "description": "A spot for political, under-the-table deals, located in Parliament Street, between Essex and Dame Streets, south of Liffey.",
    "mapLink": "https://maps.app.goo.gl/dCTr3DbnuepAsLkJ9",
    "lat": 53.3446,
    "lng": -6.2668
  },
  {
    "id": "st-catherine-s-church",
    "name": "St Catherine’s Church",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "The Sisters"
    ],
    "image": "assets/catherines.jpg",
    "alt": "View of Hardwicke Street from North Frederick Street End, Drumcondra, Co. Dublin” from the National Library of Ireland’s Eason Photograph Collection. Photograph ca. 1900-1939.",
    "description": "St. Catherine’s is a Roman Catholic church on Meath Street, situated around the corner from St. Catherine’s in Thomas Street.",
    "mapLink": "https://maps.app.goo.gl/QvbYYMYavrafhaRp7",
    "lat": 53.3417,
    "lng": -6.2791
  },
  {
    "id": "earl-street",
    "name": "Earl Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Two Gallants"
    ],
    "image": "assets/earlstreet.jpg",
    "alt": "Earl Street. photograph by Robert French from National Library of Ireland’s digitized Lawrence Collection at https://catalogue.nli.ie/Record/vtls000040954",
    "description": "Earl Street is located near the Liffey, running between Sackville (O’Connell) Street and Marlborough Street.",
    "mapLink": "https://maps.app.goo.gl/b5XRvz1RQkM8VJJh7",
    "lat": 53.3501,
    "lng": -6.2585
  },
  {
    "id": "nassau-street",
    "name": "Nassau Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Two Gallants"
    ],
    "image": "assets/NassauSt.png",
    "alt": "Trams and pedestrians on Nassau Street, viewed from Grafton Street.  Photograph in 1900, Public Domain",
    "description": "A prosperous shopping street running along Trinity College’s southern boundary. Built on the former site of the 17th century St. Patrick’s Well Lane.",
    "mapLink": "https://maps.app.goo.gl/F7LJ1has6XaVkxKG7",
    "lat": 53.3428,
    "lng": -6.2557
  },
  {
    "id": "kildare-street",
    "name": "Kildare Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Two Gallants"
    ],
    "image": "assets/KildareSt.jpg",
    "alt": "A Daimler being driven up Kildare Street, with lots of bystanders, and an almost photobomber in view. Photograped by J.J. Clarke. Clarke Photographic Collection",
    "description": "Runs south from Nassau St., to the north side of St. Stephen’s Green. Home to the exclusive Kildare Street Club.",
    "mapLink": "https://maps.app.goo.gl/FvWzZgDor4XsVhTB6",
    "lat": 53.3406,
    "lng": -6.2561
  },
  {
    "id": "the-kildare-street-club",
    "name": "The Kildare Street Club",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "Two Gallants"
    ],
    "image": "assets/KildareStClub.jpg",
    "alt": "the junction of Kildare St. and Nassau St, with the Kildare Street Club in the middle of the shot. Robert French Collection and Lawrence Photograph Collection. Catalogue range c.1880-1900",
    "description": "An exclusive men’s club in Joyce’s time, predominantly Protestant and Anglo-Irish in membership, located at the corner of Nassau St. and Kildare St.",
    "mapLink": "https://maps.app.goo.gl/Kq3twijfx8hSyFTp8",
    "lat": 53.3418,
    "lng": -6.2557
  },
  {
    "id": "hume-street",
    "name": "Hume Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Two Gallants"
    ],
    "image": "assets/HumeSt.jpg",
    "alt": "Corner of Hume Street and St Stephen's Green c1968, demolished and fascimile buildings put in its place. Dublin Corporation Photographic Collection",
    "description": "An elegant red-brick Georgian street, running east from St. Stephen’s Green approximately fifty yards from the northeast corner of the park.",
    "mapLink": "https://maps.app.goo.gl/DkwFDBcuz1drB1V78",
    "lat": 53.3376,
    "lng": -6.2561
  },
  {
    "id": "duke-s-lawn",
    "name": "Duke’s Lawn",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "Two Gallants"
    ],
    "image": "assets/LeinsterHouse.jpg",
    "alt": "Drawing of Leinster House included as a vignette within an illustration by John Roque in 1757",
    "description": "Also known as Leinster House, Duke’s Lawn is located at the Leinster House which was the former ducal residence of the Duke of Leinster. In 1922 it was turned into the parliament building of the Irish Free State before it became the Republic of Ireland.",
    "mapLink": "https://maps.app.goo.gl/dD7A25vNZdTL9frm6",
    "lat": 53.3407,
    "lng": -6.2537
  },
  {
    "id": "capel-street",
    "name": "Capel Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Two Gallants",
      "A Little Cloud"
    ],
    "image": "assets/CapelSt.jpg",
    "alt": "A photograph of Capel Street, Dublin, photographed by James P. O'Dea in 1960.National Library of Ireland.",
    "description": "Capel Street is a shopping thoroughfare a few blocks away from O’Connell Street. In the 17th century, it was an integral part to Dublin’s expansion north of the River Liffey. Modern-day Capel Street has been transformed into one of the most unique commercial streets in the city centre.",
    "mapLink": "https://maps.app.goo.gl/QC7K9s749KGQ9xZy5",
    "lat": 53.3472,
    "lng": -6.267
  },
  {
    "id": "city-hall",
    "name": "City Hall",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "Two Gallants"
    ],
    "image": "assets/CityHall.jpg",
    "alt": "An 18th century coloured engraving of the Royal Exchange in Dame Street, Dublin (now the City Hall), from James Malton's 'Views of Dublin' (1780), public domain",
    "description": "Built on Dame Street by the Guild of Merchants from 1769 to 1779. City hall was built in the style of Georgian architecture featuring murals, ornate marble floors and statues. Before it became City Hall it was known as the Royal Exchange and was the epicentre of trade for Dublin’s merchants.",
    "mapLink": "https://maps.app.goo.gl/zkbaH6uEHreameHU8",
    "lat": 53.3437,
    "lng": -6.2672
  },
  {
    "id": "george-s-street",
    "name": "George's Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Two Gallants",
      "A Little Cloud"
    ],
    "image": "assets/georgesSt.jpg",
    "alt": "A photograph of South City Market, George's Street, Dublin, photographed by Robert French, 1881-1899. National Library of Ireland.",
    "description": "George’s Street is home to the George’s Street Arcade and is one of Ireland’s first purpose-built shopping centres. It’s also one of Europe's oldest shopping centres having been built in 1881.",
    "mapLink": "https://maps.app.goo.gl/cjEDpK7D26vqpEHfA",
    "lat": 53.3421,
    "lng": -6.2644
  },
  {
    "id": "westmoreland-street",
    "name": "Westmoreland Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Two Gallants",
      "Counterparts",
      "Grace"
    ],
    "image": "assets/WestmorlandSt.jpg",
    "alt": "Westmoreland St., Dublin, photographed by Robert French between 1865 and 1914. National Library of Ireland’s Lawrence Photograph Collection.",
    "description": "Westmoreland Street links O’Connell Bridge and College Green in central Dublin. It is named after John Fane, 10th Earl of Westmorland, Lord Lieutenant of Ireland from 1789 to 1794.",
    "mapLink": "https://maps.app.goo.gl/JjYSuAdxRrYtyQey5",
    "lat": 53.3459,
    "lng": -6.2588
  },
  {
    "id": "college-of-surgeons",
    "name": "College of Surgeons",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "Two Gallants"
    ],
    "image": "assets/collegeofsurgeons.jpg",
    "alt": "Lithographed from a drawing by Bernard Mulrenin. The drawing was made from the perspective of the statue of Lord Aldilaun, which sits across the lane from the college, 1828. National Library of Ireland",
    "description": "The Royal College of Surgeons in Ireland (RCSI), founded in 1784, is a leading medical and educational institution and the national body for surgery in Ireland. Its historic building is located near St Stephen’s Green.",
    "mapLink": "https://maps.app.goo.gl/ntKPHN8UtfPFuXyo6",
    "lat": 53.3389,
    "lng": -6.262
  },
  {
    "id": "spring-gardens",
    "name": "Spring Gardens",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "The Boarding House"
    ],
    "image": "assets/SpringGardensLane.jpg",
    "alt": "Screenshot of the section of the 1883 Letts, Son & Co. “Plan of the city of Dublin” map. Spring Gardens is the street above Bay View Avenue and below the Chemical Works",
    "description": "Spring Garden is a northside area off North Strand Road, sitting between the Royal Canal and the River Tolka. Today it survives as Spring Garden Lane. Joyce uses it as a social anchor, placing Mrs. Mooney’s butcher shop nearby to root her story in Dublin’s working-class northside.",
    "mapLink": "https://maps.app.goo.gl/4dZ1RNuFgUoo3Ya39",
    "lat": 53.3588,
    "lng": -6.244
  },
  {
    "id": "belfry-of-george-s-church",
    "name": "Belfry of George's Church",
    "category": "building",
    "categoryLabel": "Historic Buildings",
    "stories": [
      "The Boarding House"
    ],
    "image": "assets/stgeorgechurch.jpg",
    "alt": "A Black-and-white aerial view of St. George’s Church, Balbriggan, surrounded by trees and a small graveyard,",
    "description": "St George’s Church is a notable historic church site located at Hardwicke Place, in the north inner city. It was famous for its bells, which serve as a potent audio presence in the life of the city in Joyce’s novels.",
    "mapLink": "https://maps.app.goo.gl/UYGaQicyYmMhTLBFA",
    "lat": 53.3562,
    "lng": -6.2627
  },
  {
    "id": "marborough-street",
    "name": "Marborough Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "The Sisters"
    ],
    "image": "assets/marlboroughSt.jpg",
    "alt": "A Black-and-white street scene showing people and storefronts in Marlborough Street, 1963 - geograph.org.uk",
    "description": "Marlborough Street is a north inner city street running parallel and just east of O’Connell Street, best known as the location of St Mary’s Pro-Cathedral. The street remains busy today, close to the city’s main transit and footfall corridor.",
    "mapLink": "https://maps.app.goo.gl/PRfLMU9HyjsmQ1kv6",
    "lat": 53.3496,
    "lng": -6.2576
  },
  {
    "id": "north-wall",
    "name": "North Wall",
    "category": "waterway",
    "categoryLabel": "Rivers & Canals",
    "stories": [
      "A Little Cloud"
    ],
    "image": "assets/northWall.jpg",
    "alt": "Modern waterfront cityscape with office buildings of Dublin North Wall Quey, photographed by DXR",
    "description": "The North Wall area is historically a departure point, closely associated with Dublin’s docklands and emigration. It sits within the port-side zone running from the Custom House eastward toward Dublin Port along the north bank of the Liffey.",
    "mapLink": "https://maps.app.goo.gl/wTr3RDyFL74EHPdVA",
    "lat": 53.3485,
    "lng": -6.2375
  },
  {
    "id": "o-neill-s-shop",
    "name": "O’Neill’s Shop",
    "category": "rest-pub",
    "categoryLabel": "Restaurants & Pubs",
    "stories": [
      "Counterparts"
    ],
    "image": "assets/ONeills.jpg",
    "alt": "A storefront view of Dublin O'Neill's Bar and Restaurant, located on Suffolk Street, photographed by J.-H. Janßen",
    "description": "O’Neill's is a pub on Suffolk Street as part of the city-centre drinking network. It’s where the character Farrington slips into “the dark snug of O’Neill's shop” for a glass of plain porter.",
    "mapLink": "https://maps.app.goo.gl/TajGhFXjGH9VKS738",
    "lat": 53.3433,
    "lng": -6.2607
  },
  {
    "id": "fleet-street",
    "name": "Fleet Street",
    "category": "street",
    "categoryLabel": "Streets",
    "stories": [
      "Counterparts"
    ],
    "image": "assets/fleetst.jpg",
    "alt": "Cobblestone Fleet street lined with restaurants and buildings - geograph.org.uk",
    "description": "Fleet Street sits within the central commercial core, close to the Temple Bar and Dame Street corridors. It’s where Joyce places the Terry Kelly’s Pawn Office, anchoring Farrington's desperation in a real, transactional part of the city.",
    "mapLink": "https://maps.app.goo.gl/K881LR34KQC3hozU7",
    "lat": 53.3459,
    "lng": -6.26
  }
];

// expose for non-module scripts
if (typeof window !== 'undefined') {
  window.LOCATIONS = LOCATIONS;
  window.CHAPTERS = CHAPTERS;
  window.DUBLINERS_CHAPTERS = DUBLINERS_CHAPTERS;
}
