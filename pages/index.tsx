import React, { useState, useEffect } from 'react';
import { Box, Text, Input, Button, CircularProgress, Flex, Stack, Center } from '@chakra-ui/react';
import axios from 'axios';
import BusinessCard from '../components/BusinessCard';
import Keywords from '../components/Keywords';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface LocationData {
  city: string;
  zipCode: string;
}

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any | null>(null);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!userLocation) {
      fetchLocation();
    }
  }, [userLocation]);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Directly using Google Maps Geocoding API to get location data
      const geocodeResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          latlng: `${latitude},${longitude}`,
          key: GOOGLE_MAPS_API_KEY,
        },
      });

      if (geocodeResponse.data.status === 'OK') {
        const locationData = geocodeResponse.data.results[0].address_components;
        setLocationData({
          city: locationData.find((component: any) => component.types.includes('locality'))?.long_name,
          zipCode: locationData.find((component: any) => component.types.includes('postal_code'))?.long_name,
        });
        setUserLocation(`${latitude},${longitude}`);
        searchNearbyPlaces(latitude, longitude); // Proceed with places search
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchNearbyPlaces = async (latitude: number, longitude: number) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://places.googleapis.com/v1/places:searchText',
        {
          openNow: true,
          maxResultCount: 20,
          locationBias: {
            circle: {
              center: { latitude, longitude },
              radius: 1000,
            },
          },
          textQuery: searchQuery || 'places',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.name,places.id,places.photos,places.formattedAddress,places.priceLevel,places.rating,places.businessStatus,places.googleMapsUri,places.internationalPhoneNumber,places.websiteUri',
          },
        }
      );
      if (response.data && response.data.places) {
        setPlaces(response.data.places);
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  };

  const keywordNearbyPlaces = async (latitude: number, longitude: number, keyword: string) => {
    try {
      const response = await axios.post(
        'https://places.googleapis.com/v1/places:searchText',
        {
          openNow: true,
          maxResultCount: 20,
          locationBias: {
            circle: {
              center: { latitude, longitude },
              radius: 1000,
            },
          },
          textQuery: keyword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.name,places.id,places.photos,places.formattedAddress,places.priceLevel,places.rating,places.businessStatus,places.googleMapsUri,places.internationalPhoneNumber,places.websiteUri',
          },
        }
      );
      if (response.data && response.data.places) {
        setPlaces(response.data.places);
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  };

  const handleKeywordClick = async (keyword: string) => {
    setLoading(true);
    setSearchQuery(keyword);
    try {
      if (userLocation) {
        await keywordNearbyPlaces(
          parseFloat(userLocation?.split?.(',')[0] ?? '0'),
          parseFloat(userLocation?.split?.(',')[1] ?? '0'),
          keyword
        );
      } else {
        console.error('User location is null');
      }
    } catch (error) {
      console.error('Error setting keyword:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (userLocation) {
        await searchNearbyPlaces(
          parseFloat(userLocation?.split?.(',')[0] ?? '0'),
          parseFloat(userLocation?.split?.(',')[1] ?? '0')
        );
      } else {
        console.error('User location is null');
      }
    } catch (error) {
      console.error('Error searching for places:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="linear-gradient(to bottom, #2979FF, #000000)" minHeight="100vh" py={8} no-scrollbar="true" overflow-hidden>
      <Box textAlign="center" maxW="md" mx="auto">
        <Flex justifyContent="center" mb={4}>
          <Input
            type="text"
            placeholder="Explore..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            borderRadius="full"
            size="lg"
            bg="white"
            color="black"
            boxShadow="lg"
            m={4}
            onSubmit={handleSearch}
          />
          <Button
            onClick={handleSearch}
            isLoading={loading}
            loadingText="Searching..."
            borderRadius="full"
            size="lg"
            variant="solid"
            bgGradient="linear(to-r, #FFD700, #FFA500)"
            _hover={{ bgGradient: "linear(to-r, #FFA500, #FFD700)" }}
            _active={{ bgGradient: "linear(to-r, #FFA500, #FFD700)" }}
            _focus={{ outline: "none" }}
            ml={2}
            m={4}
          >
            Near Me
          </Button>
        </Flex>

        <Keywords onKeywordClick={handleKeywordClick} />

        {locationData && (
          <Center mt={4}>
          </Center>
        )}

        <LoadingSpinner loading={loading} />

        {!loading && (
          <Center>
            <Stack spacing={4}>
              {places.map((place, index) => (
                <BusinessCard key={index} place={place} />
              ))}
            </Stack>
          </Center>
        )}
      </Box>
      
      <Box as="footer" bg="black.900" py={4} px={6}>
        <Center>
          <Text fontSize="sm" color="white" ml={3}>
            © 2025 Near-Me. All rights reserved.
          </Text>
        </Center>
      </Box>
    </Box>
  );
};

const LoadingSpinner: React.FC<{ loading: boolean; }> = ({ loading }) => {
  return (
    <Center>
      {loading && <CircularProgress size="100px" color="cyan" isIndeterminate mt={4} />}
    </Center>
  );
};

export default HomePage;
