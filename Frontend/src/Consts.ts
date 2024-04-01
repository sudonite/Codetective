import { ChatMessage } from "@/Types";

export const domain =
  document.domain === "localhost" ? "http://localhost:8000" : document.domain;
export const API = domain + "/api/v1";

export const themeSelectors = [
  "light_zinc",
  "dark_zinc",
  "light_slate",
  "dark_slate",
  "light_stone",
  "dark_stone",
  "light_gray",
  "dark_gray",
  "light_neutral",
  "dark_neutral",
  "light_red",
  "dark_red",
  "light_rose",
  "dark_rose",
  "light_orange",
  "dark_orange",
  "light_green",
  "dark_green",
  "light_blue",
  "dark_blue",
  "light_yellow",
  "dark_yellow",
  "light_violet",
  "dark_violet",
  "radius_0",
  "radius_30",
  "radius_50",
  "radius_75",
  "radius_100",
];

export const themes = [
  {
    name: "zinc",
    activeColor: {
      light: "240 5.9% 10%",
      dark: "240 5.2% 33.9%",
    },
  },
  {
    name: "slate",
    activeColor: {
      light: "215.4 16.3% 46.9%",
      dark: "215.3 19.3% 34.5%",
    },
  },
  {
    name: "stone",
    activeColor: {
      light: "25 5.3% 44.7%",
      dark: "33.3 5.5% 32.4%",
    },
  },
  {
    name: "gray",
    activeColor: {
      light: "220 8.9% 46.1%",
      dark: "215 13.8% 34.1%",
    },
  },
  {
    name: "neutral",
    activeColor: {
      light: "0 0% 45.1%",
      dark: "0 0% 32.2%",
    },
  },
  {
    name: "red",
    activeColor: {
      light: "0 72.2% 50.6%",
      dark: "0 72.2% 50.6%",
    },
  },
  {
    name: "rose",
    activeColor: {
      light: "346.8 77.2% 49.8%",
      dark: "346.8 77.2% 49.8%",
    },
  },
  {
    name: "orange",
    activeColor: {
      light: "24.6 95% 53.1%",
      dark: "20.5 90.2% 48.2%",
    },
  },
  {
    name: "green",
    activeColor: {
      light: "142.1 76.2% 36.3%",
      dark: "142.1 70.6% 45.3%",
    },
  },
  {
    name: "blue",
    activeColor: {
      light: "221.2 83.2% 53.3%",
      dark: "217.2 91.2% 59.8%",
    },
  },
  {
    name: "yellow",
    activeColor: {
      light: "47.9 95.8% 53.1%",
      dark: "47.9 95.8% 53.1%",
    },
  },
  {
    name: "violet",
    activeColor: {
      light: "262.1 83.3% 57.8%",
      dark: "263.4 70% 50.4%",
    },
  },
] as const;

export type Theme = (typeof themes)[number];

export const codeTheme = {
  'code[class*="language-"]': {
    color: "#d6deeb",
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.5",
    fontSize: "1em",
    MozTabSize: "4",
    OTabSize: "4",
    tabSize: "4",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none",
  },
  'pre[class*="language-"]': {
    color: "white",
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.5",
    fontSize: "1em",
    MozTabSize: "4",
    OTabSize: "4",
    tabSize: "4",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none",
    padding: "1em",
    margin: "0.5em 0",
    overflow: "auto",
    background: "var(--background)",
  },
  'pre[class*="language-"]::-moz-selection': {
    textShadow: "none",
    background: "rgba(29, 59, 83, 0.99)",
  },
  'pre[class*="language-"] ::-moz-selection': {
    textShadow: "none",
    background: "rgba(29, 59, 83, 0.99)",
  },
  'code[class*="language-"]::-moz-selection': {
    textShadow: "none",
    background: "rgba(29, 59, 83, 0.99)",
  },
  'code[class*="language-"] ::-moz-selection': {
    textShadow: "none",
    background: "rgba(29, 59, 83, 0.99)",
  },
  'pre[class*="language-"]::selection': {
    textShadow: "none",
    background: "rgba(29, 59, 83, 0.99)",
  },
  'pre[class*="language-"] ::selection': {
    textShadow: "none",
    background: "rgba(29, 59, 83, 0.99)",
  },
  'code[class*="language-"]::selection': {
    textShadow: "none",
    background: "rgba(29, 59, 83, 0.99)",
  },
  'code[class*="language-"] ::selection': {
    textShadow: "none",
    background: "rgba(29, 59, 83, 0.99)",
  },
  ':not(pre) > code[class*="language-"]': {
    color: "white",
    background: "#011627",
    padding: "0.1em",
    borderRadius: "0.3em",
    whiteSpace: "normal",
  },
  comment: {
    color: "rgb(99, 119, 119)",
    fontStyle: "italic",
  },
  prolog: {
    color: "rgb(99, 119, 119)",
    fontStyle: "italic",
  },
  cdata: {
    color: "rgb(99, 119, 119)",
    fontStyle: "italic",
  },
  punctuation: {
    color: "rgb(199, 146, 234)",
  },
  ".namespace": {
    color: "rgb(178, 204, 214)",
  },
  deleted: {
    color: "rgba(239, 83, 80, 0.56)",
    fontStyle: "italic",
  },
  symbol: {
    color: "rgb(128, 203, 196)",
  },
  property: {
    color: "rgb(128, 203, 196)",
  },
  tag: {
    color: "rgb(127, 219, 202)",
  },
  operator: {
    color: "rgb(127, 219, 202)",
  },
  keyword: {
    color: "rgb(127, 219, 202)",
  },
  boolean: {
    color: "rgb(255, 88, 116)",
  },
  number: {
    color: "rgb(247, 140, 108)",
  },
  constant: {
    color: "rgb(130, 170, 255)",
  },
  function: {
    color: "rgb(130, 170, 255)",
  },
  builtin: {
    color: "rgb(130, 170, 255)",
  },
  char: {
    color: "rgb(130, 170, 255)",
  },
  selector: {
    color: "rgb(199, 146, 234)",
    fontStyle: "italic",
  },
  doctype: {
    color: "rgb(199, 146, 234)",
    fontStyle: "italic",
  },
  "attr-name": {
    color: "rgb(173, 219, 103)",
    fontStyle: "italic",
  },
  inserted: {
    color: "rgb(173, 219, 103)",
    fontStyle: "italic",
  },
  string: {
    color: "rgb(173, 219, 103)",
  },
  url: {
    color: "rgb(173, 219, 103)",
  },
  entity: {
    color: "rgb(173, 219, 103)",
  },
  ".language-css .token.string": {
    color: "rgb(173, 219, 103)",
  },
  ".style .token.string": {
    color: "rgb(173, 219, 103)",
  },
  "class-name": {
    color: "rgb(255, 203, 139)",
  },
  atrule: {
    color: "rgb(255, 203, 139)",
  },
  "attr-value": {
    color: "rgb(255, 203, 139)",
  },
  regex: {
    color: "rgb(214, 222, 235)",
  },
  important: {
    color: "rgb(214, 222, 235)",
    fontWeight: "bold",
  },
  variable: {
    color: "rgb(214, 222, 235)",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
};

export const welcomeMessage: ChatMessage = {
  id: 0,
  message: "Hi, how can I help you today?",
  sender: "bot",
  date: new Date(),
};
