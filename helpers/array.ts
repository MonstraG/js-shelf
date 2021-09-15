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
