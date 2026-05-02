export type GoogleReview = {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text: {
    text: string;
    languageCode: string;
  };
  originalText: {
    text: string;
    languageCode: string;
  };
  authorAttribution: {
    displayName: string;
    uri: string;
    photoUri: string;
  };
  publishTime: string;
};

export type PlaceDetails = {
  displayName: {
    text: string;
    languageCode: string;
  };
  rating: number;
  userRatingCount: number;
  reviews: GoogleReview[];
};

export async function getPlaceDetails(): Promise<PlaceDetails | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID || "ChIJjZ4Dm5Inz5QRdpiFciUspBE";
  const fields = "displayName,rating,userRatingCount,reviews";

  if (!apiKey) {
    console.error("GOOGLE_PLACES_API_KEY não está configurada");
    return null;
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=${fields}&key=${apiKey}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      },
    );

    if (!res.ok) {
      console.error(
        "Erro ao buscar detalhes do lugar:",
        res.status,
        res.statusText,
      );
      return null;
    }

    const data: PlaceDetails = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar detalhes do Google Places:", error);
    return null;
  }
}
