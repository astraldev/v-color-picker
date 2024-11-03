import { has } from "lodash-es";

export const toUppercaseList = (texts: string[]) => {
  return texts.map(txt => txt.toUpperCase());
};

export const toLowerCaseList = (texts: string[]) => {
  return texts.map(txt => txt.toLowerCase());
};

export const clamp = (value: number, min = 0, max = 100) => {
  if (value < min) return min;
  else if (value > max) return max;
  return value;
};

export const isValidHex = (text: string, length: number) => {
  const validSet = new Set("1234567890abcdef#");
  return new Array(...(text.toLowerCase())).every(t => validSet.has(t)) && text.replace("#", "").length === length;
};

export const isRGBValue = <T extends object>(obj: T) => has(obj, ["r", "g", "b"]);
export const isHSLValue = <T extends object>(obj: T) => has(obj, ["h", "s", "l"]);
export const isHSVValue = <T extends object>(obj: T) => has(obj, ["h", "s", "v"]);
export const toPxValue = (size: string | number) => typeof size === "string" ? size : `${size}px`;
export const isValidSwatch = <T extends object>(obj: T) => has(obj, ["saturation", "lightness"]);
export const isValidSwatchLite = <T extends object>(obj: T) => has(obj, ["s", "l"]);
export const valueInRangeOf1 = (value: string | number) => {
  if (typeof value === "string") {
    if (value.includes("%") && !value.includes(".")) {
      return clamp(parseInt(value.replace("%", "")) / 100, 0, 1);
    } else if (value.includes(".")) {
      return clamp(parseFloat(value), 0, 1);
    } else {
      return clamp(parseInt(value), 0, 1);
    }
  } else {
    return value < 0 ? Math.abs(value) : clamp(value / 100, 0, 1);
  }
};
