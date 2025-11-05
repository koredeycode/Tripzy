import { icons } from "@/constants";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
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
  const [showDropdown, setShowDropdown] = useState(false);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setShowDropdown(false));
  };

  const fetchSuggestions = async (text: string) => {
    if (text.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
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
            "User-Agent": "Tripzy/1.0 (contact: tripzy@tripzy.com)",
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
      setSuggestions(data);
      setShowDropdown(true);
      fadeIn();
    } catch (err) {
      console.error("Error fetching location suggestions:", err);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

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
    fadeOut();
    onSelect({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      address: item.display_name,
    });
  };

  // Auto-hide dropdown when clearing query
  useEffect(() => {
    if (!query.trim()) fadeOut();
  }, [query]);

  const noLocations =
    !loading && query.trim().length >= 2 && suggestions.length === 0;

  return (
    <View className="relative w-full py-2">
      <View className="relative flex flex-row items-center">
        {/* Left Icon */}
        <View className="absolute z-10 left-3">
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
            backgroundColor: textInputBackgroundColor ?? "white",
          }}
          numberOfLines={1}
        />
      </View>

      {/* Dropdown with animation */}
      {showDropdown && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            position: "absolute",
            left: 0,
            right: 0,
            top: 64,
            zIndex: 50,
            backgroundColor: "white",
            borderRadius: 12,
            maxHeight: 240, // ensures dropdown is limited
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            overflow: "hidden", // makes it cleanly scrollable
          }}
        >
          {loading ? (
            <Text className="p-3 text-center text-gray-500">Searching...</Text>
          ) : noLocations ? (
            <View className="p-3">
              <Text className="text-center text-gray-500">
                No locations found
              </Text>
            </View>
          ) : (
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
              showsVerticalScrollIndicator={false}
              style={{
                maxHeight: 240, // allows scrolling only inside dropdown
              }}
            />
          )}
        </Animated.View>
      )}
    </View>
  );
};

export default LocationAutocomplete;
