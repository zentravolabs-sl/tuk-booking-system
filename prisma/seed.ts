import { PrismaClient, AdminRole, PriceType, DiscountType, OfferType, BookingType, BookingStatus, ReviewStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Ella Tuk Tuk Taxi Service database...");

  // 1. Admin Users
  const superAdminPassword = await bcrypt.hash("Admin@Ella2026!", 10);
  const managerPassword = await bcrypt.hash("Manager@Ella2026!", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "kavithsasalanka@gmail.com" },
    update: {
      name: "Kavith Sasalanka",
      passwordHash: superAdminPassword,
      role: AdminRole.SUPER_ADMIN,
      active: true
    },
    create: {
      email: "kavithsasalanka@gmail.com",
      name: "Kavith Sasalanka",
      passwordHash: superAdminPassword,
      role: AdminRole.SUPER_ADMIN,
      active: true
    }
  });

  await prisma.user.upsert({
    where: { email: "manager@ellatuktuktaxiservice.com" },
    update: {
      name: "Kasun Bandara (Fleet Manager)",
      passwordHash: managerPassword,
      role: AdminRole.MANAGER,
      active: true
    },
    create: {
      email: "manager@ellatuktuktaxiservice.com",
      name: "Kasun Bandara (Fleet Manager)",
      passwordHash: managerPassword,
      role: AdminRole.MANAGER,
      active: true
    }
  });

  // 2. Site Settings & FAQs
  const defaultFaqs = [
    {
      question: "How many passengers can travel comfortably in one Tuk Tuk?",
      answer: "A standard Sri Lankan Tuk Tuk comfortably seats up to 3 adult passengers with daypacks, or 2 passengers with large suitcases. For larger groups or families, we assign a convoy of multiple Tuk Tuks traveling together with synchronized drivers."
    },
    {
      question: "Are your prices per person or per Tuk Tuk?",
      answer: "Most of our destination rides and day tours are priced per Tuk Tuk (up to 3 passengers), giving you exceptional value and private flexibility. Each destination card clearly displays whether the price is Per Trip or Per Person."
    },
    {
      question: "Can we customize our itinerary or stop for photos along the way?",
      answer: "Absolutely! That is the biggest charm of exploring Ella by Tuk Tuk. Our local drivers know every hidden viewpoint, tea trail, and photo angle, and will gladly stop whenever you want."
    },
    {
      question: "How do I pay for my booking, and is advance payment required?",
      answer: "You can book online in 60 seconds with instant confirmation and pay your driver directly in USD, EUR, or Sri Lankan Rupees (LKR) at the end of your trip. No hidden booking fees!"
    },
    {
      question: "Do you provide early morning sunrise pickups for Little Adam's Peak and Nine Arch Bridge?",
      answer: "Yes! Our drivers operate 24/7. Sunrise rides (starting at 5:00 AM or 5:30 AM) to Little Adam's Peak, Ella Rock trailhead, and Lipton's Seat are our most popular trips."
    },
    {
      question: "What happens if it rains or my train to Ella is delayed?",
      answer: "All our Tuk Tuks are equipped with full roll-down weatherproof rain curtains. If your train to Ella or Demodara is delayed, we track the railway schedule and wait for you at no extra charge."
    }
  ];

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      businessName: "Kavith Tuk Tuk Service",
      phone: "0785089432",
      whatsapp: "+94785089432",
      email: "Kavithsasalanka@gmail.com",
      seoTitle: "Kavith Tuk Tuk Service | #1 Local Tours & Tuk Tuk Booking in Ella, Sri Lanka",
      seoDescription: "Book authentic Tuk Tuk tours, Nine Arch Bridge rides, waterfall adventures, and Sri Lanka transfers with Kavith Tuk Tuk Service. Transparent pricing & trusted local drivers.",
      faqs: defaultFaqs,
      aboutStory:
        "Founded in the heart of Ella town by Kavith Sasalanka and a collective of passionate local owner-drivers, Kavith Tuk Tuk Service began with a simple promise: to treat every traveler like an honored guest in our highland home. Over the years, we have grown into Ella's most trusted fleet of colorful, well-maintained Tuk Tuks and friendly English-speaking guides who know every misty tea ridge, railway schedule, and hidden waterfall cascading through the Uva Province.",
      aboutMission:
        "Our mission is to deliver safe, transparent, authentic, and unforgettable Sri Lankan hill-country adventures while directly empowering local Ella families through sustainable community tourism."
    },
    create: {
      id: "default",
      businessName: "Kavith Tuk Tuk Service",
      tagline: "Explore Ella. Experience More.",
      heroHeadline: "Explore Ella. Experience More.",
      heroSubheadline:
        "Discover breathtaking views, hidden waterfalls and unforgettable adventures with our trusted local Tuk Tuk service.",
      heroBackgroundImage:
        "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=2000&q=85",
      phone: "0785089432",
      whatsapp: "+94785089432",
      email: "Kavithsasalanka@gmail.com",
      address: "Main Street, Near Railway Station, Ella 90090, Sri Lanka",
      aboutHeadline: "Born in the Misty Hills of Ella, Driven by Local Hospitality",
      aboutStory:
        "Founded in the heart of Ella town by Kavith Sasalanka and a collective of passionate local owner-drivers, Kavith Tuk Tuk Service began with a simple promise: to treat every traveler like an honored guest in our highland home. Over the years, we have grown into Ella's most trusted fleet of colorful, well-maintained Tuk Tuks and friendly English-speaking guides who know every misty tea ridge, railway schedule, and hidden waterfall cascading through the Uva Province.",
      aboutMission:
        "Our mission is to deliver safe, transparent, authentic, and unforgettable Sri Lankan hill-country adventures while directly empowering local Ella families through sustainable community tourism.",
      faqs: defaultFaqs
    }
  });

  // 3. Destination Categories
  const categoriesData = [
    { name: "Iconic Landmarks", slug: "iconic-landmarks", description: "World-famous colonial bridges, railway loops, and heritage architecture.", icon: "Landmark", sortOrder: 1 },
    { name: "Mountain Peaks & Hikes", slug: "mountain-peaks-hikes", description: "Panoramic viewpoints, sunrise treks, and misty highland ridges.", icon: "Mountain", sortOrder: 2 },
    { name: "Waterfalls & Nature", slug: "waterfalls-nature", description: "Cascading jungle waterfalls, natural infinity pools, and lush valleys.", icon: "Waves", sortOrder: 3 },
    { name: "Tea Estates & Culture", slug: "tea-estates-culture", description: "Ceylon tea factories, emerald plantations, and ancient cave legends.", icon: "Leaf", sortOrder: 4 }
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.destinationCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat
    });
    categories[cat.slug] = created.id;
  }

  // 4. All 9 Required Sample Destinations
  const destinationsData = [
    {
      name: "Nine Arch Bridge",
      slug: "nine-arch-bridge",
      categoryId: categories["iconic-landmarks"],
      shortDescription: "Marvel at Sri Lanka's world-famous colonial viaduct tucked deep inside a lush emerald tea valley as the blue mountain train glides across.",
      description:
        "Known locally as 'Ahas Namaye Palama' (The Bridge of Nine Skies), the Nine Arch Bridge in Demodara is an extraordinary masterpiece of British-Ceylonese railway engineering built entirely of stone, brick, and cement without a single piece of steel. Our Tuk Tuk takes you through a secret forest ridge road straight to the upper viewpoint, saving you the steep walk from main town, and our local drivers time your arrival perfectly with the iconic blue Kandy-Badulla train crossing.",
      coverImage: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=85",
      price: 15,
      currency: "USD",
      priceType: PriceType.PER_TRIP,
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      finalPrice: 12,
      distance: "3.5 km from Ella Town",
      travelTime: "15 mins",
      entranceFee: "Free Entry",
      location: "Gotuwala, Ella - Demodara Railway Line",
      googleMapsUrl: "https://maps.google.com/?q=Nine+Arch+Bridge+Ella",
      bestTimeToVisit: "6:30 AM - 9:30 AM & 3:00 PM - 5:30 PM (Train Schedule)",
      highlights: [
        "Direct Tuk Tuk drop-off at the secret upper tea plantation viewpoint",
        "Timed arrival for the famous Blue Mountain Train crossing",
        "Stop at Asanka Cafe overlooking the 9 stone arches",
        "Wait time of 1.5 hours included for walking on the tracks & photography"
      ],
      includedServices: [
        "Hotel Pickup & Drop-off in Ella",
        "Train Schedule Timing Guidance",
        "90 Minutes Waiting Time Included",
        "Experienced Local English-Speaking Driver"
      ],
      popular: true,
      featured: true,
      active: true,
      seoTitle: "Nine Arch Bridge Tuk Tuk Ride & Train Schedule Tour | Ella Tuk Tuk Taxi",
      seoDescription: "Book a private Tuk Tuk to Nine Arch Bridge in Ella. Direct forest viewpoint drop-off, exact train crossing timings, and hotel pickup included.",
      gallery: [
        "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      name: "Little Adam's Peak",
      slug: "little-adams-peak",
      categoryId: categories["mountain-peaks-hikes"],
      shortDescription: "Experience a breathtaking 360-degree sunrise or golden sunset panorama over Ella Gap from an easy, family-friendly mountain ridge trail.",
      description:
        "Named after its sacred bigger brother Adam's Peak due to its similar pyramidal silhouette, Little Adam's Peak rises 1,141 meters above sea level and offers the most rewarding short hike in Sri Lanka. Our Tuk Tuk drops you right at the 98 Acres Resort & Flower Garden trailhead, cutting out the uphill road walk so you can stroll leisurely through fragrant tea estates to the triple summit ridges.",
      coverImage: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1400&q=85",
      price: 14,
      currency: "USD",
      priceType: PriceType.PER_TRIP,
      discountType: DiscountType.FIXED,
      discountValue: 2,
      finalPrice: 12,
      distance: "2.8 km from Ella Town",
      travelTime: "10 mins drive + 30 mins hike",
      entranceFee: "Free Entry",
      location: "Passara Road, Ella",
      googleMapsUrl: "https://maps.google.com/?q=Little+Adams+Peak+Ella",
      bestTimeToVisit: "5:30 AM (Sunrise) or 4:00 PM (Sunset)",
      highlights: [
        "360° views of Ella Rock, Ella Gap, and rolling tea plantations",
        "Optional thrill stop at Flying Ravana Mega Zipline & Ravana Pool Club",
        "Easy 30-minute walk through lush green Ceylon tea bushes",
        "Golden hour photography guidance from your driver"
      ],
      includedServices: [
        "Round-trip Tuk Tuk Transfer to Trailhead",
        "2 Hours Waiting Time Included",
        "Complimentary Bottled Water",
        "Early Morning Sunrise Pickup Available"
      ],
      popular: true,
      featured: true,
      active: true,
      seoTitle: "Little Adam's Peak Sunrise & Sunset Tuk Tuk Ride | Ella Sri Lanka",
      seoDescription: "Ride comfortably to the Little Adam's Peak trailhead in Ella. Ideal for sunrise and sunset hikes with waiting time and hotel transfer included.",
      gallery: [
        "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      name: "Ravana Falls",
      slug: "ravana-falls",
      categoryId: categories["waterfalls-nature"],
      shortDescription: "Feel the cool tropical mist of one of Sri Lanka's widest cascading waterfalls steeped in the ancient Ramayana legend of King Ravana.",
      description:
        "Plunging 25 meters down a dramatic series of tiered granite ledges in the Ravana Ella Wildlife Sanctuary, Ravana Falls is a roaring spectacle down the winding Ella-Wellawaya mountain pass. Enjoy a breezy Tuk Tuk descent through Ella Gap with panoramic valley views before cooling your feet in the crystal mountain stream at the base of the cascade.",
      coverImage: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1400&q=85",
      price: 15,
      currency: "USD",
      priceType: PriceType.PER_TRIP,
      discountType: DiscountType.NONE,
      discountValue: 0,
      finalPrice: 15,
      distance: "6.2 km from Ella Town",
      travelTime: "15 mins",
      entranceFee: "Free Entry",
      location: "Ella-Wellawaya Highway (A23)",
      googleMapsUrl: "https://maps.google.com/?q=Ravana+Falls+Ella",
      bestTimeToVisit: "8:00 AM - 5:00 PM",
      highlights: [
        "Scenic descent down the dramatic Ella Gap mountain pass",
        "Close-up waterfall viewing deck and natural rock pools",
        "Fresh king coconut & roasted corn stalls by the bridge",
        "Folklore stories of King Ravana and Princess Sita"
      ],
      includedServices: [
        "Private Tuk Tuk Return Ride",
        "Scenic Viewpoint Stops Along Ella Gap",
        "60 Minutes Waiting Time at the Falls",
        "Hotel Pickup & Drop-off"
      ],
      popular: true,
      featured: false,
      active: true,
      seoTitle: "Ravana Falls Tuk Tuk Excursion from Ella | Waterfall Tours",
      seoDescription: "Visit the majestic Ravana Falls down the Ella Gap mountain pass with an experienced local Tuk Tuk driver.",
      gallery: [
        "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      name: "Ella Rock",
      slug: "ella-rock",
      categoryId: categories["mountain-peaks-hikes"],
      shortDescription: "Conquer Ella's most dramatic cliffside summit with direct Tuk Tuk transfer to Kithalella Station trailhead and optional local trail guidance.",
      description:
        "Towering high above the southern valley, Ella Rock is the ultimate bucket-list trek for adventure lovers visiting Sri Lanka's hill country. Instead of walking extra kilometers along busy roads from town, our Tuk Tuk drives you straight to Kithalella Railway Station or the secret upper tea village shortcut, giving you clear directions past the eucalyptus forest to the jaw-dropping summit cliff.",
      coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1400&q=85",
      price: 20,
      currency: "USD",
      priceType: PriceType.PER_TRIP,
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      finalPrice: 18,
      distance: "4.5 km to Trailhead",
      travelTime: "15 mins drive + 3 hrs hike",
      entranceFee: "Small Viewpoint Token (~$1)",
      location: "Kithalella Trailhead, Ella",
      googleMapsUrl: "https://maps.google.com/?q=Ella+Rock+Sri+Lanka",
      bestTimeToVisit: "5:30 AM - 10:00 AM (Before midday mist)",
      highlights: [
        "Skip the long railway walk with direct Kithalella trailhead transfer",
        "Exact route map & local trail tips to avoid getting lost in tea paths",
        "Flexible pickup coordination via WhatsApp when you finish descending",
        "Dramatic cliff-edge views across the southern plains to the ocean on clear mornings"
      ],
      includedServices: [
        "Early Morning Hotel Pickup",
        "Direct Transfer to Kithalella Trailhead",
        "On-Call Return Pickup After Your Hike",
        "Trail Navigation Briefing"
      ],
      popular: true,
      featured: true,
      active: true,
      seoTitle: "Ella Rock Trailhead Tuk Tuk Transfer & Sunrise Hike | Ella Taxi",
      seoDescription: "Start your Ella Rock trek the smart way with direct Tuk Tuk drop-off at Kithalella trailhead and guaranteed return pickup.",
      gallery: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      name: "Ravana Cave",
      slug: "ravana-cave",
      categoryId: categories["tea-estates-culture"],
      shortDescription: "Step inside a 25,000-year-old limestone cavern perched on a cliffside and linked to the legendary underground tunnels of King Ravana.",
      description:
        "Located 1,370 meters above sea level on a steep forested cliff face near the historic Maha Ravana Viharaya temple, Ravana Cave is one of Sri Lanka's most intriguing archaeological and mythological sites. According to the Ramayana epic, King Ravana hid Princess Sita within this network of subterranean passages. Our Tuk Tuk brings you right to the ancient temple steps at the base of the sanctuary.",
      coverImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1400&q=85",
      price: 18,
      currency: "USD",
      priceType: PriceType.PER_TRIP,
      discountType: DiscountType.NONE,
      discountValue: 0,
      finalPrice: 18,
      distance: "5.0 km from Ella Town",
      travelTime: "20 mins drive + 25 mins climb",
      entranceFee: "~$1.50 Temple Ticket",
      location: "Bandarawela Road, Ella",
      googleMapsUrl: "https://maps.google.com/?q=Ravana+Cave+Ella",
      bestTimeToVisit: "8:00 AM - 4:00 PM",
      highlights: [
        "Visit the 2,000-year-old Ravana Ella Cave Temple",
        "Climb the stone forest staircase into the prehistoric cavern",
        "Learn the captivating Ramayana trail history of Sri Lanka",
        "Combine easily with Ravana Falls or Nil Diya Pokuna"
      ],
      includedServices: [
        "Round-trip Tuk Tuk Transfer",
        "90 Minutes Waiting Time",
        "Flashlight / Torch Assistance",
        "English-Speaking Local Driver"
      ],
      popular: false,
      featured: false,
      active: true,
      seoTitle: "Ravana Cave & Ancient Temple Tuk Tuk Tour | Ella Sri Lanka",
      seoDescription: "Explore the legendary Ravana Cave and prehistoric cliff cavern in Ella with our guided Tuk Tuk transfer service.",
      gallery: [
        "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      name: "Diyaluma Falls",
      slug: "diyaluma-falls",
      categoryId: categories["waterfalls-nature"],
      shortDescription: "Swim in natural cliff-edge infinity rock pools atop Sri Lanka's second-highest waterfall (220m) on an unforgettable half-day Tuk Tuk adventure.",
      description:
        "Standing at a breathtaking 220 meters (720 feet), Diyaluma Falls is the second-highest waterfall in Sri Lanka and easily the most thrilling natural wonder near Ella. While most buses only pass the lower bridge, our skilled Tuk Tuk drivers take the scenic mountain road up through Poonagala tea estates to Upper Diyaluma, where a gentle 35-minute trail leads you to a series of crystal-clear natural infinity pools right at the very lip of the 220m precipice!",
      coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85",
      price: 45,
      currency: "USD",
      priceType: PriceType.PER_TRIP,
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15,
      finalPrice: 38.25,
      distance: "36 km from Ella Town",
      travelTime: "1 hr 15 mins each way",
      entranceFee: "Free Entry",
      location: "Koslanda / Poonagala Upper Trail",
      googleMapsUrl: "https://maps.google.com/?q=Upper+Diyaluma+Falls",
      bestTimeToVisit: "7:30 AM - 2:00 PM",
      highlights: [
        "Upper Diyaluma access via scenic Poonagala mountain road (shorter hike!)",
        "Swim safely in multi-tiered natural rock infinity pools overlooking the valley",
        "Photo stop at the base of the 220m waterfall and Ravana Falls en route",
        "Half-day private Tuk Tuk charter with driver waiting throughout"
      ],
      includedServices: [
        "Private Half-Day Tuk Tuk Charter (5-6 Hours)",
        "Upper & Lower Diyaluma Access",
        "Ravana Falls Photo Stop Included",
        "Bottled Water & Local Guide Assistance"
      ],
      popular: true,
      featured: true,
      active: true,
      seoTitle: "Upper Diyaluma Falls Natural Infinity Pools Tuk Tuk Tour from Ella",
      seoDescription: "Book the ultimate Upper Diyaluma Falls Tuk Tuk tour from Ella. Swim in natural rock infinity pools atop Sri Lanka's 2nd highest waterfall.",
      gallery: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      name: "Lipton's Seat",
      slug: "liptons-seat",
      categoryId: categories["tea-estates-culture"],
      shortDescription: "Ascend through Sir Thomas Lipton's historic Dambatenne Tea Estate to a 1,970m cloud-kissed summit overlooking five provinces of Sri Lanka.",
      description:
        "Perched high atop the Poonagala hills near Haputale, Lipton's Seat is the exact vantage point where Scottish tea pioneer Sir Thomas Lipton used to sit and survey his vast emerald empire. Climbing through narrow, winding cobblestone estate roads lined with century-old tea bushes is an unforgettable Tuk Tuk journey—best experienced at dawn before the clouds roll in. On the descent, visit the original 1890 Dambatenne Tea Factory.",
      coverImage: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=1400&q=85",
      price: 42,
      currency: "USD",
      priceType: PriceType.PER_TRIP,
      discountType: DiscountType.FIXED,
      discountValue: 5,
      finalPrice: 37,
      distance: "34 km from Ella Town",
      travelTime: "1 hr 15 mins each way",
      entranceFee: "~$1.50 Estate Gate Ticket",
      location: "Dambatenne Estate, Haputale",
      googleMapsUrl: "https://maps.google.com/?q=Liptons+Seat+Haputale",
      bestTimeToVisit: "5:00 AM Pickup for Sunrise View",
      highlights: [
        "Thrilling Tuk Tuk climb right to the 1,970m Lipton's Seat summit gate",
        "Panoramic views across 5 Sri Lankan provinces on clear mornings",
        "Guided stop at the historic 1890 Dambatenne Tea Factory",
        "Meet Tamil tea pluckers along the emerald plantation trails"
      ],
      includedServices: [
        "Sunrise Hotel Pickup in Ella",
        "Full Return Tuk Tuk Journey up Dambatenne Estate",
        "Tea Factory Stop Included",
        "Warm Ceylon Tea Stop with Mountain View"
      ],
      popular: true,
      featured: true,
      active: true,
      seoTitle: "Lipton's Seat Sunrise & Dambatenne Tea Estate Tuk Tuk Tour from Ella",
      seoDescription: "Experience a magical sunrise at Lipton's Seat (1,970m) and visit Dambatenne Tea Factory on a private Tuk Tuk tour from Ella.",
      gallery: [
        "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      name: "Demodara Railway Loop",
      slug: "demodara-railway-loop",
      categoryId: categories["iconic-landmarks"],
      shortDescription: "Witness the unique 360-degree spiral railway engineering marvel where the mountain train loops directly underneath its own station.",
      description:
        "Famous around the world as 'The Turban Loop' because the track spirals like a knot around the mountain before passing through a tunnel directly beneath Demodara Railway Station, the Demodara Loop is the only railway spiral of its kind in Sri Lanka. Our drivers take you to the panoramic hill lookout where you can watch the train circle the entire hilltop and disappear right under the Victorian station building.",
      coverImage: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1400&q=85",
      price: 16,
      currency: "USD",
      priceType: PriceType.PER_TRIP,
      discountType: DiscountType.NONE,
      discountValue: 0,
      finalPrice: 16,
      distance: "6.0 km from Ella Town",
      travelTime: "18 mins",
      entranceFee: "Free Entry",
      location: "Demodara Railway Station, Ella",
      googleMapsUrl: "https://maps.google.com/?q=Demodara+Railway+Station",
      bestTimeToVisit: "9:00 AM - 4:30 PM",
      highlights: [
        "Elevated viewpoint overlooking the full 360-degree spiral railway track",
        "Explore the charming British-colonial Demodara Railway Station",
        "Watch the train pass over the mountain and enter the tunnel below your feet",
        "Easily paired with Nine Arch Bridge & Halpe Tea Factory"
      ],
      includedServices: [
        "Return Tuk Tuk Transfer",
        "Loop Lookout Point Stop",
        "Demodara Heritage Station Visit",
        "Train Schedule Synchronization"
      ],
      popular: false,
      featured: false,
      active: true,
      seoTitle: "Demodara Railway Loop & Heritage Station Tuk Tuk Tour | Ella",
      seoDescription: "Visit the engineering marvel of Demodara 360-degree Railway Loop and colonial station by private Tuk Tuk from Ella.",
      gallery: [
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      name: "Halpe Tea Factory",
      slug: "halpe-tea-factory",
      categoryId: categories["tea-estates-culture"],
      shortDescription: "Discover how authentic Uva Highland Ceylon Tea is withered, rolled, fermented, and graded—complete with a panoramic tea tasting deck.",
      description:
        "Just 15 minutes from Ella town lies the renowned Uva Halpewatte Tea Factory, standing 1,230 meters above sea level amid rolling green slopes. Take a guided tour through the aromatic factory floors to see traditional and modern Ceylon tea processing firsthand, followed by a complimentary tasting of golden Pekoe, BOPF, and artisan green teas on their sky-high glass terrace.",
      coverImage: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=1400&q=85",
      price: 15,
      currency: "USD",
      priceType: PriceType.PER_TRIP,
      discountType: DiscountType.NONE,
      discountValue: 0,
      finalPrice: 15,
      distance: "5.8 km from Ella Town",
      travelTime: "15 mins",
      entranceFee: "~$5 Factory Tour & Tasting",
      location: "Halpe, Badulla Road, Ella",
      googleMapsUrl: "https://maps.google.com/?q=Uva+Halpewatte+Tea+Factory+Ella",
      bestTimeToVisit: "8:30 AM - 4:00 PM (Mon - Sat)",
      highlights: [
        "Full aroma-filled walk through a working Uva Highland tea factory",
        "Taste freshly brewed single-estate Ceylon teas overlooking the mountains",
        "Photo walk through the surrounding tea gardens",
        "Factory-direct tea boutique for authentic Sri Lankan gifts"
      ],
      includedServices: [
        "Round-trip Tuk Tuk Transfer from Ella Hotel",
        "90 Minutes Waiting Time at the Factory",
        "Scenic Tea Plantation Photo Stop",
        "Local Driver Assistance"
      ],
      popular: true,
      featured: false,
      active: true,
      seoTitle: "Uva Halpe Tea Factory Tour & Tasting Tuk Tuk Ride | Ella Sri Lanka",
      seoDescription: "Take a scenic Tuk Tuk ride to Uva Halpewatte Tea Factory in Ella for an authentic Ceylon tea tour and mountain tasting experience.",
      gallery: [
        "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=1200&q=80"
      ]
    }
  ];

  const createdDestinations: Record<string, string> = {};
  for (const dest of destinationsData) {
    const { gallery, ...destFields } = dest;
    const saved = await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: destFields,
      create: destFields
    });
    createdDestinations[dest.slug] = saved.id;

    await prisma.destinationImage.deleteMany({ where: { destinationId: saved.id } });
    for (let i = 0; i < gallery.length; i++) {
      await prisma.destinationImage.create({
        data: {
          destinationId: saved.id,
          url: gallery[i],
          altText: `${dest.name} view ${i + 1}`,
          caption: `${dest.name} — Ella Highland Experience`,
          sortOrder: i + 1
        }
      });
    }
  }

  // 5. Tour Packages
  const packagesData = [
    {
      name: "Ella Iconic Highlights Day Safari",
      slug: "ella-iconic-highlights-day-safari",
      tagline: "The #1 Bestselling Full-Day Ella Tuk Tuk Circuit",
      shortDescription: "Experience Nine Arch Bridge, Little Adam's Peak, Halpe Tea Factory, Demodara Loop, and Ravana Falls in one seamless private Tuk Tuk tour.",
      description:
        "Short on time in Ella and want to experience every postcard-famous landmark without rushing or worrying about directions? Our signature Ella Iconic Highlights Day Safari pairs you with one of our senior local driver-guides for a full day of mountain magic. From timing the blue train at Nine Arch Bridge to sipping fresh Uva tea at Halpewatte and watching the sunset from Little Adam's Peak, every detail is thoughtfully curated.",
      coverImage: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80"
      ],
      duration: "7 - 8 Hours (Full Day)",
      startTime: "08:00 AM",
      endTime: "04:30 PM",
      minPassengers: 1,
      maxPassengers: 3,
      price: 55,
      currency: "USD",
      discountType: DiscountType.FIXED,
      discountValue: 10,
      finalPrice: 45,
      itinerary: [
        { time: "08:00 AM", title: "Hotel Pickup & Scenic Forest Drive to Nine Arch Bridge", description: "Beat the crowds via our upper tea ridge road and watch the 9:15 AM morning mountain train cross the nine stone arches." },
        { time: "10:15 AM", title: "Demodara 360° Railway Loop & Colonial Station", description: "Watch how the railway spirals around the hilltop and tunnels directly underneath the station platform." },
        { time: "11:30 AM", title: "Uva Halpewatte Tea Factory & Tasting", description: "Explore the aromatic tea production floors and enjoy fresh Ceylon tea overlooking the Uva valley." },
        { time: "01:30 PM", title: "Ravana Cave & Cascading Ravana Falls", description: "Descend the dramatic Ella Gap pass to cool off by the roaring waters of Ravana Falls and enjoy a fresh King Coconut." },
        { time: "03:15 PM", title: "Golden Hour Hike up Little Adam's Peak", description: "Finish your day with a gentle 30-minute walk through lush tea estates for 360° sunset views over Ella Gap." }
      ],
      inclusions: [
        "Private Tuk Tuk Charter for Up to 3 Passengers",
        "Experienced English-Speaking Local Driver-Guide",
        "Chilled Bottled Water & Fresh King Coconut",
        "All Fuel, Parking, and Waiting Charges",
        "Hotel Pickup & Drop-off Anywhere in Ella"
      ],
      exclusions: [
        "Halpe Tea Factory Entrance Ticket (~$5/person)",
        "Lunch & Personal Expenses",
        "Optional Zipline Ticket at Little Adam's Peak"
      ],
      terms: "Free cancellation up to 12 hours before departure. Price is per Tuk Tuk (up to 3 passengers).",
      popular: true,
      featured: true,
      active: true,
      seoTitle: "Ella Iconic Highlights Full-Day Tuk Tuk Tour Package | 5 Top Stops",
      seoDescription: "Book our #1 Ella Full-Day Tuk Tuk Safari covering Nine Arch Bridge, Little Adam's Peak, Ravana Falls, Demodara Loop & Halpe Tea Factory.",
      destinationSlugs: ["nine-arch-bridge", "demodara-railway-loop", "halpe-tea-factory", "ravana-falls", "little-adams-peak"]
    },
    {
      name: "Sunrise Lipton's Seat & Upper Diyaluma Expedition",
      slug: "sunrise-liptons-seat-upper-diyaluma-expedition",
      tagline: "Clouds, Tea Empires & 220m Natural Infinity Pools",
      shortDescription: "Catch a golden dawn at 1,970m Lipton's Seat before swimming in the natural rock pools atop Sri Lanka's second-highest waterfall.",
      description:
        "Our most epic highland expedition takes you beyond Ella town into the soaring ridges of Haputale and Poonagala. Depart before dawn to stand beside Sir Thomas Lipton's statue at 1,970 meters as the morning sun illuminates five provinces below. After warm spiced tea and breakfast at the summit, cruise down scenic mountain backroads to Upper Diyaluma Falls for a refreshing swim in natural infinity pools overlooking a 220-meter drop.",
      coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=1200&q=80"
      ],
      duration: "8 Hours",
      startTime: "05:00 AM",
      endTime: "01:30 PM",
      minPassengers: 1,
      maxPassengers: 3,
      price: 78,
      currency: "USD",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15,
      finalPrice: 66.3,
      itinerary: [
        { time: "05:00 AM", title: "Pre-Dawn Pickup from Your Ella Hotel", description: "Snuggle up as your Tuk Tuk climbs through misty Bandarawela and Haputale mountain passes." },
        { time: "06:15 AM", title: "Sunrise at Lipton's Seat (1,970m) & Dambatenne Estate", description: "Watch the sun rise above a sea of clouds and enjoy hot Ceylon tea & traditional roti at the summit." },
        { time: "09:30 AM", title: "Upper Diyaluma Falls Natural Infinity Pools", description: "Take the scenic Poonagala shortcut to the top of the 220m waterfall and swim safely in crystal rock pools." },
        { time: "12:15 PM", title: "Lower Diyaluma Bridge & Ravana Falls Return", description: "Admire the full 220m cascade from below and stop at Ravana Falls on your drive back up Ella Gap." }
      ],
      inclusions: [
        "Private Sunrise Tuk Tuk Expedition (Up to 3 Passengers)",
        "Hot Morning Ceylon Tea at Lipton's Seat",
        "Local Trail Guide Support at Upper Diyaluma Pools",
        "Bottled Water & All Fuel/Estate Road Permits",
        "Hotel Pickup & Drop-off in Ella"
      ],
      exclusions: [
        "Lipton's Seat Gate Ticket (~$1.50/person)",
        "Lunch & Personal Gratuities"
      ],
      terms: "Bring swimwear, towel, and light jacket for the chilly morning summit.",
      popular: true,
      featured: true,
      active: true,
      seoTitle: "Lipton's Seat Sunrise & Upper Diyaluma Falls Tuk Tuk Package | Ella",
      seoDescription: "Combine a magical sunrise at Lipton's Seat with swimming in the natural infinity pools of Upper Diyaluma Falls on one unforgettable Tuk Tuk tour.",
      destinationSlugs: ["liptons-seat", "diyaluma-falls", "ravana-falls"]
    },
    {
      name: "Ella Golden Sunrise & Peaks Trekker Package",
      slug: "ella-golden-sunrise-peaks-trekker-package",
      tagline: "Conquer Ella Rock, Little Adam's Peak & Nine Arch Bridge in One Morning",
      shortDescription: "Designed for active hikers: early trailhead transfer to Ella Rock, train spotting at Nine Arch Bridge, and panoramic views from Little Adam's Peak.",
      description:
        "Beat the midday tropical heat and crowds with our half-day morning adventure designed specifically for hikers and photographers. We drop you at the Kithalella trailhead at first light for your Ella Rock ascent, pick you up for a hearty coconut refresh, bring you to the secret forest vantage point for the morning train at Nine Arch Bridge, and wrap up at Little Adam's Peak.",
      coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1400&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80"
      ],
      duration: "5 - 6 Hours (Half Day)",
      startTime: "05:30 AM",
      endTime: "11:30 AM",
      minPassengers: 1,
      maxPassengers: 3,
      price: 38,
      currency: "USD",
      discountType: DiscountType.FIXED,
      discountValue: 5,
      finalPrice: 33,
      itinerary: [
        { time: "05:30 AM", title: "Kithalella Trailhead Drop-off for Ella Rock Hike", description: "Start right at the base trail with our driver's offline route briefing." },
        { time: "09:00 AM", title: "Nine Arch Bridge Morning Train Crossing", description: "Transfer directly from your hike to the Nine Arch Bridge viewpoint with a fresh King Coconut in hand." },
        { time: "10:15 AM", title: "Little Adam's Peak Panorama Ridge", description: "Finish with a breezy ridge walk overlooking Ella Gap before returning to town for lunch." }
      ],
      inclusions: [
        "All Trailhead Transfers & Flexible Waiting Time",
        "Fresh King Coconut After Ella Rock Hike",
        "Train Crossing Timing Synchronization",
        "Hotel Pickup & Drop-off"
      ],
      exclusions: ["Personal Meals & Gratuities"],
      terms: "Ideal for guests with moderate hiking fitness.",
      popular: false,
      featured: true,
      active: true,
      seoTitle: "Ella Rock, Little Adam's Peak & Nine Arch Bridge Morning Package",
      seoDescription: "Hike Ella Rock and Little Adam's Peak plus see the Nine Arch Bridge train in one seamless half-day Tuk Tuk package.",
      destinationSlugs: ["ella-rock", "nine-arch-bridge", "little-adams-peak"]
    }
  ];

  const createdPackages: Record<string, string> = {};
  for (const pkg of packagesData) {
    const { destinationSlugs, ...pkgFields } = pkg;
    const saved = await prisma.tourPackage.upsert({
      where: { slug: pkg.slug },
      update: pkgFields,
      create: pkgFields
    });
    createdPackages[pkg.slug] = saved.id;

    await prisma.tourPackageDestination.deleteMany({ where: { tourPackageId: saved.id } });
    for (let i = 0; i < destinationSlugs.length; i++) {
      const destId = createdDestinations[destinationSlugs[i]];
      if (destId) {
        await prisma.tourPackageDestination.create({
          data: {
            tourPackageId: saved.id,
            destinationId: destId,
            stopOrder: i + 1,
            stopDuration: "60 mins"
          }
        });
      }
    }
  }

  // 6. Active Offers & Coupons
  const now = new Date();
  const nextYear = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

  const offersData = [
    {
      title: "Highland Welcome: 15% OFF Your First Ella Tuk Tuk Safari",
      slug: "highland-welcome-15-off-first-booking",
      description: "First time exploring Ella with us? Use code ELLA15 at checkout to receive an instant 15% discount on any full-day tour package or waterfall expedition.",
      badgeText: "FIRST BOOKING SPECIAL",
      image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1000&q=80",
      offerType: OfferType.FIRST_BOOKING,
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15,
      couponCode: "ELLA15",
      startDate: now,
      endDate: nextYear,
      minBookingAmount: 20,
      maxDiscount: 25,
      usageLimit: 500,
      perCustomerLimit: 1,
      featured: true,
      active: true
    },
    {
      title: "Sunrise Early Bird: $8 OFF Lipton's Seat & Diyaluma Combos",
      slug: "sunrise-early-bird-8-off",
      description: "Book any sunrise expedition starting at 5:00 AM or 5:30 AM and save $8 instantly with coupon SUNRISE8. Includes complimentary hot Ceylon tea!",
      badgeText: "EARLY BIRD DEAL",
      image: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=1000&q=80",
      offerType: OfferType.SEASONAL_OFFER,
      discountType: DiscountType.FIXED,
      discountValue: 8,
      couponCode: "SUNRISE8",
      startDate: now,
      endDate: nextYear,
      minBookingAmount: 35,
      maxDiscount: 8,
      usageLimit: 300,
      perCustomerLimit: 2,
      featured: true,
      active: true
    },
    {
      title: "Couple & Group Saver: 20% OFF Custom Full-Day Charters",
      slug: "couple-group-saver-20-off",
      description: "Planning a custom itinerary or multi-stop photography day in Ella? Apply TUKTUK20 on bookings over $40 for 20% off.",
      badgeText: "LIMITED TIME OFFER",
      image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1000&q=80",
      offerType: OfferType.LIMITED_TIME,
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      couponCode: "TUKTUK20",
      startDate: now,
      endDate: nextYear,
      minBookingAmount: 40,
      maxDiscount: 30,
      usageLimit: 200,
      perCustomerLimit: 1,
      featured: true,
      active: true
    }
  ];

  for (const offer of offersData) {
    await prisma.offer.upsert({
      where: { slug: offer.slug },
      update: offer,
      create: offer
    });
  }

  const couponsData = [
    {
      code: "ELLA15",
      title: "15% Welcome Discount",
      description: "15% off your first Ella Tuk Tuk booking over $20",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15,
      minBookingAmount: 20,
      maxDiscount: 25,
      startDate: now,
      endDate: nextYear,
      usageLimit: 500,
      perCustomerLimit: 1,
      firstBookingOnly: true,
      active: true
    },
    {
      code: "SUNRISE8",
      title: "$8 Off Sunrise Expeditions",
      description: "$8 flat discount on bookings of $35 or more",
      discountType: DiscountType.FIXED,
      discountValue: 8,
      minBookingAmount: 35,
      maxDiscount: 8,
      startDate: now,
      endDate: nextYear,
      usageLimit: 300,
      perCustomerLimit: 2,
      firstBookingOnly: false,
      active: true
    },
    {
      code: "TUKTUK20",
      title: "20% Off Full-Day Charters",
      description: "20% off bookings over $40 (max $30 discount)",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      minBookingAmount: 40,
      maxDiscount: 30,
      startDate: now,
      endDate: nextYear,
      usageLimit: 200,
      perCustomerLimit: 1,
      firstBookingOnly: false,
      active: true
    }
  ];

  for (const coupon of couponsData) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: coupon,
      create: coupon
    });
  }

  // 7. Gallery Categories & Images
  const galleryCats = [
    { name: "Tuk Tuk Adventures", slug: "tuk-tuk-adventures", description: "Our colorful fleet on the mountain roads of Ella", sortOrder: 1 },
    { name: "Iconic Destinations", slug: "iconic-destinations", description: "Nine Arch Bridge, peaks, and misty tea valleys", sortOrder: 2 },
    { name: "Happy Travelers", slug: "happy-travelers", description: "Unforgettable memories with guests from around the world", sortOrder: 3 },
    { name: "Waterfalls & Tea Trails", slug: "waterfalls-tea-trails", description: "Diyaluma, Ravana Falls, and Lipton's Seat", sortOrder: 4 }
  ];

  const savedGalCats: Record<string, string> = {};
  for (const gCat of galleryCats) {
    const c = await prisma.galleryCategory.upsert({
      where: { slug: gCat.slug },
      update: gCat,
      create: gCat
    });
    savedGalCats[gCat.slug] = c.id;
  }

  await prisma.galleryImage.deleteMany({});
  const galleryItems = [
    {
      title: "Blue Train Crossing Nine Arch Bridge",
      description: "Timed right to the minute from our secret upper tea plantation viewpoint.",
      url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80",
      categoryId: savedGalCats["iconic-destinations"],
      location: "Nine Arch Bridge, Demodara",
      featured: true,
      sortOrder: 1
    },
    {
      title: "Golden Sunrise Over Little Adam's Peak",
      description: "360-degree morning mist rolling through Ella Gap.",
      url: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
      categoryId: savedGalCats["iconic-destinations"],
      location: "Little Adam's Peak, Ella",
      featured: true,
      sortOrder: 2
    },
    {
      title: "Upper Diyaluma Natural Infinity Pools",
      description: "Swimming at the edge of Sri Lanka's second-highest waterfall.",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      categoryId: savedGalCats["waterfalls-tea-trails"],
      location: "Upper Diyaluma, Koslanda",
      featured: true,
      sortOrder: 3
    },
    {
      title: "Cruising Through Dambatenne Tea Estates",
      description: "Climbing the emerald ridges toward Lipton's Seat at 1,970m.",
      url: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=1200&q=80",
      categoryId: savedGalCats["tuk-tuk-adventures"],
      location: "Lipton's Seat, Haputale",
      featured: true,
      sortOrder: 4
    },
    {
      title: "Roaring Cascades of Ravana Falls",
      description: "Refreshing mountain spray along the Ella-Wellawaya highway.",
      url: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80",
      categoryId: savedGalCats["waterfalls-tea-trails"],
      location: "Ravana Falls, Ella",
      featured: true,
      sortOrder: 5
    },
    {
      title: "Summit Views from Ella Rock",
      description: "Rewarding panorama after an early morning trek from Kithalella.",
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80",
      categoryId: savedGalCats["happy-travelers"],
      location: "Ella Rock Summit",
      featured: true,
      sortOrder: 6
    }
  ];

  for (const item of galleryItems) {
    await prisma.galleryImage.create({ data: item });
  }

  // 8. Approved Customer Reviews
  await prisma.customerReview.deleteMany({});
  const reviewsData = [
    {
      customerName: "Sophie & Liam Vance",
      customerEmail: "sophie.vance@example.com",
      country: "United Kingdom",
      rating: 5,
      title: "Best Day of Our 3-Week Sri Lanka Trip!",
      comment:
        "Booking the Ella Iconic Highlights Day Safari with Nuwan was the smartest decision we made. He took us through a hidden forest road right to the top of Nine Arch Bridge just 10 minutes before the blue train arrived, bought us fresh king coconuts after Little Adam's Peak, and took the most incredible photos of us!",
      bookingReference: "ELLA-2026-841920",
      tourTitle: "Ella Iconic Highlights Day Safari",
      destinationId: createdDestinations["nine-arch-bridge"],
      tourPackageId: createdPackages["ella-iconic-highlights-day-safari"],
      status: ReviewStatus.APPROVED,
      featured: true,
      travelDate: "October 2026"
    },
    {
      customerName: "Marcus Schneider",
      customerEmail: "m.schneider@example.de",
      country: "Germany",
      rating: 5,
      title: "Lipton's Seat Sunrise & Upper Diyaluma Was Pure Magic",
      comment:
        "Our driver Kasun arrived at 4:55 AM sharp with a spotless Tuk Tuk and warm blankets for the mountain climb. Seeing the sun rise over five provinces at Lipton's Seat with hot spiced tea and then swimming in the natural infinity pools at Upper Diyaluma Falls felt surreal. 100% transparent pricing and super safe driving.",
      bookingReference: "ELLA-2026-592014",
      tourTitle: "Sunrise Lipton's Seat & Upper Diyaluma Expedition",
      destinationId: createdDestinations["diyaluma-falls"],
      tourPackageId: createdPackages["sunrise-liptons-seat-upper-diyaluma-expedition"],
      status: ReviewStatus.APPROVED,
      featured: true,
      travelDate: "November 2026"
    },
    {
      customerName: "Elena Rossi",
      customerEmail: "elena.rossi@example.it",
      country: "Italy",
      rating: 5,
      title: "So Easy to Book Online & Track Our Ride",
      comment:
        "I loved being able to see clear USD prices upfront instead of haggling on the street. We booked the Ella Rock trailhead transfer and Halpe Tea Factory tour. Our driver waited patiently and even showed us the exact path so we didn't get lost in the tea bushes!",
      bookingReference: "ELLA-2026-310482",
      tourTitle: "Ella Rock & Halpe Tea Factory",
      destinationId: createdDestinations["ella-rock"],
      status: ReviewStatus.APPROVED,
      featured: true,
      travelDate: "November 2026"
    },
    {
      customerName: "Chloe & Ethan Brooks",
      customerEmail: "chloe.brooks@example.au",
      country: "Australia",
      rating: 5,
      title: "Warm Sri Lankan Hospitality at Its Finest",
      comment:
        "We travelled as a family of four and they sent two immaculate matching Tuk Tuks that drove together all day. The kids loved waving from the open sides through the Demodara Loop and cooling off at Ravana Falls. Highly recommended to anyone visiting Ella!",
      bookingReference: "ELLA-2026-774109",
      tourTitle: "Ella Iconic Highlights Day Safari",
      destinationId: createdDestinations["little-adams-peak"],
      status: ReviewStatus.APPROVED,
      featured: true,
      travelDate: "September 2026"
    }
  ];

  for (const rev of reviewsData) {
    await prisma.customerReview.create({ data: rev });
  }

  // 9. Sample Customers & Bookings for Rich Dashboard Charts & Booking Tracking Demo
  const sampleCustomer1 = await prisma.customer.upsert({
    where: { email: "sophie.vance@example.com" },
    update: { totalBookings: 1, totalSpent: 45 },
    create: {
      fullName: "Sophie Vance",
      email: "sophie.vance@example.com",
      phone: "+44 7700 900412",
      country: "United Kingdom",
      totalBookings: 1,
      totalSpent: 45
    }
  });

  const sampleCustomer2 = await prisma.customer.upsert({
    where: { email: "m.schneider@example.de" },
    update: { totalBookings: 1, totalSpent: 66.3 },
    create: {
      fullName: "Marcus Schneider",
      email: "m.schneider@example.de",
      phone: "+49 151 23456789",
      country: "Germany",
      totalBookings: 1,
      totalSpent: 66.3
    }
  });

  const sampleCustomer3 = await prisma.customer.upsert({
    where: { email: "amelie.laurent@example.fr" },
    update: { totalBookings: 1, totalSpent: 38.25 },
    create: {
      fullName: "Amélie Laurent",
      email: "amelie.laurent@example.fr",
      phone: "+33 6 12 34 56 78",
      country: "France",
      totalBookings: 1,
      totalSpent: 38.25
    }
  });

  await prisma.booking.upsert({
    where: { bookingReference: "ELLA-2026-841920" },
    update: {},
    create: {
      bookingReference: "ELLA-2026-841920",
      bookingType: BookingType.TOUR_PACKAGE,
      status: BookingStatus.COMPLETED,
      customerId: sampleCustomer1.id,
      tourPackageId: createdPackages["ella-iconic-highlights-day-safari"],
      customerName: "Sophie Vance",
      customerEmail: "sophie.vance@example.com",
      customerPhone: "+44 7700 900412",
      customerCountry: "United Kingdom",
      passengers: 2,
      bookingDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      bookingTime: "08:00 AM",
      pickupLocation: "98 Acres Resort & Spa, Ella",
      hotelName: "98 Acres Resort & Spa",
      specialRequests: "We would love to catch the 9:15 AM blue train at Nine Arch Bridge!",
      basePrice: 55,
      additionalCharges: 0,
      itemDiscount: 10,
      couponDiscount: 0,
      totalPrice: 45,
      driverAssigned: "Kavith Sasalanka",
      vehicleNumber: "UP QH-4821",
      confirmedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      completedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.booking.upsert({
    where: { bookingReference: "ELLA-2026-592014" },
    update: {},
    create: {
      bookingReference: "ELLA-2026-592014",
      bookingType: BookingType.TOUR_PACKAGE,
      status: BookingStatus.CONFIRMED,
      customerId: sampleCustomer2.id,
      tourPackageId: createdPackages["sunrise-liptons-seat-upper-diyaluma-expedition"],
      customerName: "Marcus Schneider",
      customerEmail: "m.schneider@example.de",
      customerPhone: "+49 151 23456789",
      customerCountry: "Germany",
      passengers: 2,
      bookingDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      bookingTime: "05:00 AM",
      pickupLocation: "EKHO Ella Hotel, Main Street",
      hotelName: "EKHO Ella",
      specialRequests: "Early sunrise departure please.",
      basePrice: 78,
      additionalCharges: 0,
      itemDiscount: 11.7,
      couponDiscount: 0,
      totalPrice: 66.3,
      driverAssigned: "Kasun Bandara",
      vehicleNumber: "UP ABB-1920",
      confirmedAt: new Date()
    }
  });

  await prisma.booking.upsert({
    where: { bookingReference: "ELLA-2026-901245" },
    update: {},
    create: {
      bookingReference: "ELLA-2026-901245",
      bookingType: BookingType.DESTINATION_RIDE,
      status: BookingStatus.PENDING,
      customerId: sampleCustomer3.id,
      destinationId: createdDestinations["diyaluma-falls"],
      customerName: "Amélie Laurent",
      customerEmail: "amelie.laurent@example.fr",
      customerPhone: "+33 6 12 34 56 78",
      customerCountry: "France",
      passengers: 3,
      bookingDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      bookingTime: "07:30 AM",
      pickupLocation: "Morning Dew Hotel, Ella",
      hotelName: "Morning Dew Hotel",
      specialRequests: "Visiting Upper Diyaluma infinity pools with 3 passengers.",
      basePrice: 45,
      additionalCharges: 0,
      itemDiscount: 6.75,
      couponDiscount: 0,
      totalPrice: 38.25
    }
  });

  // 10. Email Templates
  const emailTemplatesData = [
    {
      key: "BOOKING_SUBMITTED",
      name: "Booking Received (Customer Confirmation)",
      subject: "Your Ella Tuk Tuk Booking Request (#{{bookingReference}}) is Received!",
      heading: "Ayubowan! We've Received Your Booking Request",
      bodyIntro: "Thank you for choosing Ella Tuk Tuk Taxi Service. Our local dispatch team is reviewing your schedule and assigning your English-speaking driver.",
      footerNote: "Need urgent changes? Reply to this email or WhatsApp our 24/7 Ella desk at +94 77 123 4567.",
      ctaText: "Track Your Booking Online"
    },
    {
      key: "BOOKING_CONFIRMED",
      name: "Booking Confirmed",
      subject: "CONFIRMED: Your Ella Tuk Tuk Adventure (#{{bookingReference}})",
      heading: "Pack Your Bags! Your Ella Tuk Tuk Ride is Confirmed",
      bodyIntro: "Great news! Your booking has been confirmed by our team and your local driver has been scheduled for your pickup.",
      footerNote: "Payment can be made directly to your driver in USD, EUR, or LKR at the end of your trip.",
      ctaText: "View Booking Details"
    },
    {
      key: "BOOKING_COMPLETED",
      name: "Booking Completed & Review Invitation",
      subject: "Thank You for Riding with Ella Tuk Tuk Taxi Service! (#{{bookingReference}})",
      heading: "Sthuthi! Thank You for Exploring Ella With Us",
      bodyIntro: "We hope you had an unforgettable adventure in the misty hills of Ella. We would be honored if you could share a quick review of your experience!",
      footerNote: "Safe travels across Sri Lanka, and we hope to welcome you back to Ella soon.",
      ctaText: "Leave a Review"
    },
    {
      key: "BOOKING_CANCELLED",
      name: "Booking Cancelled",
      subject: "Booking Cancelled (#{{bookingReference}}) — Ella Tuk Tuk Taxi Service",
      heading: "Your Booking Has Been Cancelled",
      bodyIntro: "As requested or updated, your booking reference #{{bookingReference}} has been marked as cancelled.",
      footerNote: "If you wish to rebook for another date, simply visit our website or message us on WhatsApp.",
      ctaText: "Book Another Ride"
    },
    {
      key: "BOOKING_REJECTED",
      name: "Booking Unavailable / Rejected",
      subject: "Update on Your Booking Request (#{{bookingReference}})",
      heading: "We're Sorry — Schedule Update for Your Request",
      bodyIntro: "Unfortunately, we could not confirm the requested slot for booking #{{bookingReference}}. Please check our notes below or contact us on WhatsApp for an alternative time.",
      footerNote: "WhatsApp +94 77 123 4567 for instant alternative availability.",
      ctaText: "Contact Us"
    }
  ];

  for (const tpl of emailTemplatesData) {
    await prisma.emailTemplate.upsert({
      where: { key: tpl.key },
      update: tpl,
      create: tpl
    });
  }

  // 10B. Our Rides (Home Page Section)
  const ridesData = [
    {
      name: "Nine Arch Bridge & Forest Viewpoint Ride",
      slug: "nine-arch-bridge-forest-viewpoint-ride",
      shortDescription: "Direct Tuk Tuk ride to the secret upper tea ridge viewpoint timed with the iconic Blue Mountain Train crossing.",
      image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=85",
      priceUsd: 12,
      priceLkr: 3600,
      tag: "Most Popular",
      distance: "3.5 km from Ella Town",
      travelTime: "15 mins • 90m Wait Included",
      sortOrder: 1,
      active: true
    },
    {
      name: "Little Adam's Peak Sunrise / Sunset Ride",
      slug: "little-adams-peak-sunrise-sunset-ride",
      shortDescription: "Private round-trip Tuk Tuk transfer straight to the 98 Acres trailhead for 360° Ella Gap mountain views.",
      image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1400&q=85",
      priceUsd: 10,
      priceLkr: 3000,
      tag: "Best Value",
      distance: "2.8 km from Ella Town",
      travelTime: "10 mins • 2h Wait Included",
      sortOrder: 2,
      active: true
    },
    {
      name: "Upper Diyaluma Falls & Natural Infinity Pools",
      slug: "upper-diyaluma-falls-infinity-pools-ride",
      shortDescription: "Half-day scenic mountain Tuk Tuk ride via Poonagala tea estates to the top of Sri Lanka's 220m waterfall.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85",
      priceUsd: 38,
      priceLkr: 11500,
      tag: "Nature & Waterfall",
      distance: "36 km from Ella Town",
      travelTime: "5 - 6 Hours Charter",
      sortOrder: 3,
      active: true
    },
    {
      name: "Ravana Falls & Ella Gap Scenic Descent",
      slug: "ravana-falls-ella-gap-scenic-ride",
      shortDescription: "Breezy Tuk Tuk excursion down the dramatic Ella Gap mountain pass to the roaring 25m Ravana cascade.",
      image: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1400&q=85",
      priceUsd: 14,
      priceLkr: 4200,
      tag: "Nature & Waterfall",
      distance: "6.2 km from Ella Town",
      travelTime: "15 mins • 60m Wait Included",
      sortOrder: 4,
      active: true
    },
    {
      name: "Lipton's Seat Sunrise & Dambatenne Tea Ride",
      slug: "liptons-seat-sunrise-dambatenne-ride",
      shortDescription: "Climb through emerald century-old tea plantations to the 1,970m cloud summit overlooking five provinces.",
      image: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=1400&q=85",
      priceUsd: 35,
      priceLkr: 10500,
      tag: "Most Popular",
      distance: "34 km from Ella Town",
      travelTime: "Half-Day Sunrise Tour",
      sortOrder: 5,
      active: true
    },
    {
      name: "Halpe Tea Factory & Demodara Railway Loop",
      slug: "halpe-tea-factory-demodara-loop-ride",
      shortDescription: "Visit the famous 360° spiral railway track at Demodara followed by fresh highland tea tasting at Halpewatte.",
      image: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=1400&q=85",
      priceUsd: 16,
      priceLkr: 4800,
      tag: "Best Value",
      distance: "6.0 km from Ella Town",
      travelTime: "2.5 Hours Round Trip",
      sortOrder: 6,
      active: true
    }
  ];

  for (const ride of ridesData) {
    await prisma.ride.upsert({
      where: { slug: ride.slug },
      update: ride,
      create: ride
    });
  }

  // 11. Sample Contact Inquiry & Audit Log
  await prisma.contactMessage.create({
    data: {
      name: "David Miller",
      email: "david.miller@example.com",
      phone: "+1 415 890 2311",
      subject: "Group of 6 passengers for sunrise Lipton's Seat tour",
      message: "Hi team! We are 6 friends arriving in Ella on the Kandy train next Tuesday. Can we book 2 Tuk Tuks traveling together for the Lipton's Seat Sunrise & Diyaluma package?",
      status: "UNREAD"
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      userEmail: superAdmin.email,
      action: "SYSTEM_SEED",
      entityType: "Database",
      entityId: "initial-seed",
      details: "Initialized 9 Ella destinations, 3 tour packages, 3 active offers, coupons, gallery, and site settings."
    }
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

