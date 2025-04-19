import React, { useState, useEffect } from 'react';
import { Box, Text, Image, Center, Flex, Stack, Card, Button } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBmjTN_8V9t1Dgh8XI3OfFGL1xTeRjU4_g';

const getPriceSymbol = (priceLevel: string) => {
  switch (priceLevel) {
    case 'PRICE_LEVEL_INEXPENSIVE':
      return '💲';
    case 'PRICE_LEVEL_MODERATE':
      return '💲💲';
    case 'PRICE_LEVEL_EXPENSIVE':
      return '💲💲💲';
    default:
      return '❓';
  }
};

const truncateWebsite = (websiteUri: string) => {
  if (!websiteUri) return '';
  const url = new URL(websiteUri);
  return url.hostname;
};

const truncateAddress = (formattedAddress: string) => {
  if (!formattedAddress) return { street: '', city: '', state: '', zipCode: '', country: '' };

  const regex = /\b\d{5}\b/g;
  const matches = [...formattedAddress.matchAll(regex)];

  if (matches.length > 0) {
    const lastMatchIndex = matches[matches.length - 1].index;
    const truncatedAddress = formattedAddress.substring(0, lastMatchIndex).trim();
    const addressParts = truncatedAddress.split(',').map(part => part.trim());

    let street = '';
    let city = '';
    let state = '';
    let zipCode = '';
    let country = '';

    if (addressParts.length >= 1) street = addressParts[0];
    if (addressParts.length >= 2) city = addressParts[1];
    if (addressParts.length >= 3) state = addressParts[2];
    if (addressParts.length >= 4) zipCode = addressParts[3];
    if (addressParts.length >= 5) country = addressParts[4];

    return { street, city, state, zipCode, country };
  }

  return { street: formattedAddress, city: '', state: '', zipCode: '', country: '' };
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
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=16&size=200x200&markers=color:red%7C${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
  const truncatedWebsite = truncateWebsite(place.websiteUri);
  const truncatedPhoneNumber = truncatePhoneNumber(place.internationalPhoneNumber);
  const { street, city, state, zipCode, country } = truncateAddress(place.formattedAddress);

  return (

    <Card
      maxW="md"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      bg="white"
    >
      {place.displayName.text ? (
        <Text fontWeight="bold" fontSize="lg" mt={4} ml={4} mr={4}>{place.displayName.text}</Text>
      ) : (
        <Text fontWeight="bold" fontSize="xs" mt={4} ml={4} mr={4}>
          👤 UNLISTED
        </Text>
      )}

      <Flex direction="row" justifyContent="center" p={3}>
        
        <Image src={mapUrl} alt="Location Map" borderWidth="1px" borderRadius="lg" boxShadow="md" width="200" height="200"/>

        <Stack width="100%" height="100%" justifyContent="center" alignContent="center">

          {place.formattedAddress ? (
            <Stack>
              <Text fontWeight="bold" fontSize="xs" mt={4} ml={4}>{place.formattedAddress}</Text>
            </Stack>
          ) : (
            <Text fontWeight="bold" fontSize="xs" mt={4} ml={4}>
              🏠 UNLISTED
            </Text>
          )}

          {place.internationalPhoneNumber ? (
            <Text fontWeight="bold" fontSize="xs" color="blue" mt={4} ml={4}>
              <a href={`tel:${place.internationalPhoneNumber}`}>📞 {truncatedPhoneNumber}</a>
            </Text>
          ) : (
            <Text fontWeight="bold" fontSize="xs" mt={4} ml={4}>
              📞 UNLISTED
            </Text>
          )}

          {place.websiteUri ? (
            <Text fontWeight="bold" fontSize="xs" color="blue" mt={4} ml={4}>
              <a href={place.websiteUri} target="_blank" rel="noopener noreferrer">🌐{truncatedWebsite}</a>
            </Text>
          ) : (
            <Text fontWeight="bold" fontSize="xs" mt={4} ml={4}>
              🌐 UNLISTED
            </Text>
          )}

          <Flex direction="row" justifyContent="center" mt={4} ml={4}>

            <Text fontWeight="bold" fontSize="xs" mr={4}>
              Prices : {priceSymbol || '❓'}
            </Text>

            {place.rating ? (
              <Text fontWeight="bold" fontSize="xs">
                Rating : 
                {[...Array(Math.floor(place.rating))].map((_, index) => (
                  <StarIcon key={index} color="yellow.400" />
                ))}
              </Text>
            ) : (
              <Text fontWeight="bold" fontSize="xs">
                Rating : ❓
              </Text>
            )}

          </Flex>

        </Stack>

      </Flex>

    </Card>

  );

};

export default BusinessCard;