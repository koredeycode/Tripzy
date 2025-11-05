import arrowDown from "@/assets/icons/arrow-down.png";
import arrowUp from "@/assets/icons/arrow-up.png";
import backArrow from "@/assets/icons/back-arrow.png";
import chat from "@/assets/icons/chat.png";
import checkmark from "@/assets/icons/check.png";
import close from "@/assets/icons/close.png";
import dollar from "@/assets/icons/dollar.png";
import ellipsis from "@/assets/icons/ellipsis.png";
import email from "@/assets/icons/email.png";
import eyecross from "@/assets/icons/eyecross.png";
import google from "@/assets/icons/google.png";
import home from "@/assets/icons/home.png";
import list from "@/assets/icons/list.png";
import lock from "@/assets/icons/lock.png";
import map from "@/assets/icons/map.png";
import marker from "@/assets/icons/marker.png";
import out from "@/assets/icons/out.png";
import person from "@/assets/icons/person.png";
import phone from "@/assets/icons/phone.png";
import pin from "@/assets/icons/pin.png";
import point from "@/assets/icons/point.png";
import profile from "@/assets/icons/profile.png";
import search from "@/assets/icons/search.png";
import selectedMarker from "@/assets/icons/selected-marker.png";
import star from "@/assets/icons/star.png";
import target from "@/assets/icons/target.png";
import to from "@/assets/icons/to.png";
import check from "@/assets/images/check.png";
import getStarted from "@/assets/images/get-started.png";
import message from "@/assets/images/message.png";
import noResult from "@/assets/images/no-result.png";
import onboarding1 from "@/assets/images/onboarding1.png";
import onboarding2 from "@/assets/images/onboarding2.png";
import onboarding3 from "@/assets/images/onboarding3.png";
import signUpCar from "@/assets/images/signup-car.png";

export const images = {
  onboarding1,
  onboarding2,
  onboarding3,
  getStarted,
  signUpCar,
  check,
  noResult,
  message,
};

export const icons = {
  arrowDown,
  arrowUp,
  backArrow,
  chat,
  checkmark,
  close,
  dollar,
  email,
  eyecross,
  google,
  home,
  list,
  lock,
  map,
  marker,
  out,
  person,
  pin,
  point,
  profile,
  search,
  selectedMarker,
  star,
  target,
  to,
  phone,
  ellipsis,
};

export const onboarding = [
  {
    id: 1,
    title: "The perfect ride is just a tap away!",
    description:
      "Your journey begins with Tripzy. Find your ideal ride effortlessly.",
    image: images.onboarding1,
  },
  {
    id: 2,
    title: "Best car in your hands with Tripzy",
    description:
      "Discover the convenience of finding your perfect ride with Tripzy",
    image: images.onboarding2,
  },
  {
    id: 3,
    title: "Your ride, your way. Let's go!",
    description:
      "Enter your destination, sit back, and let us take care of the rest.",
    image: images.onboarding3,
  },
];

export const data = {
  onboarding,
};

// Chat mock data
export type ChatMessage = {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: string;
};

export type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar?: string;
};

const genMessages = (count: number, seedText = "Sample message") =>
  Array.from({ length: count }, (_, i) => ({
    id: `g${i + 1}`,
    text:
      i % 5 === 0
        ? `${seedText} ${i + 1}. This one is a bit longer to test wrapping and layout for multiple lines in a bubble.`
        : `${seedText} ${i + 1}`,
    fromMe: i % 2 === 0,
    timestamp: `${(10 + (i % 50)).toString().padStart(2, "0")}:${(i % 60)
      .toString()
      .padStart(2, "0")}`,
  })) as ChatMessage[];

export const chatConversations: Conversation[] = [
  {
    id: "0",
    name: "New Driver",
    lastMessage: "No messages yet",
    time: "now",
    avatar:
      "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/200x200/",
  },
  {
    id: "1",
    name: "James Wilson",
    lastMessage: "I\'m pulling up now.",
    time: "2m",
    avatar:
      "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/200x200/",
  },
  {
    id: "2",
    name: "Michael Johnson",
    lastMessage: "Anytime. Safe travels!",
    time: "1d",
    avatar:
      "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/200x200/",
  },
  {
    id: "3",
    name: "Priya Patel",
    lastMessage: "On my way.",
    time: "5m",
    avatar:
      "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/200x200/",
  },
  {
    id: "4",
    name: "Chen Wei",
    lastMessage: "We\'ll take the fastest route.",
    time: "3h",
    avatar:
      "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/200x200/",
  },
  {
    id: "5",
    name: "Sofia Rossi",
    lastMessage: "See you soon!",
    time: "Tue",
    avatar:
      "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/200x200/",
  },
  {
    id: "6",
    name: "Liam Smith",
    lastMessage: "Traffic ahead, +5 mins",
    time: "Wed",
    avatar:
      "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/200x200/",
  },
];

export const chatMessages: Record<string, ChatMessage[]> = {
  // No messages state
  "0": [],
  // Few messages
  "3": [
    {
      id: "m1",
      text: "Hi, I\'m at the pickup.",
      fromMe: true,
      timestamp: "10:02",
    },
    { id: "m2", text: "On my way.", fromMe: false, timestamp: "10:03" },
    { id: "m3", text: "Great, thanks!", fromMe: true, timestamp: "10:03" },
  ],
  // Plenty (~30)
  "4": genMessages(30, "Update"),
  // Soo plenty (~200)
  "5": genMessages(200, "Chat"),
  // Longer realistic ones
  "1": [
    {
      id: "m1",
      text: "Hi James, I\'m at the pickup spot.",
      fromMe: true,
      timestamp: "21:02",
    },
    {
      id: "m2",
      text: "Great! Arriving in 5 minutes.",
      fromMe: false,
      timestamp: "21:03",
    },
    {
      id: "m3",
      text: "I\'m near the main entrance by the coffee shop.",
      fromMe: true,
      timestamp: "21:03",
    },
    {
      id: "m4",
      text: "Perfect, please look for a black sedan.",
      fromMe: false,
      timestamp: "21:04",
    },
    {
      id: "m5",
      text: "Got it. License plate ends with 427, right?",
      fromMe: true,
      timestamp: "21:04",
    },
    {
      id: "m6",
      text: "Yes, that\'s correct.",
      fromMe: false,
      timestamp: "21:04",
    },
    {
      id: "m7",
      text: "Traffic on Oak St is a bit heavy, might be +2 mins.",
      fromMe: false,
      timestamp: "21:05",
    },
    {
      id: "m8",
      text: "No worries, I\'ll wait here.",
      fromMe: true,
      timestamp: "21:05",
    },
    {
      id: "m9",
      text: "Do you prefer AC on or off?",
      fromMe: false,
      timestamp: "21:06",
    },
    {
      id: "m10",
      text: "On, please. Thanks!",
      fromMe: true,
      timestamp: "21:06",
    },
    {
      id: "m11",
      text: "Noted. Any preferred route to the airport?",
      fromMe: false,
      timestamp: "21:07",
    },
    {
      id: "m12",
      text: "Fastest works for me.",
      fromMe: true,
      timestamp: "21:07",
    },
    {
      id: "m13",
      text: "I\'m pulling up now.",
      fromMe: false,
      timestamp: "21:08",
    },
    {
      id: "m14",
      text: "I see you. Walking over.",
      fromMe: true,
      timestamp: "21:08",
    },
    {
      id: "m15",
      text: "All set. See you in a second.",
      fromMe: false,
      timestamp: "21:09",
    },
  ],
  "2": [
    {
      id: "m1",
      text: "Thanks for earlier!",
      fromMe: true,
      timestamp: "Yesterday",
    },
    {
      id: "m2",
      text: "You\'re welcome. Have a nice day!",
      fromMe: false,
      timestamp: "Yesterday",
    },
    {
      id: "m3",
      text: "Ride was smooth and quick.",
      fromMe: true,
      timestamp: "Yesterday",
    },
    {
      id: "m4",
      text: "Glad to hear that. Appreciate it!",
      fromMe: false,
      timestamp: "Yesterday",
    },
    {
      id: "m5",
      text: "Left a 5-star rating.",
      fromMe: true,
      timestamp: "Yesterday",
    },
    {
      id: "m6",
      text: "Thank you so much!",
      fromMe: false,
      timestamp: "Yesterday",
    },
    {
      id: "m7",
      text: "If I\'m back in town, I\'ll book again.",
      fromMe: true,
      timestamp: "Yesterday",
    },
    {
      id: "m8",
      text: "Anytime. Safe travels!",
      fromMe: false,
      timestamp: "Yesterday",
    },
  ],
  // Mid-size
  "6": genMessages(12, "Note"),
};
