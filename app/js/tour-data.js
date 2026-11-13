/*
 * Retellings — the suggested walking tour
 * Our curated seven-stop walk (originally the Walking Tour page), kept as a
 * preset visitors can load into their own tour. Four stops are places outside
 * the book's gazetteer (TOUR_PLACES); every stop has an audio guide (TOUR_GUIDES).
 * Generated from the old walking-tour.html.
 */
const TOUR_PLACES = [
  {
    "id": "james-joyce-centre",
    "name": "James Joyce Centre",
    "category": "tour",
    "categoryLabel": "Walking tour stop",
    "stories": [],
    "image": "assets/JJCenter_then-now.JPG",
    "alt": "James Joyce Center then and now",
    "description": "The James Joyce Center is a restored Georgian townhouse near the childhood home of James Joyce. Full of exhibitions, readings, lectures, and promoting Joyce's other works. It's a great place to get your bearings and expand your knowledge on the Irish famed author. Open from 10:30 AM to 4:30 PM Tuesday through Saturday. Tickets are €7 for adults, €5 for seniors and students (with a valid student ID) and free for children 12 and under.",
    "mapLink": null,
    "lat": 53.3546,
    "lng": -6.26
  },
  {
    "id": "secret-book-and-record-store",
    "name": "The Secret Book and Record Store",
    "category": "tour",
    "categoryLabel": "Walking tour stop",
    "stories": [],
    "image": "assets/Bookshop_then-now.jpg",
    "alt": "The Secret Book and Record Store then and now",
    "description": "Tucked in between several shops and restaurants on Wicklow Street visit this cosy, independent bookstore offering new and secondhand books at an affordable price with CDs and vinyl. Pick up your own James Joyce!",
    "mapLink": null,
    "lat": 53.3423,
    "lng": -6.261
  },
  {
    "id": "museum-of-literature-ireland",
    "name": "Museum of Literature Ireland (MoLI)",
    "category": "tour",
    "categoryLabel": "Walking tour stop",
    "stories": [],
    "image": "assets/MoLi.JPG",
    "alt": "A current image of the Museum of Literature, Dublin",
    "description": "If you were able to find the statue of James Joyce, turn around, exit the park and right in front of you, you'll find the entrance to the Museum of Literature Ireland. The Museum of Literature Ireland, celebrates Irish writers featuring not only James Joyce, but Oscar Wilde, Mary Murphy, and more! Visit the permanent exhibit \"Dear, Dirty Dublin\" a 3D experience of Dublin through Joyce's eyes. Joyce's works are featured throughout the museum, including his early writings and letters to other authors about, \"Dubliners\". If you need to take a quick break visit the Commons Cafe, which is set in the original student dining hall of UCD Newman House or enjoy the museum's gardens which is home to the protected ash tree that James Joyce had his graduation photo taken. Open from 10:30 AM to 5:30 PM. Tickets must be purchased on their website or in-person. First Fridays of the month are free from 6 PM to 9 PM.",
    "mapLink": null,
    "lat": 53.3363,
    "lng": -6.2593
  },
  {
    "id": "kennedys-bar",
    "name": "Kennedy's Bar",
    "category": "tour",
    "categoryLabel": "Walking tour stop",
    "stories": [],
    "image": "assets/KennedyBar_then-now.JPG",
    "alt": "A modern image of Kennedy's, Dublin",
    "description": "A short seven minute walk away from the park, celebrate the end of the \"Retelling's\" walking tour with a pint at Kennedy's Pub and Restaurant. Kennedy's has been a Dublin staple since 1850 and was frequented by not only James Joyce, but Samuel Beckett and Oscar Wilde as well. Ask to sit at the table where the honorary James Joyce plaque is located.",
    "mapLink": null,
    "lat": 53.3427,
    "lng": -6.249
  }
];

const TOUR_GUIDES = {
  "james-joyce-centre": {
    "stopTitle": "James Joyce Center",
    "audio": [
      {
        "src": "audio/JJ_Centre_v2.mp3",
        "type": "audio/mpeg"
      },
      {
        "src": "audio/JJ_Centre_v2.m.ogg",
        "type": "audio/ogg"
      }
    ],
    "transcript": [
      "Located on North Great George's Street, the James Joyce Center is a restored Georgian townhouse honoring the legacy of James Joyce.",
      "Full of exhibitions, readings, lectures, and displaying Joyce's other works. It's a great place to get your bearings and expand your knowledge on the famed Irish author.",
      "Built in 1784 for Valentine Brown, the First Earl of Kenmare, the townhouse was preserved by a Joycean Scholar Senator David Norris in 1982. With the help of generous donors and lovers of Joyce's works, the townhouse was renovated and opened to the public in 1996 as the James Joyce Centre.",
      "The James Joyce Centre is one of many museums and tributes to Joyce, but features more community centered events. If you happen to visit in February or June, check out their website to see what special events they have to celebrate James Joyce's birthday or the annual Bloomsday Festival."
    ],
    "sideQuest": "Venture past Nelson's Pillar also known as \"The Pillar\", a large granite column capped by a statue of Horatio Nelson, and across the O'Connell Bridge towards your next destination. \"From Ballsbridge to the Pillar, twenty minutes; from the Pillar to Drumcondra, twenty minutes; and twenty minutes to buy the things. She would be there before eight\" (pg. 100) \"A very sullen-faced man stood at the corner of O'Connell Bridge waiting for the little Sandymount tram to take him home\" (pg. 96).",
    "quote": null
  },
  "trinity-college-dublin": {
    "stopTitle": "Trinity College Dublin",
    "audio": [
      {
        "src": "audio/Trinity_v2.mp3",
        "type": "audio/mpeg"
      },
      {
        "src": "audio/Trinity_v2.ogg",
        "type": "audio/ogg"
      }
    ],
    "transcript": [
      "Trinity College Dublin is a historic 400 year old university right in Dublin's city center. Ranked the No. 1 university in Ireland, its hallowed halls have been the home to thought leaders and creative minds, like Oscar Wilde, Bram Stoker, Edmund Burke and more. Trinity College is also home to decades of Joycean Scholars who've spent years studying James Joyce's works.",
      "In Dubliners, Trinity College Dublin appears in three separate stories, serving both as a central city landmark and as an institution inseparable from Ireland's colonial history.",
      "\"As they passed along the railings of Trinity College, Lenehan skipped out into the road and peered up at the clock\" (pg. 53 of Dubliners).",
      "Founded in 1592, through a royal charter from Queen Elizabeth the First, Trinity is Ireland's oldest university in continuous operation. The university has undergone several changes over the course of its longstanding history but focuses on preservation and honoring the original architecture of the school for its students, staff, and visitors to enjoy.",
      "Some key reminders while visiting Trinity: as it is an active university campus, please be mindful and courteous to all students and staff while visiting. All buildings with keycard access are restricted to students and staff only. Finally, watch out for the seagulls near the rugby pitch or they'll steal your food."
    ],
    "sideQuest": "Visit the Book of Kells Experience or a guided tour of the famous Old Library. Please note that all tickets must be booked in advance through: <a href=\"https://www.visittrinity.ie/book-of-kells-experience/\" target=\"_blank\" rel=\"noopener noreferrer\">visittrinity.ie</a>. Or visit the Douglas Hyde gallery, a free contemporary art gallery with exciting new exhibitions, artist talks and workshops available 5 days a week. Visit their website and see what's on display: <a href=\"https://thedouglashyde.ie\" target=\"_blank\" rel=\"noopener noreferrer\">thedouglashyde.ie</a>.",
    "quote": "\"As they passed along the railings of Trinity College, Lenehan skipped out into the road and peered up at the clock\" <em>(pg. 53)</em>."
  },
  "secret-book-and-record-store": {
    "stopTitle": "The Secret Book and Record Store",
    "audio": [
      {
        "src": "audio/secretbookstore_v2.m.mp3",
        "type": "audio/mpeg"
      },
      {
        "src": "audio/secretbookstore_v2.ogg",
        "type": "audio/ogg"
      }
    ],
    "transcript": [
      "For our next stop, leave Trinity's campus through the Nassau Street gate. Then walk up Nassau Street and turn up Wicklow Street to find this literary treasure trove.",
      "Tucked in between several shops and restaurants on Wicklow Street lies The Secret Book and Record Store, a small, independent bookstore that offers new and secondhand books, CDs and vinyl. Find rare books, vintage vinyl and all the latest releases. Pick up your own copy of Dubliners or any other book by James Joyce for only €5 in their classics collection!",
      "While browsing the bookstore's selection, here's some history on James Joyce. Born on February 2nd 1882, James Joyce is considered one of Ireland's most celebrated writers for his books, Dubliners and Ulysses. The eldest of 10 children, Joyce lived in Brighton Square, Rathgar with his parents, John Stanislaus Joyce and Mary Jane \"May\" (née Murray).",
      "Joyce has led a long storied life, where he wasn't only a writer but an educator as well. His works have been praised by literary figures like T.S. Eliot, James Baldwin and more. Joyce's work has been described as a \"colossus of modernist fiction\" by the Yale Press. He sought to \"give a picture of Dublin so complete that if the city suddenly disappeared from the earth it could be reconstructed out of my book\" — from a conversation with Frank Budgen, 1918. For more information on James Joyce's life, visit our website."
    ],
    "sideQuest": "Walk up to the corner of Wicklow street to the International Bar, a famed pub that James Joyce frequented for a pint and some lunch. For a vegan and vegetarian alternative, walk in the opposite direction to Cornucopia, a family run vegan restaurant with a chic art nouveau style.",
    "quote": null
  },
  "george-s-street": {
    "stopTitle": "City Markets",
    "audio": [
      {
        "src": "audio/citymarkets_v2.mp3",
        "type": "audio/mpeg"
      },
      {
        "src": "audio/citymarkets_v2.m.ogg",
        "type": "audio/ogg"
      }
    ],
    "transcript": [
      "Want a souvenir or to do some window shopping? Then walk past Wicklow Street onto Exchequer Street to visit the City Markets. Spanning several blocks and located in the heart of Dublin right between Trinity College and St. Stephen's Green.",
      "For some gorgeous architecture and shopping, visit the South City Markets — opened in 1881 as Dublin's first purpose-built Victorian shopping arcade, funded by affluent property-owning families and designed by English architects. Today, the City Markets are associated with the George's Street Arcade, and have been operating under the Layden Family Group's ownership since 1992.",
      "In Dubliners, City Market appears in \"Two Gallants,\" serving as a turning point directing Lenehan from George's Street toward Grafton Street.",
      "\"He left his friends at a quarter to ten and went up George's Street. He turned to the left at the City Markets and walked on into Grafton Street\" (pg. 58)."
    ],
    "sideQuest": "Walk down South Great George's Street to the George's Street Arcade, Ireland's first purpose-built shopping center and one of Europe's oldest city markets. The enclosed Victorian-styled market is home to several independent and vintage boutiques.",
    "quote": "\"He left his friends at a quarter to ten and went up George's Street. He turned to the left at the City Markets and walked on into Grafton Street\" <em>(pg. 58)</em>."
  },
  "st-stephen-s-green": {
    "stopTitle": "St. Stephen's Green",
    "audio": [
      {
        "src": "audio/stephensgreen_v2.m.mp3",
        "type": "audio/mpeg"
      },
      {
        "src": "audio/stephensgreen_v2.m.ogg",
        "type": "audio/ogg"
      }
    ],
    "transcript": [
      "After you've done some shopping, start making your way down to St. Stephen's Green, a 9 minute walk from the City Markets. A Victorian gem in Dublin's greatest garden square, it's one of Ireland's most famous public parks. This 9-hectare green space has been maintained to its original Victorian layout with over 3.5 km of accessible pathways, a waterfall, ornamental lake and several sculptures — including the James Joyce Memorial Sculpture.",
      "A little known fact is that this public park used to be marshland that served as common ground for grazing livestock. In 1663 the City Assembly of Dublin decided the land could generate income for the city. It wasn't until Sir Arthur Guinness, later known as Ardilaun, bought the Green in 1877 that the land was redeveloped and opened as St. Stephen's Green to the public on July 27th, 1880.",
      "\"That night the city wore the mask of a capital. The five young men strolled along Stephen’s Green in a faint cloud of aromatic smoke. They talked loudly and gaily and their cloaks dangled from their shoulders. The people made way for them. At the corner of Grafton Street a short fat man was putting two handsome ladies in a car in charge of another fat man. The car drove off and the short fat man caught sight of the party.\" (p. 46)."
    ],
    "sideQuest": "Get a head! Find the bust of James Joyce located somewhere in the park!",
    "quote": "\"That night the city wore the mask of a capital. The five young men strolled along Stephen's Green in a faint cloud of aromatic smoke.\" <em>(p. 46)</em>."
  },
  "museum-of-literature-ireland": {
    "stopTitle": "Museum of Literature",
    "audio": [
      {
        "src": "audio/MoLI_v2.mp3",
        "type": "audio/mpeg"
      },
      {
        "src": "audio/MoLI_v2.m.ogg",
        "type": "audio/ogg"
      }
    ],
    "transcript": [
      "If you were able to find the statue of James Joyce, turn around, exit the park and right in front of you, you'll find the entrance to the Museum of Literature Ireland. The Museum of Literature Ireland celebrates Irish writers featuring not only James Joyce, but Oscar Wilde, Mary Murphy, and more!",
      "Visit the permanent exhibit \"Dear, Dirty Dublin\" — a 3D experience of Dublin through Joyce's eyes.",
      "If you need to take a quick break, visit the Commons Cafe, which is set in the original student dining hall of UCD Newman House, or enjoy the museum's gardens which is home to the protected ash tree that James Joyce had his graduation photo taken under.",
      "The museum is open from 10:30 AM to 5:30 PM. Tickets must be purchased on their website or in-person.",
      "Side quest: As you’re walking towards our final destination on the tour, stop by the Shelbourne Hotel, a historic hotel on the north-side of St. Stephen’s Green. Featured in Dubliners and Ulysses, the building holds a deep historic significance in Irish history. In the 1916, during the Easter Rising, the hotel was occupied by 40 British troops to counter the Irish Citizen Army who had occupied St. Stephen’s Green. In 1992, the Constitution of the Irish Free State was drafted in room 112, which is now known as the Constitution Room."
    ],
    "sideQuest": "Walk past the Shelbourne Hotel, a historic hotel on the north-side of St. Stephen's Green. For those interested in a luxury afternoon tea, make a reservation on their website to enjoy their tea sandwiches, homemade scones, decadent deserts, and signature tea blends. \"Lenehan walked as far as the Shelbourne Hotel where he halted and waited\" (pg. 56).",
    "quote": null
  },
  "kennedys-bar": {
    "stopTitle": "Kennedy's Bar",
    "audio": [
      {
        "src": "audio/Kennedys_v2.mp3",
        "type": "audio/mpeg"
      },
      {
        "src": "audio/Kennedys_v2.m.ogg",
        "type": "audio/ogg"
      }
    ],
    "transcript": [
      "A short seven-minute walk away from St.Stephen’s Green, celebrate the end of the “Retelling’s” walking tour with a pint at Kennedy’s Pub and Restaurant. Kennedy’s has been a Dublin staple since 1850 and was frequented by not only James Joyce, but Samuel Beckett and Oscar Wilde as well. Ask to sit at the table where the honorary James Joyce plaque is located and take a load off!"
    ],
    "sideQuest": "Venture past the Nelson's Pillar bar for a quick bite to eat and across the canal towards your next destination.",
    "quote": null
  }
};

const SUGGESTED_TOUR = {
  title: "The Retellings walk",
  summary: "Our seven-stop walk from the James Joyce Centre to Kennedy's, through Trinity, the city markets and St Stephen's Green — about two hours at an easy pace, with an audio guide at every stop.",
  stops: ["james-joyce-centre","trinity-college-dublin","secret-book-and-record-store","george-s-street","st-stephen-s-green","museum-of-literature-ireland","kennedys-bar"],
  intro: {"audio":[{"src":"audio/welcome_v2.mp3","type":"audio/mpeg"},{"src":"audio/welcome_v2.m.ogg","type":"audio/ogg"}],"transcript":["Welcome to the Retellings Walking Tour! Together we'll walk in the footsteps of James Joyce's Dubliners while learning about some of Dublin's local haunts, about the life of James Joyce, and revisiting key locations in the book Dubliners at your own pace.","Our tour will start at the James Joyce Centre, which is easily accessible on the Green or Red line of the Luas tram or from various bus routes. To see which one is closest to you, add our Retellings Walking Tour to your Google Maps app with the link provided from our website."]},
  outro: {"audio":[{"src":"audio/end_v2.o.mp3","type":"audio/mpeg"},{"src":"audio/end_v2.ogg","type":"audio/ogg"}],"transcript":["Thank you for taking the Retelling's walking tour and experiencing James Joyce's Dublin with us. We hope you enjoyed, and if you'd like to see more locations featured in James Joyce's Dubliners, please check out our website"]}
};

if (typeof window !== "undefined") {
  window.TOUR_PLACES = TOUR_PLACES;
  window.TOUR_GUIDES = TOUR_GUIDES;
  window.SUGGESTED_TOUR = SUGGESTED_TOUR;
}
