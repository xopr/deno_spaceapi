/**
 * Map a value within a range onto a new range
 * @param value The value we want to map
 * @param in_min The minimum value range
 * @param in_max The maximum value range
 * @param out_min The new range's minimum
 * @param out_max The new range's maximum
 * @returns a value within the new (out) range relative to the input value on the old (in) range
 */
export const range = (value: number, in_min: number, in_max: number, out_min: number, out_max: number): number => (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;

/**
 * 
 * @param hue [0-100] the requested hue
 * @param saturation [0-100] saturation
 * @param lightness [0-100] lightness
 * @returns 
 */
export function hslToRgb( hue: number, saturation: number, lightness: number ): [number, number, number]
 {
     lightness /= 100;
     const a = saturation * Math.min(lightness, 1 - lightness) / 100;
     const f = (n: number): number => {
       const k = (n + hue / 30) % 12;
       const color = lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
       return Math.round(255 * color);
     };
     return [ f(0), f(8), f(4) ];
 }
 