import React, { useState, useEffect } from 'react';
import { Box, Text, Image, Center, Flex, Stack, Card, Button } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const getPriceSymbol = (priceLevel: string): string => {
  const priceMap: Record<string, string> = {
    PRICE_LEVEL_INEXPENSIVE: '💲',
    PRICE_LEVEL_MODERATE: '💲💲',
    PRICE_LEVEL_EXPENSIVE: '💲💲💲',
  };
  return priceMap[priceLevel] ?? '❓';
};

const truncateWebsite = (websiteUri: string) => {
  if (!websiteUri) return '';
  const url = new URL(websiteUri);
  return url.hostname;
};

const truncateAddress = (formattedAddress: string) => {
  const EMPTY_ADDRESS = { street: '', city: '', state: '', zipCode: '', country: '' };
  if (!formattedAddress) return EMPTY_ADDRESS;

  const zipRegex = /\b\d{5}\b/g;
  const matches = [...formattedAddress.matchAll(zipRegex)];
  if (!matches.length) return { ...EMPTY_ADDRESS, street: formattedAddress };

  const lastZipIndex = matches.at(-1)?.index ?? 0;
  const truncated = formattedAddress.substring(0, lastZipIndex).trim();
  const [street = '', city = '', state = '', zipCode = '', country = ''] = 
    truncated.split(',').map(part => part.trim());

  return { street, city, state, zipCode, country };
};

const truncatePhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return '';

  const regex = /^\+(\d{1,3})\s?/;
  const matches = phoneNumber.match(regex);
  if (matches && matches.length > 0) {
    phoneNumber = phoneNumber.replace(matches[0], '');
  }

  return phoneNumber.substring(0, 15);
};

interface Place {
  id: string;
  name: string;
  displayName: {
    text: string;
  };
  internationalPhoneNumber: string;
  formattedAddress: string;
  websiteUri: string;
  rating: number;
  priceLevel: string;
  openNow: string;
}

const BusinessCard = ({ place }: { place: Place }) => {
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const priceSymbol = getPriceSymbol(place.priceLevel);

  useEffect(() => {
    async function fetchCoordinates() {
      if (place && place.formattedAddress) {
        const apiKey = GOOGLE_MAPS_API_KEY;
        const encodedAddress = encodeURIComponent(place.formattedAddress);
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            setCoordinates({ latitude: lat, longitude: lng });
          } else {
            throw new Error('No results found for the provided address.');
          }
        } catch (error) {
          console.error('Error fetching coordinates:', error);
        }
      }
    }

    fetchCoordinates();
  }, [place]);

  if (!coordinates) {
    return <div>Loading...</div>;
  }

  const { latitude, longitude } = coordinates;
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=200x200&markers=color:red%7C${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
  const truncatedWebsite = truncateWebsite(place.websiteUri);
  const truncatedPhoneNumber = truncatePhoneNumber(place.internationalPhoneNumber);
  const { street, city, state, zipCode, country } = truncateAddress(place.formattedAddress);

  return (
    <Card
      maxW="md"
      borderWidth="2px"
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
      m={4}
    >
      <Stack spacing={3} p={4}>
        <Text fontWeight="bold" fontSize="lg">
          {place.displayName.text || '👤 UNLISTED'}
        </Text>
        
        {(place as any)?.photos?.[0]?.name && (
          <Image
            src={`https://places.googleapis.com/v1/${(place as any).photos[0].name}/media?key=${GOOGLE_MAPS_API_KEY}&maxWidthPx=400`}
            alt={`${place.displayName.text}`}
            borderRadius="md"
            boxShadow="md"
            width="100%"
            maxH="400px"
            objectFit="cover"
          />
        )}

        <Image
          src={mapUrl}
          alt="Location Map"
          borderRadius="md"
          boxShadow="md"
          width="400px"
          height="300px"
          objectFit="cover"
        />
  
        <Text fontSize="sm">
          {place.formattedAddress || '🏠 UNLISTED'}
        </Text>
  
        <Text fontSize="sm" color={place.internationalPhoneNumber ? 'blue.600' : 'black'}>
          {place.internationalPhoneNumber ? (
            <a href={`tel:${place.internationalPhoneNumber}`}>📞 {truncatedPhoneNumber}</a>
          ) : '📞 UNLISTED'}
        </Text>
  
        <Text fontSize="sm" color={place.websiteUri ? 'blue.600' : 'black'}>
          {place.websiteUri ? (
            <a href={place.websiteUri} target="_blank" rel="noopener noreferrer">🌐 {truncatedWebsite}</a>
          ) : '🌐 UNLISTED'}
        </Text>
  
        <Flex justifyContent="space-between" alignItems="center" mt={2}>
          <Text fontSize="sm" display="flex" alignItems="center">
            Rating:&nbsp;
            {place.rating ? (
              [...Array(Math.floor(place.rating))].map((_, index) => (
                <StarIcon key={index} color="yellow.400" />
              ))
            ) : '❓'}
          </Text>
          <Text fontSize="sm">{priceSymbol || '❓'}: Prices </Text>
        </Flex>

      </Stack>
    </Card>
  );
  
};

export default BusinessCard;