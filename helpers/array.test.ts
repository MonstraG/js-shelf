import { Arr } from "./array";

describe("sum", () => {
	it("sums argument array", () => expect(Arr.sum([1, 2, 3, 4])).toBe(10));
	it("returns 0 on empty array", () => expect(Arr.sum([])).toBe(0));
});

describe("max", () => {
	it("finds maximum element in array", () => expect(Arr.max([1, 2, 3, 4])).toBe(4));
	it("returns minus infinity on empty array", () => expect(Arr.max([])).toBe(-Infinity));
});

describe("min", () => {
	it("finds minimum element in array", () => expect(Arr.min([1, 2, 3, 4])).toBe(1));
	it("returns infinity on empty array", () => expect(Arr.min([])).toBe(Infinity));
});

describe("avg", () => {
	it("finds average value in the array", () => expect(Arr.avg([1, 2, 3, 4])).toBe(2.5));
	it("doesn't divide by zero on empty array", () => expect(Arr.avg([])).toBe(0));
});

describe("newArr", () => {
	it("creates an array of provided length", () => expect(Arr.newArr(4).length).toBe(4));
	//https://stackoverflow.com/a/5501711/11593686
	it("resulting array can be mapped properly", () => {
		expect(Arr.newArr(4).map((_, i) => i)).toStrictEqual([0, 1, 2, 3]);
	});
});

const uniqueTest = (uniqueFunction: <T>(array: T[]) => T[]) => {
	it("returns only unique elements", () => {
		expect(uniqueFunction([0, 1, 1, 2, 3, 4, 4])).toStrictEqual([0, 1, 2, 3, 4]);
	});
};

describe("unique", () => {
	uniqueTest(Arr.unique);
});

describe("uniqueES5", () => {
	uniqueTest(Arr.uniqueES5);
});

describe("first", () => {
	it("returns first element of the array", () => expect(Arr.first([0, 1, 2, 3])).toBe(0));
	it("returns null on empty array", () => expect(Arr.first([])).toBe(null));
});
