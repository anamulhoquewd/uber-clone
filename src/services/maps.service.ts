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
          "Content-Type": "application/json",
          // কোন কোন ফিল্ড রিটার্ন চান তা হেডার্সে বলে দিতে হয়
          "X-Goog-FieldMask": "places.location",
        },
      },
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

export const getDistanceDuration = async (
  origin: string,
  destination: string,
) => {
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== "OK") {
      return {
        error: {
          message: `Distance Matrix failed: ${data.status}`,
        },
      };
    }

    const element = data.rows[0].elements[0];

    if (element.status !== "OK") {
      return {
        error: {
          message: `Route not found: ${element.status}`,
        },
      };
    }

    return {
      success: {
        success: true,
        data: {
          distance: {
            text: element.distance.text,
            value: element.distance.value,
          },
          duration: {
            text: element.duration.text,
            value: element.duration.value,
          },
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

export const getRouteSuggestions = async (input: string) => {
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://places.googleapis.com/v1/places:autocomplete?key=${apiKey}`;

  try {
    const response = await axios.post(
      url,
      { input },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask":
            "suggestions.placePrediction.text,suggestions.placePrediction.placeId",
        },
      },
    );

    if (!response.data.suggestions || response.data.suggestions.length === 0) {
      return {
        error: {
          message: "No suggestions found",
        },
      };
    }

    const suggestions = response.data.suggestions.map((s: any) => ({
      description: s.placePrediction.text.text,
      placeId: s.placePrediction.placeId,
    }));

    return {
      success: {
        success: true,
        // data: suggestions,
        originalRes: response.data, // ডিবাগিংয়ের জন্য পুরো রেসপন্স রিটার্ন করছি, প্রোডাকশনে এটা বাদ দিতে পারেন
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