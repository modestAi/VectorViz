export class Color {
  static coral = "rgb(255,127,80)";
  static salmon = "rgb(250,128,114)";
  static tomato = "rgb(255,99,71)";
  static apricot = "rgb(251,206,177)";
  static tangerine = "rgb(255,176,0)";
  static amber = "rgb(255,191,0)";
  static saffron = "rgb(244,196,48)";
  static sunflower = "rgb(255,218,41)";
  static honey = "rgb(255,201,71)";
  static chartreuse = "rgb(127,255,0)";
  static mint = "rgb(152,255,152)";
  static aquamarine = "rgb(127,255,212)";
  static turquoise = "rgb(64,224,208)";
  static skyBlue = "rgb(135,206,235)";
  static deepSkyBlue = "rgb(0,191,255)";
  static dodgerBlue = "rgb(30,144,255)";
  static steelBlue = "rgb(70,130,180)";
  static orchid = "rgb(218,112,214)";
  static fuchsia = "rgb(255,119,255)";
  static hotPink = "rgb(255,105,180)";
  static blush = "rgb(222,93,131)";
  static carnation = "rgb(255,166,201)";
  static amethyst = "rgb(153,102,204)";
  static lilac = "rgb(200,162,200)";
  static mauve = "rgb(224,176,255)";
  static heliotrope = "rgb(223,115,255)";
  static plum = "rgb(221,160,221)";
  static wisteria = "rgb(201,160,220)";
  static mulberry = "rgb(197,75,140)";
  static mayaBlue = "rgb(115,194,251)";
  static cornflower = "rgb(100,149,237)";
  static cerulean = "rgb(0,123,167)";
  static lagoon = "rgb(0,199,190)";

  static allColors(): string[] {
    return Object.values(Color).filter((v) => typeof v === "string") as string[];
  }

  static totalColors(): number {
    return Color.allColors().length;
  }
  static randomColor(): string {
    return Color.allColors()[randomInteger(0, Color.totalColors())];
  }
}

const randomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
