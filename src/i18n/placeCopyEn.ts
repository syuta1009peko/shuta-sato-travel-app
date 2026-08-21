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
    name: 'Red River green space',
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
  'la-verticale': {
    name: 'La Verticale',
    description: 'A more special dinner using Vietnamese ingredients.',
    reasonHint: 'For an occasion-feeling evening meal.',
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
  'onogawa': {
    name: 'Walk along the Ono River',
    description: 'Boats and storehouses on a flat, easy path.',
    reasonHint: 'A gentle stroll with photos.',
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
}
