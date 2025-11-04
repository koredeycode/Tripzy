import { Driver, MarkerData } from "@/type";

const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
    const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005

    return {
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      ...driver,
    };
  });
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
  const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

// export const calculateDriverTimes = async ({
//   markers,
//   userLatitude,
//   userLongitude,
//   destinationLatitude,
//   destinationLongitude,
// }: {
//   markers: MarkerData[];
//   userLatitude: number | null;
//   userLongitude: number | null;
//   destinationLatitude: number | null;
//   destinationLongitude: number | null;
// }) => {
//   if (
//     !userLatitude ||
//     !userLongitude ||
//     !destinationLatitude ||
//     !destinationLongitude
//   )
//     return;

//   try {
//     const timesPromises = markers.map(async (marker) => {
//       const responseToUser = await fetch(
//         `https://maps.googleapis.com/maps/api/directions/json?origin=${marker.latitude},${marker.longitude}&destination=${userLatitude},${userLongitude}&key=${directionsAPI}`
//       );
//       const dataToUser = await responseToUser.json();
//       const timeToUser = dataToUser.routes[0].legs[0].duration.value; // Time in seconds

//       const responseToDestination = await fetch(
//         `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${directionsAPI}`
//       );
//       const dataToDestination = await responseToDestination.json();
//       const timeToDestination =
//         dataToDestination.routes[0].legs[0].duration.value; // Time in seconds

//       const totalTime = (timeToUser + timeToDestination) / 60; // Total time in minutes
//       const price = (totalTime * 0.5).toFixed(2); // Calculate price based on time

//       return { ...marker, time: totalTime, price };
//     });

//     return await Promise.all(timesPromises);
//   } catch (error) {
//     console.error("Error calculating driver times:", error);
//   }
// };

export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  if (
    !userLatitude ||
    !userLongitude ||
    !destinationLatitude ||
    !destinationLongitude
  )
    return;

  const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY; // store key in .env

  try {
    const timesPromises = markers.map(async (marker) => {
      // Step 1: Calculate time from driver → user
      const responseToUser = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${marker.longitude},${marker.latitude}&end=${userLongitude},${userLatitude}`
      );
      const dataToUser = await responseToUser.json();
      const timeToUser = dataToUser.routes?.[0]?.summary?.duration ?? 0; // seconds

      // Step 2: Calculate time from user → destination
      const responseToDestination = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${userLongitude},${userLatitude}&end=${destinationLongitude},${destinationLatitude}`
      );
      const dataToDestination = await responseToDestination.json();
      const timeToDestination =
        dataToDestination.routes?.[0]?.summary?.duration ?? 0; // seconds

      // Step 3: Calculate total time (in minutes) and price
      const totalTime = (timeToUser + timeToDestination) / 60;
      const price = (totalTime * 0.5).toFixed(2);

      return { ...marker, time: totalTime, price };
    });

    return await Promise.all(timesPromises);
  } catch (error) {
    console.error("Error calculating driver times (ORS):", error);
  }
};
