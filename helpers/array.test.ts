import { Arr } from "./array";

describe("sum", function () {
	it("sums argument array", () => expect(Arr.sum([1, 2, 3, 4])).toBe(10));
	it("returns 0 on empty array", () => expect(Arr.sum([])).toBe(0));
});
