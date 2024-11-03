/* eslint-disable @typescript-eslint/no-unused-expressions */
import tinycolor from "tinycolor2";
import { isEqual } from "lodash-es";

export type ColorFormat = 
  | string
  | tinycolor.ColorFormats.HSL
  | tinycolor.ColorFormats.HSLA
  | tinycolor.ColorFormats.HSV
  | tinycolor.ColorFormats.HSVA
  | tinycolor.ColorFormats.RGB
  | tinycolor.ColorFormats.RGBA

export type ColorStringFormats = "rgb" | "prgb" | "hex" | "hex6" | "hex3" | "hex4" | "hex8" | "name" | "hsl" | "hsv";

const createColorProps = (color: Ref<tinycolor.Instance>) => {
  const rgba = ref(color.value.toRgb());
  const hsla = ref(color.value.toHsl());
  const hex = ref(color.value.toHex());
  const hex8 = ref(color.value.toHex8());

  const h = computed({
    get: () => hsla.value.h,
    set: (h) => hsla.value.h = h,
  });

  const s = computed({
    get: () => hsla.value.s,
    set: (s) => hsla.value.s = s,
  });
  
  const l = computed({
    get: () => hsla.value.l,
    set: (l) => hsla.value.l = l,
  });;

  const red = computed({
    get: () => rgba.value.r,
    set: (r) => rgba.value.r = r,
  });

  const green = computed({
    get: () => rgba.value.g,
    set: (g) => rgba.value.g = g,
  });

  const blue = computed({
    get: () => rgba.value.b,
    set: (b) => rgba.value.b = b,
  });
  
  const alpha = computed({
    get: () => hsla.value.a,
    set: (a) => hsla.value.a = a,
  });;

  const hueGradient = computed(() => {
    return {
      horizontal: "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
      vertical: "linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
    };
  });

  const alphaGradient = computed(() => {
    const rgbStr = [red.value, green.value, blue.value].join(',');
    return 'linear-gradient(to right, rgba(' + rgbStr + ', 0) 0%, rgba(' + rgbStr + ', 1) 100%)'
  });

  const setColors = (color: ColorFormat) => {
    const _tcolor = tinycolor(color);
    !isEqual(hex.value, _tcolor.toHex()) && (hex.value = _tcolor.toHex());
    !isEqual(hex8.value, _tcolor.toHex8()) && (hex8.value = _tcolor.toHex8());
    !isEqual(hsla.value, _tcolor.toHsl()) && (hsla.value = _tcolor.toHsl());
    !isEqual(rgba.value, _tcolor.toRgb()) && (rgba.value = _tcolor.toRgb());
  };

  watch(
    color,
    (newColor) => {
      if (!newColor) return;
      setColors(newColor.toHsl());
    },
    { deep: true },
  );

  watch(
    rgba,
    (rgb) => setColors(rgb),
    { deep: true }
  );

  watch(
    hsla,
    (hsl) => setColors(hsl),
    { deep: true }
  );

  watch(hex, (hex) => setColors(hex));
  watch(hex8, (hex8) => setColors(hex8));

  return {
    h, s, l, hex, hex8,
    hue: h, saturation: s, lightness: l,
    red, green, blue, 
    alpha, rgba, hsla,
    alphaGradient,
    hueGradient,
  };
};

export const convertColorTo = (color: ColorFormat, type: ColorStringFormats) => {
  return tinycolor(color).toString(type);
};

export const useColor = <T extends MaybeRef<ColorFormat>>(
  target: T,
  update?: (newColor: T) => void,
  format?: MaybeRef<ColorStringFormats>,
) => {
  const color = computed(() => tinycolor(unref(target)));
  const colorProps = createColorProps(color);
  const initialColor = unref(target);

  const colorComplement = computed(() => {
    return color.value.complement();
  });

  const updatedColor = computed(() => {
    const fmt = unref(format);
    const _color = tinycolor(colorProps.hsla.value);
   
    if (typeof initialColor === "string") {
      if (initialColor.startsWith("rgb")) return _color.toRgbString();
      else if (initialColor.startsWith("hsv")) return _color.toHsvString();
      else if (initialColor.startsWith("hsl")) return _color.toHslString();
      else if (initialColor.startsWith("#")) {
        const withoutHash = initialColor.replace("#", "");
        if (withoutHash.length === 3) return _color.toString("hex3");
        if (withoutHash.length === 4) return _color.toString("hex4");
        if (withoutHash.length === 8) return _color.toString("hex8");
        if (withoutHash.length === 6) return _color.toString("hex6");
        return _color.toString("hex");
      } else {
        return colorProps.hsla.value.a > 0 
          ? _color.toString("hex8") 
          : _color.toString("name");
      }
    } 
    else if (isRGBValue(initialColor)) return _color.toRgb();
    else if (isHSLValue(initialColor)) return _color.toHsl();
    else if (isHSVValue(initialColor)) return _color.toHsv();
    return fmt ? _color.toString(fmt) : _color.toString();
  });

  const getColorAs = (type: ColorStringFormats) => {
    return color.value.toString(type);
  };

  const isSameColor = (color: ColorFormat) => {
    return isEqual(getColorAs("hsl"), tinycolor(color).toHslString());
  };

  watch(
    updatedColor,
    (color) => update && update(color as T),
    { deep: true, immediate: true },
  );

  return {
    instance: color,
    colorComplement,
    getColorAs,
    isSameColor,
    ...colorProps,
  };
};