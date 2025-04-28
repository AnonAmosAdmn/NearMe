import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Link, Flex, Select } from '@chakra-ui/react';

type CategoryName = "Food & Dining" | "Shopping" | "Entertainment" | "Services" | "Nightlife" | "Retail" | "Sports & Outdoors" | "Transportation" | "Health & Wellness" | "Education" | "Arts & Culture" | "Technology" | "Finance" | "Legal Services" | "Automotive" | "Real Estate" | "Travel & Hospitality" | "Event Planning" | "Utilities" | "Government & Public Services" | "Dating & Social" | "Jobs & Career" | "Home & Garden" | "Parenting & Family" | "Religion & Spirituality" | "Outdoor Recreation" | "Arts & Crafts" | "Performing Arts" | "Gaming" | "Sports Leagues" | "Music & Dance" | "Cooking & Culinary" | "Nature Exploration" | "Social Clubs" | "Miscellaneous"; // Add all other category names here

type CategoriesType = Record<CategoryName, string[]>;

const Keywords: React.FC<{ onKeywordClick: (keyword: string) => void }> = ({ onKeywordClick }) => {
  const categories: CategoriesType = {
    "Food & Dining": ["Restaurants", "Coffee Shops", "Bars", "Cafes", "Bakeries", "Pizza Places", "Ice Cream Shops", "Diners", "Fast Food Restaurants", "Food Trucks", "Buffets", "Fine Dining Restaurants", "Seafood Restaurants", "Steakhouses", "Vegetarian Restaurants", "Vegan Restaurants", "Sushi Restaurants", "Indian Restaurants", "Italian Restaurants", "Mexican Restaurants", "Chinese Restaurants", "Thai Restaurants", "Greek Restaurants", "Middle Eastern Restaurants", "Korean Restaurants", "Japanese Restaurants", "Vietnamese Restaurants", "French Restaurants", "German Restaurants", "Brazilian Restaurants", "Argentinian Restaurants", "African Restaurants", "Caribbean Restaurants", "Hawaiian Restaurants", "Australian Restaurants", "New American Restaurants", "Latin American Restaurants", "European Restaurants"],
    "Shopping": ["Shopping Malls", "Grocery Stores", "Convenience Stores", "Supermarkets", "Boutiques", "Department Stores", "Clothing Stores", "Shoe Stores", "Jewelry Stores", "Electronics Stores", "Furniture Stores", "Home Goods Stores", "Bookstores", "Toy Stores", "Sporting Goods Stores", "Outdoor Gear Stores", "Pet Stores", "Art Supply Stores", "Craft Stores", "Antique Shops", "Vintage Shops", "Thrift Stores", "Flea Markets", "Secondhand Stores", "Consignment Shops", "Specialty Stores", "Comic Book Stores", "Music Stores", "Liquor Stores", "Wine Shops", "Beer Stores", "Health Food Stores", "Cosmetics Stores", "Beauty Supply Stores", "Pharmacies", "Drugstores", "Vitamin Shops", "Supplement Stores", "Nutrition Stores", "Organic Stores"],
    "Entertainment": ["Movie Theaters", "Bowling Alleys", "Arcades", "Amusement Parks", "Zoos", "Aquariums", "Museums", "Art Galleries", "Historical Sites", "Monuments", "Landmarks", "Nature Reserves", "Hiking Trails", "Camping Sites", "Picnic Areas", "Playgrounds", "Dog Parks", "Skate Parks", "Beaches", "Lakes", "Rivers", "Mountains", "Parks", "Gardens", "Forests", "Observatories", "Planetariums", "Botanical Gardens", "Wildlife Sanctuaries", "Farms", "Vineyards", "Orchards", "Wineries", "Breweries", "Distilleries"],
    "Services": ["Hotels", "Gas Stations", "Hospitals", "Pharmacies", "Banks", "ATMs", "Post Offices", "Airports", "Train Stations", "Bus Stations", "Taxi Stands", "Car Rentals", "Car Washes", "Dentists", "Doctors", "Veterinarians", "Gyms", "Fitness Centers", "Yoga Studios", "Spas", "Salons", "Barbershops", "Massage Centers", "Tattoo Shops", "Piercing Studios", "Chiropractors", "Optometrists", "Ophthalmologists", "Orthodontists", "Physical Therapists", "Psychologists", "Counseling Services", "Dry Cleaners", "Laundromats", "Tailors", "Shoe Repair Shops", "Locksmiths", "Plumbers", "Electricians", "Contractors", "Painters"],
    "Nightlife": ["Bars", "Nightclubs", "Lounges", "Pubs", "Wineries", "Breweries", "Cocktail Bars", "Karaoke Bars", "Dive Bars", "Speakeasies", "Sports Bars", "Irish Pubs", "Beer Gardens", "Hookah Bars", "Wine Bars", "Gastropubs", "Live Music Venues", "Comedy Clubs", "Adult Entertainment"],
    "Retail": ["Secondhand Stores", "Consignment Shops", "Thrift Stores", "Vintage Shops", "Flea Markets", "Farmers Markets", "Craft Markets", "Street Vendors", "Specialty Stores", "Beauty Supply Stores", "Cosmetics Stores", "Pharmacies", "Drugstores", "Health Food Stores", "Vitamin Shops", "Supplement Stores", "Nutrition Stores", "Organic Stores", "Butcher Shops", "Deli Shops", "Fish Markets", "Seafood Markets", "Cheese Shops", "Wine Shops", "Liquor Stores", "Beer Stores", "Spirits Stores"],
    "Sports & Outdoors": ["Golf Courses", "Tennis Courts", "Basketball Courts", "Baseball Fields", "Soccer Fields", "Football Fields", "Gyms", "Fitness Centers", "Yoga Studios", "Parks", "Trails", "Beaches", "Lakes", "Rivers", "Campgrounds", "Ski Resorts", "Boating", "Fishing", "Hunting", "Cycling", "Hiking", "Rock Climbing", "Surfing", "Scuba Diving", "Skydiving Centers", "Bungee Jumping", "Ziplining", "Paragliding", "Hang Gliding", "Kayaking", "Canoeing", "White Water Rafting"],
    "Transportation": ["Taxi Services", "Ride Sharing", "Public Transportation", "Airports", "Train Stations", "Bus Stations", "Car Rentals", "Bike Rentals", "Scooter Rentals", "Boat Rentals", "Parking Lots", "Gas Stations", "Car Washes", "Auto Repair Shops", "Towing Services"],
    "Health & Wellness": ["Gyms", "Fitness Centers", "Yoga Studios", "Pilates Studios", "CrossFit Gyms", "Martial Arts Studios", "Dance Studios", "Spas", "Massage Centers", "Salons", "Barbershops", "Tattoo Shops", "Piercing Studios", "Chiropractors", "Physical Therapists", "Psychologists", "Counseling Services", "Hospitals", "Urgent Care Centers", "Clinics", "Medical Centers", "Pharmacies", "Drugstores", "Health Food Stores", "Vitamin Shops", "Supplement Stores", "Nutrition Stores", "Organic Stores", "Holistic Health Centers", "Acupuncture Clinics", "Rehab Centers", "Assisted Living Facilities", "Nursing Homes", "Home Health Care Services"],
    "Arts & Culture": ["Art Galleries", "Museums", "Historical Sites", "Monuments", "Landmarks", "Theaters", "Opera Houses", "Symphony Halls", "Concert Venues", "Live Music Venues", "Music Festivals", "Film Festivals", "Art Festivals", "Cultural Centers", "Libraries", "Bookstores", "Literary Events", "Art Classes", "Craft Workshops", "Film Schools", "Drama Schools", "Music Schools", "Dance Schools", "Pottery Studios", "Sculpture Gardens", "Artist Residencies", "Writer Residencies", "Film Studios", "Recording Studios", "Photography Studios", "Graphic Design Studios", "Creative Agencies"],
    "Education": ["Schools", "Universities", "Colleges", "Community Colleges", "Vocational Schools", "Trade Schools", "Online Learning Platforms", "Tutoring Centers", "Language Schools", "Art Schools", "Music Schools", "Dance Schools", "Acting Schools", "Driving Schools", "Cooking Schools", "Computer Training Centers", "STEM Programs", "Business Schools", "Law Schools", "Medical Schools", "Nursing Schools", "Engineering Schools", "Design Schools", "Architecture Schools", "Film Schools", "Journalism Schools", "Public Speaking Courses", "Writing Workshops", "Career Counseling Services"],
    "Technology": ["Electronics Stores", "Computer Stores", "Mobile Phone Shops", "Gadget Shops", "Software Companies", "Hardware Companies", "Internet Service Providers", "Telecommunications Companies", "Web Development Agencies", "App Development Agencies", "Tech Startups", "Incubators", "Hackerspaces", "Coworking Spaces", "Data Centers", "Cloud Computing Services", "Cybersecurity Firms", "IT Consultants", "Robotics Companies", "Artificial Intelligence Companies", "Machine Learning Companies", "Blockchain Companies", "Augmented Reality Companies", "Virtual Reality Companies", "Digital Marketing Agencies", "Social Media Agencies", "SEO Agencies", "UX/UI Design Agencies"],
    "Finance": ["Banks", "Credit Unions", "ATMs", "Investment Firms", "Financial Advisors", "Insurance Companies", "Mortgage Lenders", "Accounting Firms", "Tax Consultants", "Wealth Management Firms", "Venture Capital Firms", "Private Equity Firms", "Hedge Funds", "Stock Brokerages", "Real Estate Agencies", "Property Management Companies", "Commercial Banks", "Retail Banks", "Online Banks", "Mobile Banks", "Challenger Banks", "Microfinance Institutions", "Credit Card Companies", "Payment Processors", "Money Transfer Services", "Cryptocurrency Exchanges", "Fintech Startups"],
    "Legal Services": ["Law Firms", "Legal Aid Organizations", "Legal Clinics", "Notaries", "Divorce Attorneys", "Family Law Attorneys", "Criminal Defense Attorneys", "Personal Injury Attorneys", "Civil Litigation Attorneys", "Employment Attorneys", "Immigration Attorneys", "Estate Planning Attorneys", "Business Attorneys", "Intellectual Property Attorneys", "Tax Attorneys", "Bankruptcy Attorneys", "Real Estate Attorneys", "Trial Consultants", "Mediators", "Arbitrators", "Court Reporters", "Process Servers", "Legal Transcription Services", "Legal Document Preparation Services", "Legal Technology Companies"],
    "Automotive": ["Car Dealerships", "Auto Repair Shops", "Auto Body Shops", "Towing Services", "Car Washes", "Detailing Services", "Oil Change Services", "Brake Repair Shops", "Transmission Repair Shops", "Tire Shops", "Wheel Alignment Shops", "Car Rental Agencies", "Car Sharing Services", "Ride Sharing Services", "Auto Parts Stores", "Car Accessories Stores", "Performance Tuning Shops", "Classic Car Restoration Shops", "Electric Vehicle Charging Stations", "Car Audio Stores", "Car Insurance Companies", "Roadside Assistance Services", "Fleet Management Companies", "Driving Schools", "Vehicle Wrapping Services", "Mobile Mechanic Services", "RV Dealerships", "Motorcycle Dealerships", "Boat Dealerships"],
    "Real Estate": ["Real Estate Agencies", "Property Management Companies", "Apartment Complexes", "Condominiums", "Townhouses", "Single-Family Homes", "Vacation Rentals", "Timeshare Resorts", "Commercial Real Estate", "Office Spaces", "Retail Spaces", "Industrial Spaces", "Warehouses", "Coworking Spaces", "Shared Office Spaces", "Virtual Offices", "Land for Sale", "Ranches", "Farms", "Vineyards", "Development Projects", "Property Auctions", "Real Estate Investment Trusts (REITs)", "Property Developers", "Real Estate Lawyers", "Real Estate Appraisers", "Home Inspectors", "Title Companies", "Escrow Services"],
    "Travel & Hospitality": ["Hotels", "Resorts", "Bed and Breakfasts", "Inns", "Hostels", "Vacation Rentals", "Timeshare Resorts", "Camping Sites", "RV Parks", "Glamping Sites", "Airbnb Rentals", "Vacation Rental Management Companies", "Travel Agencies", "Tour Operators", "Adventure Travel Companies", "Cruise Lines", "Airlines", "Car Rental Agencies", "Airport Shuttle Services", "Limousine Services", "Tourist Information Centers", "Tourist Attractions", "Tourist Activities", "Sightseeing Tours", "City Tours", "Historical Tours", "Nature Tours", "Adventure Tours", "Culinary Tours", "Wine Tours", "Pub Crawls"],
    "Event Planning": ["Event Venues", "Conference Centers", "Convention Centers", "Hotels with Event Spaces", "Banquet Halls", "Wedding Venues", "Reception Venues", "Party Venues", "Meeting Rooms", "Function Rooms", "Stadiums", "Sports Arenas", "Concert Halls", "Theaters", "Amphitheaters", "Outdoor Event Spaces", "Catering Companies", "Event Planning Companies", "Event Decorators", "Florists", "Photographers", "Videographers", "DJs", "Live Bands", "Entertainment Agencies", "Party Supply Stores", "Event Rentals", "Audiovisual Equipment Rental Services", "Portable Toilet Rental Services"],
    "Utilities": ["Electricity Providers", "Gas Providers", "Water Providers", "Sewer Services", "Garbage Collection Services", "Recycling Services", "Water Treatment Facilities", "Wastewater Treatment Facilities", "Renewable Energy Companies", "Solar Panel Installation Companies", "Wind Turbine Installation Companies", "Hydropower Companies", "Geothermal Energy Companies", "Biomass Energy Companies", "Electric Vehicle Charging Station Operators", "Telecommunications Providers", "Internet Service Providers", "Cable TV Providers", "Satellite TV Providers", "Wireless Carriers", "Fiber Optic Network Operators", "Utility Consultants", "Energy Management Companies", "Utility Billing Services", "Meter Reading Services", "Utility Infrastructure Construction Companies", "Utility Maintenance Services"],
    "Government & Public Services": ["Government Offices", "Public Libraries", "Civic Centers", "DMV Offices", "Courthouses", "Social Security Offices", "Passport Offices", "Immigration Services", "Employment Services", "Public Transportation Authorities", "Post Offices", "Tax Offices", "Welfare Offices", "Veterans Affairs Offices", "Legal Aid Clinics", "Consumer Protection Agencies", "Environmental Protection Agencies", "Health Departments", "Emergency Services", "Public Utilities"],
    "Jobs & Career": ["Job Search Websites", "Staffing Agencies", "Career Counseling Services", "Resume Writing Services", "Interview Coaching", "Professional Development Workshops", "Freelance Platforms", "Remote Work Opportunities", "Job Fairs", "Skills Training Programs", "Employment Centers", "Job Training Institutes", "Apprenticeship Programs", "Business Incubators", "Entrepreneurship Programs", "Career Networking Events", "Industry Conferences", "Employer Recruitment Events", "Online Learning Platforms", "Job Placement Services"],
    "Dating & Social": ["Dating Apps", "Matchmaking Services", "Singles Events", "Speed Dating Events", "Romantic Restaurants", "Gift Shops for Special Occasions", "Relationship Counseling", "Couples Therapy", "Relationship Workshops", "Social Clubs", "Meetup Groups", "Networking Events", "Social Media Platforms", "Community Centers", "Volunteer Organizations", "Book Clubs", "Sports Leagues", "Art Classes", "Dance Classes", "Cooking Classes"],
    "Home & Garden": ["Home Improvement Stores", "Garden Centers", "Furniture Showrooms", "Interior Designers", "Landscaping Services", "Home Cleaning Services", "Pest Control Services", "Home Security Systems", "Moving Services", "Storage Facilities", "Appliance Stores", "Hardware Stores", "Building Supply Stores", "Paint Stores", "Plumbing Stores", "Electrical Stores", "Lumberyards", "Nurseries", "Plant Nurseries", "Flower Shops"],
    "Parenting & Family": ["Daycare Centers", "Preschools", "Pediatricians", "Child Psychologists", "Parenting Classes", "Family Counselors", "Toy Stores", "Children's Clothing Stores", "Family-Friendly Restaurants", "Theme Parks for Kids", "Indoor Playgrounds", "Outdoor Playgrounds", "Kids' Museums", "Kids' Art Classes", "Kids' Music Classes", "Kids' Sports Leagues", "Kids' Dance Classes", "Kids' Martial Arts Classes", "Kids' Yoga Classes", "Kids' Cooking Classes"],
    "Religion & Spirituality": ["Churches", "Mosques", "Synagogues", "Temples", "Meditation Centers", "Yoga Retreats", "Spiritual Counselors", "Religious Bookstores", "Retreat Centers", "Pilgrimage Sites", "Shrine Temples", "Religious Schools", "Theological Seminaries", "Monasteries", "Convents", "Abbeys", "Ashrams", "Gurdwaras", "Buddhist Temples", "Hindu Temples"],
    "Outdoor Recreation": ["Hiking Trails", "Mountain Biking Trails", "Camping Sites", "National Parks", "State Parks", "Beaches", "Lakes", "Rivers", "Kayaking", "Canoeing", "Rock Climbing", "Zip-lining", "Ski Resorts", "Snowboarding Parks", "Fishing Spots", "Hunting Grounds", "Wildlife Reserves", "Botanical Gardens", "Arboretums"],
    "Arts & Crafts": ["Painting Classes", "Pottery Workshops", "Sculpting Classes", "Woodworking Classes", "Calligraphy Workshops", "Glassblowing Workshops", "Ceramics Studios", "Quilting Classes", "Embroidery Workshops", "Paper Crafting Classes", "Soap Making Workshops", "Candle Making Workshops", "Macrame Workshops", "Photography Workshops", "Printmaking Classes", "Metalworking Workshops", "Weaving Classes", "Leatherworking Classes", "Felting Workshops", "Jewelry Making Classes"],
    "Performing Arts": ["Theater Performances", "Broadway Shows", "Opera Performances", "Ballet Performances", "Musical Theater Productions", "Dance Performances", "Comedy Shows", "Improv Performances", "Magic Shows", "Circus Performances", "Puppet Shows", "Variety Shows", "Cabaret Performances", "Burlesque Shows", "Performance Art Installations", "Street Performances", "Interactive Theater Experiences", "Experimental Theater Productions", "Children's Theater Shows", "Playback Theater"],
    "Gaming": ["Board Game Cafes", "Video Game Arcades", "LAN Parties", "Tabletop Roleplaying Groups", "Board Game Nights", "Game Design Workshops", "Game Development Studios", "Game Jams", "Virtual Reality Arcades", "Escape Room Experiences", "Trivia Nights", "Puzzle Hunts", "Board Game Tournaments", "Video Game Competitions", "Gaming Conventions", "Board Game Cafes", "Retro Gaming Events", "Gaming Podcasts", "Gaming Streams", "Board Game Meetups"],
    "Sports Leagues": ["Soccer Leagues", "Basketball Leagues", "Volleyball Leagues", "Softball Leagues", "Tennis Leagues", "Golf Leagues", "Running Clubs", "Cycling Groups", "Swimming Teams", "Rowing Clubs", "Ultimate Frisbee Leagues", "Hockey Leagues", "Baseball Leagues", "Kickball Leagues", "Skateboarding Clubs", "Surfing Clubs", "Ski Clubs", "Snowboarding Clubs", "Mountain Biking Clubs", "Rock Climbing Clubs"],
    "Music & Dance": ["Live Music Venues", "Concert Halls", "Music Festivals", "Jazz Clubs", "Blues Clubs", "Rock Concerts", "Pop Concerts", "Indie Concerts", "Hip Hop Shows", "EDM Festivals", "Classical Music Concerts", "Country Music Shows", "Folk Music Concerts", "Reggae Concerts", "Latin Music Nights", "Dance Clubs", "Salsa Nights", "Swing Dance Nights", "Tango Milongas", "Bachata Nights"],
    "Cooking & Culinary": ["Cooking Classes", "Baking Workshops", "Wine Tasting Events", "Craft Beer Tastings", "Cooking Competitions", "Food Festivals", "Farmers Markets", "Street Food Markets", "Culinary Tours", "Food Truck Rallies", "Wine Pairing Dinners", "Cooking Demonstrations", "Cheese Tasting Events", "Chocolate Making Workshops", "Mixology Classes", "Barista Training Workshops", "Culinary Pop-Ups", "Cooking Retreats", "Cooking Camps", "Butchery Classes"],
    "Nature Exploration": ["Nature Walks", "Birdwatching Tours", "Stargazing Events", "Botanical Garden Tours", "Wildlife Photography Tours", "Whale Watching Tours", "Eco Tours", "Guided Hikes", "Forest Bathing Sessions", "Geocaching Adventures", "Nature Drawing Workshops", "Outdoor Yoga Classes", "Nature Photography Workshops", "Foraging Expeditions", "Wilderness Survival Workshops", "Nature Conservation Volunteering", "Nature Journaling Workshops", "Tree Planting Events", "Trail Running Races", "Canopy Tours"],
    "Social Clubs": ["Book Clubs", "Film Clubs", "Wine Clubs", "Cooking Clubs", "Travel Clubs", "Photography Clubs", "Language Exchange Clubs", "Writing Groups", "Gardening Clubs", "Art Clubs", "Board Game Clubs", "Outdoor Adventure Clubs", "Volunteering Groups", "Fitness Clubs", "Cycling Clubs", "Running Clubs", "Hiking Clubs", "Dance Clubs", "Sailing Clubs", "Motorcycle Clubs"],
    "Miscellaneous": ["Pawn Shops", "Title Loan Companies", "Payday Loan Companies", "Check Cashing Services", "Currency Exchange Services", "Gold Buyers", "Coin Dealers", "Auction Houses", "Funeral Homes", "Cremation Services", "Flower Shops", "Tanning Salons", "Laundromats", "Dry Cleaners", "Tailors", "Shoe Repair Shops", "Watch Repair Shops", "Jewelry Repair Shops", "Key Duplication Services", "Pet Grooming Services", "Dog Training Services", "House Cleaning Services", "Carpet Cleaning Services", "Window Cleaning Services", "Pressure Washing Services", "Pest Control Services", "Exterminators", "Home Security Companies", "Locksmiths", "Private Investigators", "Detective Agencies", "Process Servers", "Self Storage Facilities", "Mobile Storage Services", "Document Storage Services", "Archive Storage Services", "Moving Companies", "Shipping Companies", "Courier Services", "Fulfillment Services"]
  };

  const [selectedCategory, setSelectedCategory] = useState<CategoryName>(Object.keys(categories)[0] as CategoryName);
  const containerRef = useRef<HTMLDivElement>(null);
  const keywords = categories[selectedCategory];
  const scrollSpeed = 1;

  useEffect(() => {
    const scrollContainer = containerRef.current;

    const scrollLoop = () => {
      if (scrollContainer) {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollContainer.scrollTo({ left: 0, behavior: 'auto' });
        } else {
          scrollContainer.scrollLeft += scrollSpeed;
        }
      }
      animationFrame.current = requestAnimationFrame(scrollLoop);
    };
    
    let animationFrame = { current: null as number | null };
    animationFrame.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [selectedCategory, scrollSpeed]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value as CategoryName);
    onKeywordClick(event.target.value);
  };

  return (
    <Box maxW="md" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md" bg="white" position="relative">
      <Select value={selectedCategory} onChange={handleCategoryChange}>
        {Object.keys(categories).map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </Select>

      <Flex
        ref={containerRef}
        overflowX="auto"
        whiteSpace="nowrap"
        p={4}
        css={{
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none'
        }}
      >
        {[...Array(3)].flatMap((_, multiplier) =>
          keywords.map((keyword, index) => (
            <Link
              key={index + keywords.length * multiplier}
              color="blue"
              mr={4}
              onClick={() => onKeywordClick(keyword)}
            >
              {keyword}
            </Link>
          ))
        )}
      </Flex>
    </Box>
  );
};

export default Keywords;