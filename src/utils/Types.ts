export type Repeat<N extends number, T, R extends unknown[] = []> = R["length"] extends N
  ? R
  : Repeat<N, T, [...R, T]>;

export type CoordTuple = Repeat<3, number>;
