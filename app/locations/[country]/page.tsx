import { notFound } from 'next/navigation';
import { getStatesWithRoomCounts, getFullStateName, formatStateForURL, getDatabaseStats } from '@/lib/data-source';
import { createCountryMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { MapPin, Building2, Globe, Star, ArrowRight, Key, Lock, Clock, Search, Puzzle } from 'lucide-react';
import { Metadata } from 'next';

interface CountryPageProps {
  params: Promise<{
    country: string;
  }>;
}

const SUPPORTED_COUNTRIES = {
  'united-states': 'United States',
  'canada': 'Canada',
  'united-kingdom': 'United Kingdom'
};

// Helper to get country image from WordPress
const getCountryImage = (country: string) => {
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const countryImages: { [key: string]: string } = {
    'united-states': `${wpUrl}/wp-content/uploads/2025/11/united-states-scaled.jpg`,
    'canada': `${wpUrl}/wp-content/uploads/2025/11/canada-scaled.jpg`,
    'united-kingdom': `${wpUrl}/wp-content/uploads/2025/11/united-kingdom.jpg`,
  };
  return countryImages[country] || countryImages['united-states'];
};



export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country } = await params;

  if (!SUPPORTED_COUNTRIES[country as keyof typeof SUPPORTED_COUNTRIES]) {
    return {
      title: 'Country Not Found',
      description: 'The requested country page could not be found.'
    };
  }

  const countryName = SUPPORTED_COUNTRIES[country as keyof typeof SUPPORTED_COUNTRIES];
  const { data: statesWithCounts } = await getStatesWithRoomCounts(countryName);
  const dbStats = await getDatabaseStats();
  const totalRooms = country === 'united-states' ? dbStats.totalRooms : (statesWithCounts?.reduce((sum, state) => sum + state.room_count, 0) || 0);
  const totalStates = statesWithCounts?.length || 0;

  return createCountryMetadata(
    countryName,
    totalStates
  );
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country } = await params;

  // Only log debug info in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[country] Debug:', { country, isUSA: country === 'united-states' });
  }

  // Validate country parameter
  if (!SUPPORTED_COUNTRIES[country as keyof typeof SUPPORTED_COUNTRIES]) {
    notFound();
  }

  const countryName = SUPPORTED_COUNTRIES[country as keyof typeof SUPPORTED_COUNTRIES];

  try {
    // Get states/provinces for this country
    const { data: statesWithCounts } = await getStatesWithRoomCounts(countryName);

    if (!statesWithCounts || statesWithCounts.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Escape Rooms in {countryName}</h1>
          <p className="text-muted-foreground">
            No escape rooms found in {countryName} yet. Check back soon!
          </p>
        </div>
      );
    }

    // Get accurate database statistics
    const dbStats = await getDatabaseStats();
    const totalRooms = country === 'united-states' ? dbStats.totalRooms : (statesWithCounts?.reduce((sum, state) => sum + state.room_count, 0) || 0);
    const totalStates = country === 'united-states' ? dbStats.uniqueStates : (statesWithCounts?.length || 0);

    return (
      <div className="min-h-screen bg-background">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': `https://escaperoomsfinder.com/locations/${country}#organization`,
              'name': `Escape Rooms Finder ${countryName}`,
              'url': `https://escaperoomsfinder.com/locations/${country}`,
              'description': `Directory of escape rooms in ${countryName}. Find local escape room experiences.`,
              'areaServed': {
                '@type': 'Country',
                'name': countryName
              },
              'numberOfItems': totalRooms,
              'potentialAction': {
                '@type': 'SearchAction',
                'target': `https://escaperoomsfinder.com/browse?country=${countryName}&{search_term_string}`,
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              'itemListElement': [
                {
                  '@type': 'ListItem',
                  'position': 1,
                  'name': 'Home',
                  'item': 'https://escaperoomsfinder.com'
                },
                {
                  '@type': 'ListItem',
                  'position': 2,
                  'name': 'Locations',
                  'item': 'https://escaperoomsfinder.com/locations'
                },
                {
                  '@type': 'ListItem',
                  'position': 3,
                  'name': countryName,
                  'item': `https://escaperoomsfinder.com/locations/${country}`
                }
              ]
            })
          }}
        />
        {/* Breadcrumb Navigation */}
        <div className="bg-[#f7fafc] border-b">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/locations">Locations</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{countryName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section */}
        <section
          className="relative text-white py-20 overflow-hidden border-b border-slate-200"
          style={{
            backgroundImage: `url('${getCountryImage(country)}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

          {/* Subtle decorative elements */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-20 right-20 w-64 h-64 bg-escape-red rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-48 h-48 bg-escape-red/50 rounded-full blur-2xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-escape-red/20 border border-escape-red/30 backdrop-blur-sm">
                  <Globe className="h-6 w-6 text-escape-red" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">{countryName}</span>
                  <h1 className="mt-1 text-3xl font-semibold text-white">Escape Rooms in {countryName}</h1>
                </div>
              </div>
              <p className="text-base text-slate-200 max-w-2xl mx-auto leading-relaxed mb-6">
                Discover thrilling escape room adventures across {countryName}. From mind-bending puzzles to immersive storylines, find your next challenge.
              </p>

              {/* Statistics */}
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <Building2 className="h-4 w-4 text-escape-red" />
                  <span className="font-semibold text-white text-sm">{totalRooms.toLocaleString()}</span>
                  <span className="text-slate-300 text-xs">Rooms</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <MapPin className="h-4 w-4 text-escape-red" />
                  <span className="font-semibold text-white text-sm">{totalStates}</span>
                  <span className="text-slate-300 text-xs">{country === 'united-states' ? 'States' : country === 'canada' ? 'Provinces' : 'Regions'}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <Star className="h-4 w-4 text-escape-red" />
                  <span className="font-semibold text-white text-sm">Premium</span>
                  <span className="text-slate-300 text-xs">Experiences</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* States Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-escape-red">Browse by {country === 'united-states' ? 'state' : 'region'}</span>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Choose Your {country === 'united-states' ? 'State' : 'Region'}</h2>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              Select a {country === 'united-states' ? 'state' : 'region'} below to discover escape rooms in your area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {statesWithCounts.map((stateData, index) => {
              const stateName = stateData.state;
              const fullStateName = stateData.fullName;
              const stateUrl = formatStateForURL(stateName);

              // Array of different descriptions
              const descriptions = [
                `Experience thrilling escape room adventures and immersive puzzle challenges in ${fullStateName}`,
                `Discover amazing escape room experiences with unique themes and storylines across ${fullStateName}`,
                `Explore captivating escape rooms featuring mind-bending puzzles and exciting adventures in ${fullStateName}`,
                `Uncover incredible escape room destinations with challenging scenarios and unforgettable experiences in ${fullStateName}`
              ];

              const description = descriptions[index % descriptions.length];

              const icons = [Key, Lock, Puzzle, Search];
              const IconComponent = icons[index % icons.length];

              // Different background colors for variety
              const backgroundColors = [
                'bg-gradient-to-br from-red-50 via-white to-red-50/50',
                'bg-gradient-to-br from-slate-50 via-white to-slate-50/50',
                'bg-gradient-to-br from-escape-red/5 via-white to-escape-red/5',
                'bg-gradient-to-br from-blue-50 via-white to-blue-50/50',
                'bg-gradient-to-br from-purple-50 via-white to-purple-50/50',
                'bg-gradient-to-br from-orange-50 via-white to-orange-50/50',
              ];

              const backgroundColor = backgroundColors[index % backgroundColors.length];

              return (
                <Link
                  key={`${stateName}-${index}`}
                  href={`/locations/${country}/${stateUrl}`}
                  className="group block"
                >
                  <Card className={`h-full transition-all duration-300 border border-slate-200 ${backgroundColor} shadow-sm hover:shadow-md hover:border-escape-red/30 overflow-hidden`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-escape-red/10 border border-escape-red/20">
                          <IconComponent className="h-5 w-5 text-escape-red" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-semibold uppercase tracking-wide text-slate-500 bg-slate-100 border-slate-200">
                          {country === 'united-states' ? 'State' : 'Region'}
                        </Badge>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-escape-red transition-colors">
                          {fullStateName}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {description}
                        </p>
                      </div>

                      <div className="w-full bg-escape-red hover:bg-escape-red-600 text-white h-9 px-6 rounded-md text-center transition-colors font-semibold text-xs flex items-center justify-center gap-2">
                        Explore {fullStateName}
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching states:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Escape Rooms in {countryName}</h1>
        <p className="text-red-500">
          Sorry, we encountered an error loading the states. Please try again later.
        </p>
      </div>
    );
  }
}

export async function generateStaticParams() {
  return Object.keys(SUPPORTED_COUNTRIES).map((country) => ({
    country,
  }));
}