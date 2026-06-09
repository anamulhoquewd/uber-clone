import axios from "axios";

export const getAddressCoordinate = async (address: string) => {
  const apiKey = process.env.GOOGLE_MAPS_API;
  
  // v4/New Text Search বা Geocoding endpoint সাধারণত POST রিকোয়েস্ট নেয়
  const url = `https://places.googleapis.com/v1/places:searchText?key=${apiKey}`;

  try {
    const response = await axios.post(
      url,
      { textQuery: address }, // Payload
      {
        headers: {
          'Content-Type': 'application/json',
          // কোন কোন ফিল্ড রিটার্ন চান তা হেডার্সে বলে দিতে হয়
          'X-Goog-FieldMask': 'places.location', 
        },
      }
    );

    console.log("Google Maps API response: ", response.data);

    if (!response.data.places || response.data.places.length === 0) {
      return {
        error: {
          message: `Geocoding failed: No places found`,
        },
      };
    }

    // নতুন API-তে location সরাসরি latitude এবং longitude অবজেক্ট দেয়
    const location = response.data.places[0].location;
    return {
      success: {
        success: true,
        data: {
          ltd: location.latitude,
          lng: location.longitude,
        },
      },
    };
  } catch (error: any) {
    return {
      serverError: {
        message: error.response?.data?.error?.message || error.message,
        stack: process.env.NODE_ENV === "production" ? null : error.stack,
      },
    };
  }
};


export const getDistanceDuration = async (origin: string, destination: string) => {
  const apiKey = process.env.GOOGLE_MAPS_API;
  console.log("Using Demo API Key: ", apiKey);
  
  // ডেমো কি-র জন্য সঠিক v1 Routes API এন্ডপয়েন্ট
  const url = `https://routes.googleapis.com/v1/computeRoutes?key=${apiKey}`;

  try {
    const response = await axios.post(
      url,
      {
        // ডемо কি-তে টেক্সট অ্যাড্রেস সরাসরি পাস করার সঠিক ফরম্যাট
        origin: {
          address: origin // যেমন: "banasree"
        },
        destination: {
          address: destination // যেমন: "airport"
        },
        // travelMode: "DRIVE"
      },
      {
        headers: {
          "Content-Type": "application/json",
          // ডেমো কি-র রেসপন্স ফিল্টার করার জন্য এই হেডারটি দেওয়া বাধ্যতামূলক
        //   "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
        }
      }
    );
    
    console.log("Google Maps Routes API response: ", response.data);

    if (!response.data?.routes || response.data.routes.length === 0) {
      return {
        error: {
          message: `Distance Matrix failed: No routes found`,
        },
      };
    }

    const route = response.data.routes[0];
    return {
      success: {
        success: true,  
        data: {
          distance: route?.distanceMeters ?? 0, // মিটারে আসবে
          duration: route?.duration ?? "0s",    // স্ট্রিং ফরম্যাটে আসবে (যেমন: "1500s")
        },
      },
    };
  } catch (error: any) {
    // এরর রেসপন্সটি কনসোলে ডিটেইল দেখার জন্য
    console.error("Google API Error Details:", error.response?.data);
    
    return {
      serverError: {
        message: error.response?.data?.error?.message || error.message,
        stack: process.env.NODE_ENV === "production" ? null : error.stack,
      },
    };
  }
};