/*
 * Retellings — the book's prose
 * Short retellings of each story in James Joyce's "Dubliners", written for
 * this project. Place names are wrapped in tokens: [[display|Location Name]]
 * (or just [[Location Name]] when the display text is the name itself).
 * book.js turns each token into a clickable mention that opens that
 * location's card. "Location Name" must match a name in locations-data.js.
 */

const BOOK = {
  title: "Dubliners",
  author: "James Joyce",
  subtitle: "Retold — fifteen stories of a city",
  blurb:
    "Fifteen portraits of Dublin at the turn of the twentieth century. " +
    "Turn the pages, and where a place is named in the text, open it to " +
    "walk its history and find it on the map.",

  stories: [
    {
      number: 1,
      title: "The Sisters",
      paragraphs: [
        "A boy keeps watch at a lit window, waiting for the death of old Father Flynn, the priest who had been his odd, exacting friend. When the word finally comes, it reaches him as gossip among the grown-ups over supper.",
        "That evening he walks with his aunt to the house of mourning near [[Great Britain Street]], where the priest lies coffined and the dead man's two sisters, Nannie and Eliza, receive callers with sherry and cream crackers.",
        "In their hushed talk a life comes apart: the broken chalice, the long paralysis, the night the old priest was found laughing softly to himself in the dark of his confession-box. The boy listens, half understanding, to the first of the city's many quiet failures."
      ]
    },
    {
      number: 2,
      title: "An Encounter",
      paragraphs: [
        "Hungry for the Wild West of their adventure stories, two schoolboys plan a day of truancy — a trek across the city to see the ships and, beyond them, the [[Pigeon House]].",
        "They set out along the [[North Strand Road]], cross the [[Canal Bridge]], and loiter down to the [[River Liffey]] to watch the barges and a Norwegian vessel being unloaded, never quite reaching the far shore.",
        "Resting in a field, they meet a shabby old man whose mild talk slides into something strange and menacing. The narrator's nerve fails; what began as an escape ends in unease, and in a small, shaming gratitude toward the friend he had always looked down on."
      ]
    },
    {
      number: 3,
      title: "Araby",
      paragraphs: [
        "On quiet, blind [[North Richmond Street]], a boy nurses a first, wordless love for his friend Mangan's sister. When she mentions a charity bazaar called Araby, he promises to bring her something from it.",
        "The day drags; his uncle comes home late and forgetful. At last the boy rides a near-empty train in from [[Westland Row|Westland Row Station]], arriving as the great hall is already dimming and the stalls are closing.",
        "He lingers before a stall he cannot afford, overhears an idle English flirtation, and sees his grand errand for the vanity it was. The lights go out, and he stands — \"a creature driven and derided by vanity\" — burning with anguish and anger."
      ]
    },
    {
      number: 4,
      title: "Eveline",
      paragraphs: [
        "At her window in the dusty evening, Eveline weighs a whole life in the balance: the hard, familiar house and a violent father against escape to Buenos Aires with her sailor, Frank.",
        "She has promised to keep the home together, as she promised her dying mother; yet Frank offers tenderness, a husband, a new country. She packs her two bags and goes down to meet him.",
        "At the [[North Wall|North Wall]], amid the swaying crowd and the boat's mournful whistle, terror seizes her. She grips the iron railing and cannot move. Frank is swept toward the gangway calling her name, and Eveline gives him no sign — \"passive, like a helpless animal.\""
      ]
    },
    {
      number: 5,
      title: "After the Race",
      paragraphs: [
        "Dublin cheers the Continental motorcars as they tear in along the [[Naas Road]], and among the wealthy young racers rides Jimmy Doyle, the son of a newly rich butcher, giddy to be seen in such company.",
        "The day runs on champagne and flattery — a spin into town, dinner, a stroll past [[Trinity College Dublin]] and up toward [[St Stephen’s Green]], then on to a visitor's yacht in the harbour.",
        "There the cards come out. Jimmy plays beyond his depth, losing heavily to men who can afford it, and signs away his father's money with a smile. Dawn breaks grey over the cabin, and a Hungarian voice announces, too cheerfully, \"Daybreak, gentlemen!\""
      ]
    },
    {
      number: 6,
      title: "Two Gallants",
      paragraphs: [
        "On a warm Sunday evening two idlers, Lenehan and Corley, drift through the city trading talk. Corley boasts of the slavey he is meeting — a housemaid he means to use for money.",
        "They part near [[Rutland Square]], and Lenehan fills the empty hours alone, wandering down [[Dame Street]], past the railings of [[Trinity College Dublin]], and round by [[St Stephen’s Green]] in a long, aimless loop of the town.",
        "Hungry and friendless, he kills time until the appointed hour, then waits at the corner for Corley's return. At last Corley opens his hand under the lamplight: a small gold coin, the price of the night — and of two gallants both."
      ]
    },
    {
      number: 7,
      title: "The Boarding House",
      paragraphs: [
        "Mrs Mooney, \"a determined woman,\" runs a city boarding house, having walked out on her drunken husband. She watches, and waits, as her daughter Polly grows friendly with the lodgers.",
        "When the affair with Mr Doran can no longer be overlooked, Mrs Mooney lets it ripen, then moves — certain that reparation means marriage. Over the Sunday bells of [[George’s Church|Belfry of George’s Church]] she rehearses her case.",
        "Upstairs, Mr Doran sweats over his good name and his employer's opinion, trapped between conscience and consequence. He is summoned down to \"make amends.\" On the landing Polly waits, already serene, knowing the outcome is decided."
      ]
    },
    {
      number: 8,
      title: "A Little Cloud",
      paragraphs: [
        "Little Chandler, a timid clerk with a poet's private hopes, is to meet his old friend Ignatius Gallaher, now a flashy London journalist back in town.",
        "Crossing the city toward their meeting, he looks down at the [[River Liffey]] and the poor huddled along its banks, and lets himself dream of the slim book of verse he might one day publish.",
        "Gallaher, loud and worldly, patronises him over whiskey with talk of Paris and London vice. Chandler goes home stung, and when his infant son will not stop crying he shouts — then, as the child wails, is flooded with tears of remorse and shame."
      ]
    },
    {
      number: 9,
      title: "Counterparts",
      paragraphs: [
        "Farrington, a heavy copy-clerk, botches his work and is humiliated by his employer. Thirsty and seething, he pawns his watch and sets out to drink his anger across the city.",
        "The evening carries him through the bars off [[Dame Street]] and down toward [[O’Connell Bridge]] with a swelling crowd of companions — standing rounds he cannot afford, retelling his one small insolence to the boss.",
        "Beaten at arm-wrestling by a younger man and snubbed by a woman, he comes home drunk and empty-handed to a cold grate. When his small son fumbles an excuse, Farrington turns the whole day's defeat on the boy with a stick."
      ]
    },
    {
      number: 10,
      title: "Clay",
      paragraphs: [
        "Maria, a gentle, spinsterly laundress, is to spend Hallow Eve with the family of Joe, the boy she once nursed. She is proud of her little treats and her peace-making ways.",
        "On the way she shops along [[Dorset Street]] and, near [[the Pillar|Nelson’s Pillar]], buys a fine plum-cake — then, flustered by a gallant older gentleman on the tram, leaves the parcel behind.",
        "At the party the children play the old blindfold game of saucers; Maria's hand falls first on a lump of soft clay — an omen of the grave, quietly hidden from her. She sings her song, forgets a verse, and no one has the heart to tell her."
      ]
    },
    {
      number: 11,
      title: "A Painful Case",
      paragraphs: [
        "Mr Duffy lives a bare, orderly life out in Chapelizod, west of the city, keeping every feeling at a cautious distance. At a concert he meets Mrs Sinico, and a careful friendship grows between them.",
        "They walk and talk for months, until she presses his hand to her cheek. Alarmed by the warmth, Duffy breaks it off and retreats to his books, his accounts, and his lonely rooms by the [[Lucan Road]].",
        "Four years on, a newspaper reports her death — struck by a train, a solitary drinker at the last. Reading it on a cold walk, Duffy feels first disgust, then the full weight of what he refused, and knows himself \"outcast from life's feast.\""
      ]
    },
    {
      number: 12,
      title: "Ivy Day in the Committee Room",
      paragraphs: [
        "On the anniversary of Parnell's death, a knot of dispirited canvassers gather round a weak fire in a committee room, nursing bottles of stout and old grievances, wearing ivy in the dead chief's memory.",
        "Talk circles money, work, and the coming royal visit; a boy is sent out toward [[Suffolk Street]] for more drink, and the men bicker over loyalty and betrayal in a city that has learned to settle for less.",
        "At last one of them is coaxed to recite his poem, \"The Death of Parnell.\" In the smoky hush the shabby grief turns briefly genuine, and even the sceptic can only mutter that it was \"a very fine piece of writing.\""
      ]
    },
    {
      number: 13,
      title: "A Mother",
      paragraphs: [
        "Mrs Kearney, proud and exacting, arranges for her daughter Kathleen to accompany a series of nationalist concerts, and signs a contract for a tidy fee.",
        "But the concerts at the [[the Antient Concert Rooms|Ancient Concert Rooms]] are poorly run and thinly attended, and when the committee tries to trim the promised payment, Mrs Kearney digs in.",
        "She makes her stand in public, on the night of the grand concert, demanding every penny before her daughter will play. The scene scandalises the organisers; her point may be just, but her manner finishes Kathleen's career — and the city closes ranks against a difficult woman."
      ]
    },
    {
      number: 14,
      title: "Grace",
      paragraphs: [
        "Tom Kernan, a genial commercial traveller fond of drink, tumbles down the stairs of a bar and bites his tongue, and is helped home bruised and ashamed.",
        "His friends resolve to reform him. Over his sickbed they talk their way around church history and papal mottoes, laying the gentle trap of a businessmen's retreat, their talk ranging from [[Dublin Castle]] to half-remembered points of doctrine.",
        "Persuaded, Kernan joins them at the church among the city's men of affairs. A worldly Jesuit preaches a worldly sermon — on the accounts of conscience — inviting them, in plain commercial terms, to set their spiritual books in order."
      ]
    },
    {
      number: 15,
      title: "The Dead",
      paragraphs: [
        "At the Misses Morkan's annual Christmas dance on the quays, Gabriel Conroy carves the goose, dances, and frets over the speech he must give. The talk runs on singers and operas once heard at the [[the Theatre Royal|Theatre Royal]].",
        "After the party, crossing back over [[O’Connell Bridge|O’Connell Bridge]] past the dark river and the lamplit statues, Gabriel glows with tenderness for his wife, Gretta — until a song has set her weeping for a boy, Michael Furey, who died for love of her long ago in Galway.",
        "In the hotel room his pride collapses into pity and wonder. At the window he watches the snow falling — on the city, on the [[the Park|Phoenix Park]], on the [[the waves of the Shannon|Shannon Waves]] far to the west — \"falling faintly through the universe and faintly falling, like the descent of their last end, upon all the living and the dead.\""
      ]
    }
  ],

  colophon:
    "Dubliners was first published in 1914. These retellings are our own, " +
    "written to guide you between the stories and the streets. Follow any " +
    "underlined place to its history and its place on the map."
};

if (typeof window !== "undefined") window.BOOK = BOOK;
