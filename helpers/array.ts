// finds first element satisfying the predicate and returns [it, rest] or [default, initial] if not found
export const pop = <T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => boolean,
  def: T = null
) => {
  const copy = [...array];
  for (let i = 0; i < copy.length; i++) {
    if (predicate(copy[i], i, copy)) {
      return [copy.splice(i, 1)[0], copy] as const;
    }
  }
  return [def, copy] as const;
};

export const sum = (array: number[]): number => array.reduce((acc, next) => acc + next, 0);
export const max = (array: number[]): number => Math.max.apply(null, array);
export const min = (array: number[]): number => Math.min.apply(null, array);
export const avg = (array: number[]): number => sum(array) / array.length;

export const newArr = (length: number) => Array.from({ length });

export const unique = <T>(array: T[]): T[] =>
  array.filter((item: T, index: number) => array.indexOf(item) == index);

export const first = <T>(array: T[]): T | null =>
  array && array.length > 0 ? array[0] : null;

//splits array into 2 parts based on predicate, first corresponds to true, second to false
export const fork = <T>(
  array: T[],
  predicate: (element: T, index: number, array: T[]) => boolean
): T[][] =>
  array.reduce(
    ([truthful, falseful], element, ...props) => {
      (predicate(element, ...props) ? truthful : falseful).push(element);
      return [truthful, falseful];
    },
    [[], []]
  );

// https://stackoverflow.com/a/65184754
type ObjectKey = string | number | symbol;
export const groupBy = <K extends ObjectKey, TItem extends Record<K, ObjectKey>>(
  items: TItem[],
  key: K
): Record<ObjectKey, TItem[]> =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item]
    }),
    {} as Record<ObjectKey, TItem[]>
  );



// zip([1,2,3], [a,b]) => [[1, a], [2, b], [3, undefined]]
export const zip = <T1,T2>(array: T1[], array2: T2[]): [T1, T2][] => array.map((el, index) => [el, array2[index]])

// zipShort([1,2], [a,b,c]) => [[1, a], [2, b]]
export const zipShort = <T1,T2>(array: T1[], array2: T2[]): [T1, T2][] => {
  const minLength = Math.min(array.length, array2.length);
  return array.slice(0, minLength).map((el, index) => [el, array2[index]])
}

export const compareAsc = (a: number, b: number): number => a - b;
export const compareDesc = (a: number, b: number): number => b - a;

