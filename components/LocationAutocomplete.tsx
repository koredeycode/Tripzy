import { icons } from "@/constants";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDebouncedCallback } from "use-debounce";

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  osm_id: number;
}

interface Props {
  onSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  textInputBackgroundColor?: string;
  icon?: any;
  initialLocation?: string;
}

const LocationAutocomplete = ({
  onSelect,
  textInputBackgroundColor,
  icon,
  initialLocation,
}: Props) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (text: string) => {
    if (text.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          text
        )}`,
        {
          headers: {
            "User-Agent": "SabiRentApp/1.0 (contact: sabirent@example.com)",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Nominatim error:",
          response.status,
          await response.text()
        );
        setLoading(false);
        return;
      }

      const data = await response.json();
      // console.log({ data });
      setSuggestions(data);
    } catch (err) {
      console.error("Error fetching location suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Debounce fetch call (runs 400ms after user stops typing)
  const debouncedFetch = useDebouncedCallback((text: string) => {
    fetchSuggestions(text);
  }, 400);

  const handleInputChange = (text: string) => {
    setQuery(text);
    debouncedFetch(text);
  };

  const handleSelect = (item: Suggestion) => {
    setQuery(item.display_name);
    setSuggestions([]);
    onSelect({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      address: item.display_name,
    });
  };

  return (
    <View className="relative w-full py-2">
      <View className="relative flex flex-row items-center">
        {/* Left Icon */}
        <View className="absolute left-3" style={{ zIndex: 90 }}>
          <Image
            source={icon ? icon : icons.search}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </View>

        {/* Input */}
        <TextInput
          value={query}
          onChangeText={handleInputChange}
          placeholder={initialLocation ?? "Where do you want to go?"}
          className="flex-1 py-3 pl-10 pr-4 text-base rounded-full"
          placeholderTextColor="gray"
          style={{
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
          }}
          numberOfLines={1}
        />
      </View>

      {/* Dropdown suggestions */}
      {suggestions.length > 0 && (
        <View className="absolute left-0 right-0 z-50 bg-white rounded-lg shadow-lg top-16 max-h-60">
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={suggestions}
            keyExtractor={(item) => item.osm_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)}>
                <Text className="p-3 text-gray-800 border-b border-gray-200">
                  {item.display_name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {loading && query.length > 1 && (
        <Text className="px-3 mt-1 text-sm text-gray-400">Searching...</Text>
      )}
    </View>
  );
};

export default LocationAutocomplete;
