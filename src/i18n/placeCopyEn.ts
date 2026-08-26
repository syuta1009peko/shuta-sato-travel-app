export interface PlaceCopy {
  name: string
  description: string
  reasonHint: string
}

export const PLACE_COPY_EN: Record<string, PlaceCopy> = {
  'hoan-kiem-lake': {
    name: 'Hoan Kiem Lake',
    description: 'The lake at the heart of Hanoi. Ideal for a morning walk and photos.',
    reasonHint: 'Enjoy greenery and photos right in the city center.',
  },
  'ngoc-son-temple': {
    name: 'Ngoc Son Temple',
    description: 'A historic temple on a small island in Hoan Kiem Lake. Easy to visit at a gentle pace.',
    reasonHint: 'A calm way to touch local history.',
  },
  'old-quarter-walk': {
    name: 'Old Quarter 36 Streets',
    description: 'Walk the artisan streets and take in the everyday rhythm of the quarter.',
    reasonHint: 'Get a feel for the city on foot.',
  },
  'old-quarter-night': {
    name: 'Old Quarter night walk',
    description: 'Stroll the Old Quarter after dark among street-food stalls and lights.',
    reasonHint: 'For anyone who likes walking the city at night.',
  },
  'hang-ga-street': {
    name: 'Craft street in the Old Quarter',
    description: 'A street of folk crafts and small gifts. Convenient for souvenirs.',
    reasonHint: 'Find handmade pieces at approachable prices.',
  },
  'hanoi-opera': {
    name: 'Hanoi Opera House',
    description: 'A graceful French-era theater. The façade is a favorite photo stop.',
    reasonHint: 'Linger over architecture and the arts.',
  },
  'west-lake': {
    name: 'West Lake (Tay Ho)',
    description: 'Hanoi’s largest lake. Walk the path around it and feel the breeze.',
    reasonHint: 'A wide-open reset from the busy streets.',
  },
  'tran-quoc-pagoda': {
    name: 'Tran Quoc Pagoda',
    description: 'An old pagoda on West Lake. Morning visits are especially pleasant.',
    reasonHint: 'Lake views and history in one stop.',
  },
  'west-lake-cycle': {
    name: 'West Lake cycling',
    description: 'An active loop around the lake by bicycle.',
    reasonHint: 'Move your body while taking in the scenery.',
  },
  'west-lake-sunset': {
    name: 'West Lake sunset lookout',
    description: 'A photo spot where the water glows from late afternoon into evening.',
    reasonHint: 'For sunset photographs.',
  },
  'quang-ba-flowers': {
    name: 'Quang Ba flower market area',
    description: 'Flowers and local stalls in the morning. Bright, colorful photos.',
    reasonHint: 'Catch a true morning-market scene.',
  },
  'tay-ho-gallery': {
    name: 'West Lake art galleries',
    description: 'A quiet pocket of contemporary galleries.',
    reasonHint: 'Look at art without the rush.',
  },
  'ho-chi-minh-mausoleum': {
    name: 'Ho Chi Minh Mausoleum',
    description: 'A landmark of modern Vietnamese history. Morning visits are the usual pattern.',
    reasonHint: 'A classic stop for national history.',
  },
  'one-pillar-pagoda': {
    name: 'One Pillar Pagoda',
    description: 'A small pagoda raised on a single pillar. A short, memorable visit.',
    reasonHint: 'A striking photo in little time.',
  },
  'lenin-park': {
    name: 'Lenin Park',
    description: 'A leafy park that is easy with children.',
    reasonHint: 'A relaxed stop for families.',
  },
  'botanical-garden': {
    name: 'Hanoi Botanical Garden',
    description: 'A green space with old trees. Good shade on a hot day.',
    reasonHint: 'Find nature without leaving the city.',
  },
  'ba-dinh-night': {
    name: 'Ba Dinh Square at night',
    description: 'A quiet evening walk across the lit square.',
    reasonHint: 'Night views without the crowds.',
  },
  'thang-long-citadel': {
    name: 'Thang Long Imperial Citadel',
    description: 'Ruins of a thousand-year capital. Walk the grounds and follow the history.',
    reasonHint: 'A fuller look at Hanoi’s past.',
  },
  'st-joseph-cathedral': {
    name: 'St. Joseph’s Cathedral',
    description: 'A stone church near the Old Quarter. The exterior photographs well.',
    reasonHint: 'Capture a European-style building in Hanoi.',
  },
  'fine-arts-museum': {
    name: 'Vietnam Fine Arts Museum',
    description: 'Art from traditional to contemporary collections.',
    reasonHint: 'For a slower look at Vietnamese art.',
  },
  'french-quarter-walk': {
    name: 'French Quarter stroll',
    description: 'Tree-lined streets and colonial houses.',
    reasonHint: 'Walk and photograph the streetscape.',
  },
  'vincom-ba-trieu': {
    name: 'Vincom Ba Trieu',
    description: 'A large mall for shopping and a cool rest.',
    reasonHint: 'Shop indoors at an easy pace.',
  },
  'le-thai-to-night': {
    name: 'Le Thai To Street at night',
    description: 'A night walk under trees, shops, and lights.',
    reasonHint: 'A slightly dressy evening in the city.',
  },
  'vietnam-history-museum': {
    name: 'Vietnam National Museum of History',
    description: 'A large museum from antiquity to the modern era.',
    reasonHint: 'Learn the history in a clear sequence.',
  },
  'long-bien-bridge': {
    name: 'Long Bien Bridge',
    description: 'An old iron bridge over the Red River. The walk across has fine views.',
    reasonHint: 'Photograph the river from the bridge.',
  },
  'gia-lam-crafts': {
    name: 'Gia Lam craft area',
    description: 'A place to see and buy local crafts.',
    reasonHint: 'Meet work made by local hands.',
  },
  'long-bien-night': {
    name: 'Long Bien streets at night',
    description: 'Streets that stay open after dark. Feel how locals move through the evening.',
    reasonHint: 'A night that is not overly touristy.',
  },
  'red-river-park': {
    name: 'Red River',
    description: 'An open stretch by the river. Breeze and wide views.',
    reasonHint: 'Walk under a big sky.',
  },
  'bat-trang-village': {
    name: 'Bat Trang ceramic village',
    description: 'Workshops clustered in a pottery village. Visit and shop.',
    reasonHint: 'Choose a more substantial souvenir.',
  },
  'long-bien-station': {
    name: 'Long Bien Station',
    description: 'A short look at the historic station building from outside.',
    reasonHint: 'Find history in an everyday scene.',
  },
  'pho-thin': {
    name: 'Pho Thin',
    description: 'A long-loved shop known for fragrant grilled-beef phở.',
    reasonHint: 'Classic Hanoi phở at a fair price.',
  },
  'bun-cha-huong-lien': {
    name: 'Bun Cha Huong Lien',
    description: 'Charcoal-grilled pork with noodles. A Hanoi lunch or dinner.',
    reasonHint: 'A proper taste of the local table.',
  },
  'tay-ho-seafood': {
    name: 'West Lake seafood restaurant',
    description: 'Seafood near the lake. Suited to dinner.',
    reasonHint: 'Eat with a view.',
  },
  'chay-ba-dinh': {
    name: 'Ba Dinh vegetarian kitchen',
    description: 'Gentle vegetable-forward dishes. A calm lunch.',
    reasonHint: 'A lighter meal that is easy on the stomach.',
  },
  'bun-dau-long-bien': {
    name: 'Bun dau mam tom (Long Bien)',
    description: 'Tofu and noodles to share. A local favorite.',
    reasonHint: 'Try a hometown dish in a grazing mood.',
  },
  'egg-coffee-giang': {
    name: 'Cafe Giang (egg coffee)',
    description: 'Hanoi’s famous egg coffee. Perfect as an afternoon pause.',
    reasonHint: 'The signature drink, and a photo to match.',
  },
  'cong-caphe': {
    name: 'Cong Caphe',
    description: 'A retro café chain known for coconut coffee.',
    reasonHint: 'Rest in a room with atmosphere.',
  },
  'loading-t': {
    name: 'Loading T',
    description: 'A hidden café among books. Quiet and unhurried.',
    reasonHint: 'For a stylish, still moment.',
  },
  'dong-xuan-market': {
    name: 'Dong Xuan Market',
    description: 'A large wholesale market. Feel the morning energy.',
    reasonHint: 'The city’s early bustle, up close.',
  },
  'long-bien-night-market': {
    name: 'Long Bien night market',
    description: 'Stalls after dark. Made for grazing.',
    reasonHint: 'Night-market food, one bite at a time.',
  },
  'naritasan-shinshoji': {
    name: 'Naritasan Shinshoji Temple',
    description: 'Chiba’s best-known temple. Walk from the approach to the main hall.',
    reasonHint: 'A calm visit to a historic temple.',
  },
  'naritasan-park': {
    name: 'Naritasan Park',
    description: 'Ponds and greenery just beyond the temple. Easy to walk after prayers.',
    reasonHint: 'Nature right beside the temple.',
  },
  'narita-omotesando': {
    name: 'Naritasan temple town',
    description: 'The approach lined with eel restaurants and souvenirs. Good for browsing and snacking.',
    reasonHint: 'Shop the classic temple-town street.',
  },
  'narita-crafts': {
    name: 'Narita craft shops',
    description: 'A cluster of stores selling local handmade work.',
    reasonHint: 'Choose crafts at an unhurried pace.',
  },
  'naritasan-lightup': {
    name: 'Naritasan evening lights',
    description: 'The precincts lit at night. A quiet evening visit.',
    reasonHint: 'Night photos without the noise.',
  },
  'narita-airport-observation': {
    name: 'Narita Airport observation deck',
    description: 'Watch planes take off and land up close.',
    reasonHint: 'For photos of moving subjects.',
  },
  'chiba-port-tower': {
    name: 'Chiba Port Tower',
    description: 'A tower over the harbor. Especially fine from late afternoon.',
    reasonHint: 'A high, open view.',
  },
  'inohana-castle': {
    name: 'Inohana Park and Chiba Castle',
    description: 'A hilltop park and local castle. Greenery and history together.',
    reasonHint: 'Combine a park walk with a bit of history.',
  },
  'chiba-city-museum': {
    name: 'Chiba City Museum of Art',
    description: 'From ukiyo-e to contemporary work, indoors and air-conditioned.',
    reasonHint: 'For a focused look at art.',
  },
  'chiba-park-lotus': {
    name: 'Chiba Park lotus pond',
    description: 'A large pond and lotus flowers. Free and easy to walk.',
    reasonHint: 'Flower and water photos in the city.',
  },
  'chuo-park-night': {
    name: 'Chuo Park night walk',
    description: 'A short evening walk in the park near the station.',
    reasonHint: 'A night stroll with little extra travel.',
  },
  'kibor-shopping': {
    name: 'Shopping around Qiball',
    description: 'A mixed-use complex by city hall. Handy for shops and a rest.',
    reasonHint: 'Browse indoors even on a rainy day.',
  },
  'makuhari-kaihin-park': {
    name: 'Makuhari Seaside Park',
    description: 'A wide park of sea and lawn. Walk and feel the wind.',
    reasonHint: 'Move around an open waterfront.',
  },
  'aeon-makuhari': {
    name: 'AEON Mall Makuhari New City',
    description: 'A large mall where shopping and meals sit in one place.',
    reasonHint: 'Cover many shops without extra hops.',
  },
  'zozo-marine': {
    name: 'Around ZOZO Marine Stadium',
    description: 'A walk around the ballpark. A sporty waterfront mood.',
    reasonHint: 'An active stretch of the seaside.',
  },
  'makuhari-night': {
    name: 'Makuhari Messe night views',
    description: 'Big buildings and street lights after dark.',
    reasonHint: 'Urban night photography.',
  },
  'inage-kaihin': {
    name: 'Inage Seaside Park',
    description: 'Sand and greenery. Good for a walk or picnic.',
    reasonHint: 'A longer walk along the shore.',
  },
  'makuhari-art': {
    name: 'Makuhari art spots',
    description: 'A route of exhibitions and public art.',
    reasonHint: 'For new work in the open air.',
  },
  'tokyo-disneyland': {
    name: 'Tokyo Disneyland',
    description: 'The theme park in Maihama, Urayasu. Castle, parades, and a full day inside.',
    reasonHint: 'For photos and rides.',
  },
  'tokyo-disneysea': {
    name: 'Tokyo DisneySea',
    description: 'A sea-themed park. Walk a harborside setting as you go.',
    reasonHint: 'Scenic views that photograph well, for hours.',
  },
  'ikspiari': {
    name: 'Ikspiari',
    description: 'A shopping complex by Maihama Station. Shops and meals in one stop.',
    reasonHint: 'Browse before or after the parks.',
  },
  'urayasu-folk-museum': {
    name: 'Urayasu City Folk Museum',
    description: 'Row houses and daily life from when Urayasu was a fishing town.',
    reasonHint: 'Urayasu history beyond Disney.',
  },
  'maihama-station-walk': {
    name: 'Walk around Maihama Station',
    description: 'The street from the station to the park gates. Plenty of photo spots.',
    reasonHint: 'Feel the resort on the way.',
  },
  'urayasu-sports-park': {
    name: 'Urayasu Comprehensive Park',
    description: 'A wide park of lawns and play areas. Easy walking.',
    reasonHint: 'Rest the body away from the parks.',
  },
  'ikspiari-disney-store': {
    name: 'Disney Store at Ikspiari',
    description: 'The official shop inside the mall. Good for souvenirs.',
    reasonHint: 'Shop without entering the parks.',
  },
  'sawara-town': {
    name: 'Sawara historic streets',
    description: 'A “Little Edo” of old merchant houses. Walk along the waterways.',
    reasonHint: 'A slow taste of an older town.',
  },
  'katori-jingu': {
    name: 'Katori Jingu Shrine',
    description: 'An ancient shrine beyond a cedar avenue. Morning visits are lovely.',
    reasonHint: 'History among the trees.',
  },
  'suigo-boat': {
    name: 'Suigo river cruise',
    description: 'See the town and water from a boat. Many photo views.',
    reasonHint: 'Watch the riverside at an easy pace.',
  },
  'sawara-lantern': {
    name: 'Sawara lantern streets at night',
    description: 'Walk the storehouse town after dark. Quiet and calm.',
    reasonHint: 'The night mood of an old town.',
  },
  'katori-crafts': {
    name: 'Katori craft workshop',
    description: 'See local crafts and buy pieces.',
    reasonHint: 'For handmade work.',
  },
  'mother-farm': {
    name: 'Mother Farm',
    description: 'Animals and hill views. Popular with families.',
    reasonHint: 'Time outdoors with children.',
  },
  'nihonji-daibutsu': {
    name: 'Nihon-ji Daibutsu and Mount Nokogiri',
    description: 'A great stone Buddha and mountain views. History and form together.',
    reasonHint: 'Meet a monumental Buddha.',
  },
  'tokyo-german-village': {
    name: 'Tokyo German Village',
    description: 'A park of flowers and photogenic buildings. Seasonal color.',
    reasonHint: 'Bright, colorful photos.',
  },
  'tateyama-shopping': {
    name: 'Tateyama shopping streets',
    description: 'Browse a seaside town’s shops. Local sweets turn up too.',
    reasonHint: 'Peek into shops that are not overly touristy.',
  },
  'flower-line': {
    name: 'Minamiboso Flower Line',
    description: 'A route of flowers and sea. Good for a drive or a walk.',
    reasonHint: 'Open views for photographs.',
  },
  'nokogiri-yama': {
    name: 'Mount Nokogiri hike',
    description: 'Cliffs and lookouts. Pace it to your fitness.',
    reasonHint: 'A proper walk for the view.',
  },
  'unagi-narita': {
    name: 'Narita eel cuisine',
    description: 'The temple town’s famous eel. A meal with a sense of occasion.',
    reasonHint: 'A Narita-style treat.',
  },
  'kaisendon-chiba': {
    name: 'Chiba Port seafood rice bowl',
    description: 'A seafood bowl near the harbor. Suited to lunch.',
    reasonHint: 'Fresh fish at a fair price.',
  },
  'ramen-makuhari': {
    name: 'Makuhari ramen',
    description: 'Ramen in the waterfront area. An easy, casual meal.',
    reasonHint: 'Fill up without spending much.',
  },
  'kaiseki-sawara': {
    name: 'Sawara Japanese dinner',
    description: 'A Japanese restaurant in the old town. For the evening meal.',
    reasonHint: 'Dine for the setting as much as the food.',
  },
  'boso-seafood': {
    name: 'Boso seafood set meal',
    description: 'A set built around local catch. A solid dinner.',
    reasonHint: 'Taste the fish of this coast.',
  },
  'teishoku-chuo': {
    name: 'Central Chiba set-meal diner',
    description: 'A balanced set meal. A calm lunch.',
    reasonHint: 'A straightforward midday meal.',
  },
  'restaurant-ikspiari': {
    name: 'Restaurant at Ikspiari',
    description: 'Dining inside the complex. Convenient before or after the parks.',
    reasonHint: 'A sit-down meal with atmosphere.',
  },
  'cafe-naritasan': {
    name: 'Sweet café on the approach',
    description: 'Sweets and drinks along the temple street. A good afternoon pause.',
    reasonHint: 'Rest with something sweet after walking.',
  },
  'cafe-kaihin': {
    name: 'Seaside park café',
    description: 'A café near the water with a good window view.',
    reasonHint: 'Coffee with a view.',
  },
  'cafe-sawara': {
    name: 'Sawara townhouse café',
    description: 'A café in an old building. Quiet and still.',
    reasonHint: 'Pause with the historic street outside.',
  },
  'cafe-ikspiari': {
    name: 'Café at Ikspiari',
    description: 'A café in the shopping complex. Easy between shops.',
    reasonHint: 'Sweets and a drink as a breather.',
  },
  'narita-morning-market': {
    name: 'Narita morning shops',
    description: 'The temple-town shops as they open. A start for grazing.',
    reasonHint: 'Feel the local morning energy.',
  },
  'makuhari-night-food': {
    name: 'Makuhari night food street',
    description: 'Stalls and shops after dark. Made for grazing.',
    reasonHint: 'Try several small evening bites.',
  },
  'maihama-night-food': {
    name: 'Maihama evening food hop',
    description: 'Hop between places around Ikspiari after dark.',
    reasonHint: 'A light graze after the parks.',
  },
  'temple-of-literature': {
    name: "Temple of Literature",
    description: "Vietnam’s first university, known for stelae and Khue Van Cac.",
    reasonHint: "A quiet walk through learning history.",
  },
  'hoa-lo-prison': {
    name: "Hoa Lo Prison",
    description: "A museum in the colonial prison, strong on modern history.",
    reasonHint: "A deeper look at the capital’s past.",
  },
  'flag-tower-hanoi': {
    name: "Hanoi Flag Tower",
    description: "The symbolic tower of Thang Long Citadel, on the military museum grounds.",
    reasonHint: "A city landmark up close.",
  },
  'hanoi-station': {
    name: "Hanoi Station",
    description: "The old Hang Co station, with a French-era façade.",
    reasonHint: "Photograph the rail gateway.",
  },
  'my-dinh-stadium': {
    name: "My Dinh National Stadium",
    description: "The national stadium; the exterior is visible even without events.",
    reasonHint: "A sense of modern Hanoi’s scale.",
  },
  'vietnam-soviet-palace': {
    name: "Vietnam–Soviet Friendship Palace",
    description: "A culture palace on the old exhibition ground. The night façade is striking.",
    reasonHint: "See a large cultural building.",
  },
  'quan-thanh-temple': {
    name: "Quan Thanh Temple",
    description: "A guardian temple near West Lake, known for its bronze statue.",
    reasonHint: "A quiet shrine by the lake.",
  },
  'hang-dau-water-tower': {
    name: "Hang Dau water tower",
    description: "A French-era water tower, a landmark at the junction.",
    reasonHint: "A short stop at an Old Quarter corner.",
  },
  'ham-long-church': {
    name: "Ham Long Church",
    description: "A church with a clear bell tower, quieter than the cathedral.",
    reasonHint: "Architecture photos without the rush.",
  },
  'ceramic-mosaic-road': {
    name: "Ceramic Mosaic Road",
    description: "A long ceramic mural on the Red River dike, a Guinness record.",
    reasonHint: "Color and pattern as you walk.",
  },
  'dinh-le-book-street': {
    name: "Dinh Le book street",
    description: "A book street by Hoan Kiem Lake, with plenty of used titles.",
    reasonHint: "Browse quietly near the lake.",
  },
  'west-lake-water-park': {
    name: "West Lake Water Park",
    description: "One of Hanoi’s largest water parks, best in summer.",
    reasonHint: "A long play on a hot day.",
  },
  'aeon-mall-long-bien': {
    name: "AEON Mall Long Bien",
    description: "A large mall in Long Bien, with indoor play as well.",
    reasonHint: "Shop and rest without worrying about weather.",
  },
  'lotte-mall-west-lake': {
    name: "Lotte Mall West Lake",
    description: "A new large mall by West Lake.",
    reasonHint: "Shopping and meals in the West Lake area.",
  },
  'royal-city': {
    name: "Royal City",
    description: "A large underground complex with indoor attractions.",
    reasonHint: "A cool place to spend hours.",
  },
  'keangnam-sky72': {
    name: "Keangnam Sky 72",
    description: "A high observatory and indoor attractions looking over the city.",
    reasonHint: "Hanoi from above.",
  },
  'thu-le-park': {
    name: "Thu Le Park",
    description: "A large park with a zoo, good with children.",
    reasonHint: "Animals in the greenery.",
  },
  'bao-son-paradise': {
    name: "Bao Son Paradise",
    description: "A complex with aquarium, zoo, and rides.",
    reasonHint: "A half day just outside the center.",
  },
  'times-city-aquarium': {
    name: "Times City Aquarium",
    description: "A large aquarium inside Times City, open into the evening.",
    reasonHint: "Marine displays indoors.",
  },
  'vinke-times-city': {
    name: "VinKE Times City",
    description: "An indoor role-play park for children.",
    reasonHint: "Play at grown-up jobs.",
  },
  'vietnam-nature-museum': {
    name: "Vietnam National Museum of Nature",
    description: "Skeletons and fossils, easy with children.",
    reasonHint: "Look closely at natural specimens.",
  },
  'ethnology-museum': {
    name: "Vietnam Museum of Ethnology",
    description: "Indoor and garden displays of 54 ethnic groups.",
    reasonHint: "Many cultures in one visit.",
  },
  'ta-hien-beer-street': {
    name: "Ta Hien beer street",
    description: "The Old Quarter beer street, busy after dark.",
    reasonHint: "A lively Hanoi night.",
  },
  'thang-long-water-puppet': {
    name: "Thang Long Water Puppet Theatre",
    description: "Water puppet shows every day of the year.",
    reasonHint: "Traditional performance in under an hour.",
  },
  'nhat-tan-bridge': {
    name: "Nhat Tan Bridge",
    description: "A cable-stayed bridge over the Red River, lit at night.",
    reasonHint: "River and city from the span.",
  },
  'the-note-coffee': {
    name: "The Note Coffee",
    description: "A café covered in notes, also known for egg coffee.",
    reasonHint: "A photogenic pause.",
  },
  'train-street-cafe': {
    name: "Train Street Cafe",
    description: "Cafés beside the tracks; the passing train is the moment.",
    reasonHint: "A classic Hanoi rail scene.",
  },
  'hang-buom-food-street': {
    name: "Hang Buom food street",
    description: "A stall street for grazing, busy at night.",
    reasonHint: "Many small bites in a short walk.",
  },
  'tong-duy-tan-food': {
    name: "Tong Duy Tan food street",
    description: "Seafood and late bites at approachable prices.",
    reasonHint: "Made for an evening graze.",
  },
  'trang-tien-ice-cream': {
    name: "Trang Tien ice cream",
    description: "A long-running ice-cream shop near Hoan Kiem Lake.",
    reasonHint: "A sweet stop on a walk.",
  },
  'cha-ca-la-vong': {
    name: "Cha ca La Vong",
    description: "Turmeric fish cooked at the table, a Hanoi classic.",
    reasonHint: "A dish you sit down for here.",
  },
  'pho-bat-dan': {
    name: "Pho Bat Dan",
    description: "A beef pho shop in the Old Quarter, often queued in the morning.",
    reasonHint: "Classic pho at a local counter.",
  },
  'ho-chi-minh-museum': {
    name: "Ho Chi Minh Museum",
    description: "A museum beside the mausoleum, covering his life and era.",
    reasonHint: "Modern history in exhibits.",
  },
  'presidential-palace': {
    name: "Presidential Palace (exterior)",
    description: "A French-era residence; view the façade from the garden side.",
    reasonHint: "A historic building in little time.",
  },
  'hang-quat-stamps': {
    name: "Hang Quat wood stamps",
    description: "Carve a wood stamp on Hang Quat Street.",
    reasonHint: "Make a small craft yourself.",
  },
  'westlake-mini-golf': {
    name: "West Lake mini golf",
    description: "A casual mini-golf course on the Long Bien side.",
    reasonHint: "A light reset for the body.",
  },
  'go-kart-aeon-hadong': {
    name: "Go-kart at AEON Mall Ha Dong",
    description: "Indoor electric karts in the Ha Dong mall.",
    reasonHint: "Play without checking the sky.",
  },
  'duck-boat-truc-bach': {
    name: "Truc Bach pedal boats",
    description: "Pedal boats on Truc Bach Lake, nicest in late afternoon.",
    reasonHint: "City views from the water.",
  },
  'thong-nhat-park': {
    name: "Thong Nhat Park",
    description: "A large central park, with boats as well.",
    reasonHint: "Greenery in the middle of the city.",
  },
  'hoan-kiem-walking-street': {
    name: "Hoan Kiem walking street",
    description: "The lake streets close to cars on weekend nights.",
    reasonHint: "Walk the lake with little traffic.",
  },
  'hanoi-house-cafe': {
    name: "Hanoi House Cafe",
    description: "A café in an old house, quiet down an alley.",
    reasonHint: "A calm drink in the Old Quarter.",
  },
  'banh-tom-tay-ho': {
    name: "West Lake banh tom",
    description: "Fried shrimp cakes around West Lake, easy after a walk.",
    reasonHint: "Local fried snacks by the lake.",
  },
  'bun-cha-hang-manh': {
    name: "Bun cha Hang Manh",
    description: "An Old Quarter bun cha shop with a strong charcoal smell.",
    reasonHint: "Classic noodles and grilled pork.",
  },
  'bun-dau-hang-khay': {
    name: "Bun dau Hang Khay",
    description: "Tofu, noodles, and shrimp paste; toasted and sour.",
    reasonHint: "A true Hanoi flavor mix.",
  },
  'phu-tay-ho-temple': {
    name: "Phu Tay Ho Temple",
    description: "A temple on West Lake, busy with local worshippers.",
    reasonHint: "Lake and shrine in one stop.",
  },
  'quan-su-pagoda': {
    name: "Quan Su Pagoda",
    description: "The central pagoda of the Buddhist association, quiet downtown.",
    reasonHint: "A calm temple in the city.",
  },
  'women-museum': {
    name: "Vietnamese Women’s Museum",
    description: "Exhibits on women’s lives and history, clearly presented.",
    reasonHint: "Another side of society.",
  },
  'truc-bach-lake': {
    name: "Truc Bach Lake",
    description: "A smaller lake beside West Lake, good for a walk.",
    reasonHint: "A shorter loop than West Lake.",
  },
  'bun-oc-o-quan-chuong': {
    name: "Bun oc O Quan Chuong",
    description: "Snail noodles near the eastern gate, in a sour broth.",
    reasonHint: "Another Old Quarter noodle.",
  },
  'nem-nuong-au-trieu': {
    name: "Nem nuong Au Trieu",
    description: "Grilled spring rolls by the cathedral, good for an evening graze.",
    reasonHint: "An easy bite after the church.",
  },
  'tra-chanh-cathedral': {
    name: "Lemon tea by the cathedral",
    description: "Street drinks in front of St Joseph’s, popular with younger visitors.",
    reasonHint: "A cheap pause at the church.",
  },
  'hero-club': {
    name: "Hero Club",
    description: "A nightclub with DJs and a wide floor.",
    reasonHint: "Music into the small hours.",
  },
  'binh-minh-jazz': {
    name: "Binh Minh Jazz Club",
    description: "A small jazz club with live sets.",
    reasonHint: "Quiet night music.",
  },
  'bar-1900': {
    name: "Bar 1900",
    description: "A well-known Old Quarter bar, strong on lights and music.",
    reasonHint: "A loud night out.",
  },
  'ay-cafe-lounge': {
    name: "Ay Café & Lounge",
    description: "A café lounge with live music at night.",
    reasonHint: "A drink with music after dark.",
  },
  'aeon-mall-ha-dong': {
    name: "AEON Mall Ha Dong",
    description: "A large mall in Ha Dong with indoor play.",
    reasonHint: "Shop and rest in the west of the city.",
  },
  'pho-cuon-tay-ho': {
    name: "West Lake pho cuon",
    description: "Fresh pho rolls, a light bite by the lake.",
    reasonHint: "A light noodle after walking.",
  },
  'cafemart-old-quarter': {
    name: "Cafemart",
    description: "A 24-hour café above a convenience store in the Old Quarter.",
    reasonHint: "Sit down even late.",
  },
  'mi-van-than-dinh-liet': {
    name: "Mi van than Dinh Liet",
    description: "Wonton noodles on Dinh Liet, named in local guides.",
    reasonHint: "Another Hanoi noon noodle.",
  },
  'kamogawa-sea-world': {
    name: "Kamogawa Sea World",
    description: "An aquarium facing the Pacific, known for orca shows.",
    reasonHint: "A full look at marine life.",
  },
  'ryugujo-mikazuki': {
    name: "Ryugujo Spa Hotel Mikazuki",
    description: "A bay resort with hot springs and pools. Day-use spa is available.",
    reasonHint: "Soak and look out over the water.",
  },
  'mitsui-outlet-kisarazu': {
    name: "Mitsui Outlet Park Kisarazu",
    description: "One of the largest outlet malls near Tokyo, with shops and food.",
    reasonHint: "Cover many brands in one stop.",
  },
  'umihotaru': {
    name: "Umihotaru",
    description: "A parking area on the Aqua-Line with sea and night views.",
    reasonHint: "Pause above the water.",
  },
  'yoro-keikoku': {
    name: "Yoro Valley",
    description: "A gorge known for autumn color and walks. Good views from the bridges.",
    reasonHint: "A quiet walk through woods and valley.",
  },
  'isumi-railway': {
    name: "Isumi Railway",
    description: "A local line with rural and near-sea views from the window.",
    reasonHint: "A slow train for scenery.",
  },
  'shimizu-park': {
    name: "Shimizu Park",
    description: "A large park with camping and play equipment. Good for families.",
    reasonHint: "Move around in the greenery.",
  },
  'forest-adventure-tazania': {
    name: "Forest Adventure Tazania",
    description: "Forest courses with zip lines among the trees.",
    reasonHint: "An active stretch in the canopy.",
  },
  'inubosaki-lighthouse': {
    name: "Inubosaki Lighthouse",
    description: "A lighthouse at the eastern edge of Honshu, facing the Pacific.",
    reasonHint: "Photos of sea and tower.",
  },
  'tsurigasaki-beach': {
    name: "Tsurigasaki Beach",
    description: "A surfing coast that also hosted Olympic events.",
    reasonHint: "Waves and a wide sandy shore.",
  },
  'choshi-ocean-institute': {
    name: "Choshi Ocean Institute",
    description: "A base for dolphin and whale watching, close to the sea.",
    reasonHint: "Go out to meet marine animals.",
  },
  'hasunuma-water-garden': {
    name: "Hasunuma Water Garden",
    description: "A summer pool and seaside leisure park.",
    reasonHint: "A long stretch of water play.",
  },
  'botanica-museum': {
    name: "BOTANICA MUSEUM",
    description: "A museum of plants and space, good for photos.",
    reasonHint: "Linger over greenery and displays.",
  },
  'okinoshima-beach': {
    name: "Okinoshima Beach",
    description: "A Tateyama swimming beach with clear water.",
    reasonHint: "A swim on the Minami-Boso coast.",
  },
  'kujukuri-beach': {
    name: "Kujukuri Beach",
    description: "A long Pacific sandy shore, good for a walk.",
    reasonHint: "Feel the wind on a wide beach.",
  },
  'oyama-senmaida': {
    name: "Oyama Senmaida",
    description: "Terraced rice fields, known for evening light as well.",
    reasonHint: "Photograph the stepped paddies.",
  },
  'windmill-liefde': {
    name: "Windmill Liefde",
    description: "A Dutch-style windmill near Inba Marsh, nice in flower season.",
    reasonHint: "Photos of mill and water.",
  },
  'rosemary-park': {
    name: "Michinoeki Rosemary Park",
    description: "A roadside station with herb gardens, souvenirs, and walks.",
    reasonHint: "A scented break near the sea.",
  },
  'funabashi-andersen': {
    name: "Funabashi Andersen Park",
    description: "A large Denmark-themed park with flowers and play areas.",
    reasonHint: "Enough greenery for a long stay.",
  },
  'nomizo-falls': {
    name: "Nomizo Falls and Kameiwado Cave",
    description: "A waterfall famous for heart-shaped light in the cave.",
    reasonHint: "A striking natural photo stop.",
  },
  'futtsu-cape': {
    name: "Futtsu Cape lookout",
    description: "A cape overlooking Tokyo Bay. It can be windy.",
    reasonHint: "A wide view of the bay.",
  },
  'niemonsima': {
    name: "Niemon Island",
    description: "A small island reached by boat, also a film location.",
    reasonHint: "Walk an island in the bay.",
  },
  'roman-no-mori': {
    name: "Roman no Mori Republic",
    description: "A forest leisure park with play and nature activities.",
    reasonHint: "A half day among the trees.",
  },
  'akebono-yama': {
    name: "Akebono-yama Farm Park",
    description: "A farm park with flowers, views, and seasonal fields.",
    reasonHint: "Flowers and a view together.",
  },
  'sakuranoyama-park': {
    name: "Sakuranoyama Park",
    description: "A hill known for airport planes and cherry trees.",
    reasonHint: "Watch takeoffs up close.",
  },
  'ichihara-elephant': {
    name: "Ichihara Elephant Kingdom",
    description: "A zoo known for elephants, good for families.",
    reasonHint: "Meet large animals.",
  },
  'boso-no-mura': {
    name: "Boso no Mura",
    description: "An open-air museum of old streets and samurai houses.",
    reasonHint: "Walk through historic Boso life.",
  },
  'aviation-museum': {
    name: "Museum of Aeronautical Science",
    description: "An aviation museum beside Narita Airport, with real aircraft.",
    reasonHint: "See how planes work up close.",
  },
  'hoda-elementary-station': {
    name: "Michinoeki Hoda Elementary",
    description: "A roadside station in a former school, with a cafeteria and gifts.",
    reasonHint: "Eat and rest in a school building.",
  },
  'hoki-museum': {
    name: "Hoki Museum",
    description: "A museum of realist painting; the building is a draw too.",
    reasonHint: "Look at pictures in quiet.",
  },
  'showa-no-mori': {
    name: "Showa no Mori Park",
    description: "A leafy park for walking and a rest.",
    reasonHint: "Greenery close to the city.",
  },
  'narita-yume-farm': {
    name: "Narita Yume Farm",
    description: "A tourist farm with dairy treats and grass sliding.",
    reasonHint: "Animals and farm food.",
  },
  'sakura-samurai-houses': {
    name: "Sakura samurai houses",
    description: "Preserved samurai homes; the castle park is nearby.",
    reasonHint: "A look at castle-town life.",
  },
  'choshi-round-earth': {
    name: "Earth-Round Observatory",
    description: "A lookout where the Pacific looks curved. Also known for first sunrise.",
    reasonHint: "Feel the curve of the horizon.",
  },
  'katakai-beach': {
    name: "Katakai Beach",
    description: "A Kujukuri sandy beach, also known for fireworks.",
    reasonHint: "Walk the long shore.",
  },
  'nojimazaki-lighthouse': {
    name: "Nojimazaki Lighthouse",
    description: "The southern tip of the Boso Peninsula, open to the sea.",
    reasonHint: "Wind and views at the south end.",
  },
  'haraoka-pier': {
    name: "Haraoka Pier",
    description: "A wooden pier popular for photos, especially at dusk.",
    reasonHint: "Walk the pier over the water.",
  },
  'tateyama-castle': {
    name: "Tateyama Castle and park",
    description: "A hill with a reconstructed keep overlooking Tateyama Bay.",
    reasonHint: "Castle and sea in one stop.",
  },
  'katsuura-undersea-tower': {
    name: "Katsuura Undersea Tower",
    description: "A tower with windows into the water, for watching fish.",
    reasonHint: "See underwater without diving.",
  },
  'ubara-coast': {
    name: "Ubara Coast",
    description: "Cliffs and sea views with walking paths.",
    reasonHint: "Walk the Minami-Boso shoreline.",
  },
  'kameyama-lake': {
    name: "Lake Kameyama",
    description: "A quiet reservoir, also nice in autumn color.",
    reasonHint: "A pause by the water.",
  },
  'shisui-outlet': {
    name: "Shisui Premium Outlets",
    description: "An outlet mall near Narita Airport; many shops stay open into the evening.",
    reasonHint: "Shop before or after a flight.",
  },
  'i-link-town': {
    name: "i-link Town observatory",
    description: "A high lookout in Ichikawa, with Tokyo-side night views.",
    reasonHint: "City lights from above.",
  },
  'keisei-rose-garden': {
    name: "Keisei Rose Garden",
    description: "A rose garden in Yachiyo, at its best in bloom.",
    reasonHint: "Unhurried flower photos.",
  },
  'hondoji-temple': {
    name: "Hondoji Temple",
    description: "A Matsudo temple known for hydrangeas and autumn color.",
    reasonHint: "Seasonal flowers with a temple visit.",
  },
  'kominato-railway': {
    name: "Kominato Railway",
    description: "A local line through satoyama, known for window views.",
    reasonHint: "Feel inland Boso by train.",
  },
  'moriya-coast': {
    name: "Moriya Coast",
    description: "A beach known for a small island with a red torii offshore.",
    reasonHint: "Sea and torii in one frame.",
  },
  'katsuura-tantanmen': {
    name: "Katsuura tantanmen",
    description: "Spicy ramen that started in Katsuura, a local specialty.",
    reasonHint: "One bowl of Boso flavor.",
  },
  'white-gyoza': {
    name: "White gyoza",
    description: "Pale-skinned dumplings associated with Funabashi.",
    reasonHint: "Local food at an easy price.",
  },
  'hakarime-don': {
    name: "Hakarime rice bowl",
    description: "A sardine rice bowl from Kyonan, with a fresh sea taste.",
    reasonHint: "Local fish in one bowl.",
  },
  'suzuki-meshi': {
    name: "Suzuki-meshi",
    description: "A sea-bass rice dish from Katsuura.",
    reasonHint: "Port-town fish, simply served.",
  },
  'peanut-soft-cream': {
    name: "Peanut soft-serve",
    description: "Soft-serve in peanut country.",
    reasonHint: "A Chiba-style sweet break.",
  },
  'choshi-tuna-don': {
    name: "Choshi tuna bowl",
    description: "A thick-cut raw tuna bowl at the fishing port.",
    reasonHint: "Tuna where it is landed.",
  },
  'egawa-clamming': {
    name: "Egawa clamming flats",
    description: "Tokyo Bay clamming, in season.",
    reasonHint: "Hunt for shells in the shallows.",
  },
  'mitsui-outlet-makuhari': {
    name: "Mitsui Outlet Park Makuhari",
    description: "An outlet mall in Makuhari, easy from Kaihin-Makuhari.",
    reasonHint: "Shopping beside sightseeing.",
  },
  'shirako-onsen': {
    name: "Shirako Onsen",
    description: "A Kujukuri hot-spring town with day-use baths.",
    reasonHint: "Soak after the beach.",
  },
  'sakura-furusato': {
    name: "Sakura Furusato Square",
    description: "A plaza for flowers and events, with seasonal views.",
    reasonHint: "A change of pace on the lawn.",
  },
  'futtsu-clamming': {
    name: "Futtsu clamming beach",
    description: "Clamming on the Futtsu tidal flats, best in spring.",
    reasonHint: "Shallow-water fun for families.",
  },
  'onjuku-beach': {
    name: "Onjuku Beach",
    description: "A beach known for the “Desert of the Moon,” also for swimming.",
    reasonHint: "Walk a Minami-Boso shore.",
  },
  'choshi-fish-market': {
    name: "Choshi seafood market",
    description: "Market stalls around the landings; rice bowls too.",
    reasonHint: "Port energy in the morning.",
  },
  'akanohama-night': {
    name: 'Akanohama Green Space at night',
    description: 'A waterfront green with Makuhari towers and the bay after dark. Good for a walk and photos.',
    reasonHint: 'See Makuhari’s night lights by the sea.',
  },
  'factory-night-cruise': {
    name: 'Chiba Port factory night cruise',
    description: 'A harbor boat for factory lights. Sailings cluster around sunset.',
    reasonHint: 'Watch the port lights from the water.',
  },
  'kimisarazu-tower-night': {
    name: 'Kimisarazu Tower at night',
    description: 'The tower in Odayama Park. After dark you see the city and Tokyo Bay.',
    reasonHint: 'Photograph Kisarazu’s night view from above.',
  },
  'daikeien': {
    name: 'Daikeien',
    description: 'A hall with dining and entertainment. Easy to stay into the evening.',
    reasonHint: 'Food and night leisure in one place.',
  },
  'makuhari-yuraku': {
    name: 'Makuhari Onsen Yuraku-no-Sato',
    description: 'A day-use hot spring in Kaihin-Makuhari. Open late, so it works as a last stop.',
    reasonHint: 'Soak after sightseeing.',
  },
  'sanbanze-night': {
    name: 'Funabashi Sanbanze at night',
    description: 'A park opening onto tidal flats and the sea. Fine for a dusk-to-night walk.',
    reasonHint: 'Feel the night breeze on Funabashi’s shore.',
  },
  'chiba-port-park-night': {
    name: 'Chiba Port Park at night',
    description: 'The park at the foot of the Port Tower. Walk among the harbor lights.',
    reasonHint: 'Stroll the port at night near the tower.',
  },
  'kuukai-makuhari': {
    name: 'Kuukai Kaihin-Makuhari',
    description: 'A restaurant high above Makuhari with night views over dinner.',
    reasonHint: 'Eat with the city lights in the window.',
  },
  'philocoffea-funabashi': {
    name: 'Philocoffea 201',
    description: 'A specialty coffee shop in Funabashi. Canelés are popular too.',
    reasonHint: 'Pause for a serious cup of coffee.',
  },
  'houei-coffee-narita': {
    name: 'HOUEI COFFEE Naritasan',
    description: 'A roastery near the Naritasan approach. Handy before or after the temple.',
    reasonHint: 'Fresh coffee by the temple gate.',
  },
  'tucano-narita': {
    name: 'Tucano',
    description: 'A folk-house cafe in Narita Daiei. Brazilian dishes as well as drinks.',
    reasonHint: 'Rest in a quiet old house.',
  },
  'caffe-vista-port-tower': {
    name: 'Caffé Vista 109',
    description: 'The cafe on the Port Tower viewing floor. Pause with a view of the harbor.',
    reasonHint: 'Drinks and a high view together.',
  },
  'tonarino-cafe': {
    name: 'Tonarino Cafe',
    description: 'A cafe next to a cake shop in Higashi-Funabashi. Parfaits and chiffon cake stand out.',
    reasonHint: 'Spend the afternoon with sweets and coffee.',
  },
  'mother-farm-milk-cafe': {
    name: 'Mother Farm milk cafe',
    description: 'Soft-serve and dairy inside the farm.',
    reasonHint: 'A sweet stop after the animals.',
  },
  'cafe-umihotaru': {
    name: 'Umihotaru cafe',
    description: 'A rest stop on Umihotaru. Drinks over the water.',
    reasonHint: 'A pause midway on the Aqua-Line.',
  },
  'rosemary-park-cafe': {
    name: 'Rosemary Park cafe',
    description: 'The cafe at the roadside station. Good after the herb garden.',
    reasonHint: 'A break on a Minami-Boso drive.',
  },
  'nagisa-no-eki-cafe': {
    name: 'Nagisa-no-Eki Tateyama cafe',
    description: 'The roadside station at Tateyama Port. Rest with a view of the water.',
    reasonHint: 'Drinks beside the harbor.',
  },
  'shisui-outlet-cafe': {
    name: 'Shisui Outlet cafe',
    description: 'A cafe inside the outlet mall. Handy between shops.',
    reasonHint: 'Sit down in the middle of shopping.',
  },
  'cafe-dinh': {
    name: 'Cafe Dinh',
    description: 'Egg coffee overlooking Hoan Kiem Lake, run by the inventor’s daughter.',
    reasonHint: 'Lake views with the famous coffee.',
  },
  'tranquil-books-coffee': {
    name: 'Tranquil Books & Coffee',
    description: 'A quiet book-lined cafe a little off the tourist streets.',
    reasonHint: 'Rest with books and coffee away from the crowds.',
  },
  'hidden-gem-coffee': {
    name: 'Hidden Gem Coffee',
    description: 'A tucked-away Old Quarter cafe with interiors from reclaimed materials.',
    reasonHint: 'A photogenic pause in an alley.',
  },
  'hanoi-social-club': {
    name: 'Hanoi Social Club',
    description: 'A cafe in a colonial-style house. Light meals and coffee.',
    reasonHint: 'A calm lunch in a French-era building.',
  },
  'ma-may-ancient-house': {
    name: 'Hanoi Ancient House',
    description: 'A traditional house on Ma May Street. A glimpse of Old Quarter life.',
    reasonHint: 'Touch Old Quarter history in a short visit.',
  },
  'yen-so-park': {
    name: 'Yen So Park',
    description: 'A large park with a lake. Good for cycling and walking.',
    reasonHint: 'Green space a little outside the center.',
  },
  'metropole-facade': {
    name: 'Sofitel Metropole façade',
    description: 'The French-era grand hotel exterior. A well-known photo stop.',
    reasonHint: 'Photograph a historic colonial façade.',
  },
  'hang-dao-street': {
    name: 'Hang Dao Street',
    description: 'An Old Quarter shopping street of clothes and small goods.',
    reasonHint: 'Hunt for affordable souvenirs on foot.',
  },
  'manzi-art': {
    name: 'Manzi Art Space',
    description: 'A small contemporary art space with a cafe.',
    reasonHint: 'Look at work in a quiet room.',
  },
  'quang-an-walk': {
    name: 'Quang An stroll',
    description: 'A quiet street along West Lake, with flowers and cafes.',
    reasonHint: 'Walk slowly by the water.',
  },
  'bia-hoi-corner': {
    name: 'Bia Hoi Corner',
    description: 'A junction of cheap draught beer. Locals gather from late afternoon.',
    reasonHint: 'Taste the street at night with a casual glass.',
  },
  'banh-mi-25': {
    name: 'Banh Mi 25',
    description: 'A popular banh mi shop on Hang Ca. Quick to eat.',
    reasonHint: 'Try a Hanoi sandwich while walking.',
  },
}
