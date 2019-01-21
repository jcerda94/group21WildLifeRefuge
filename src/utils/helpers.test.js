const { getValue } = require("./helpers");

describe("getValue tests", () => {
  let user = null;
  beforeEach(() => {
    user = {
      name: {
        first: "James",
        last: "McJames",
        middle: {
          name: "Jim",
          initial: "J."
        }
      },
      address: {},
      permanentAddress: null,
      age: 24
    };
  });

  it("should access nested property", () => {
    const firstName = getValue("name.first", user);
    expect(firstName).toEqual(user.name.first);
  });

  it("should throw an error when passed a null object", () => {
    expect(() => getValue("name.first", null)).toThrow(Error);
  });

  it("should throw an error when passed a null accessor", () => {
    expect(() => getValue(null, user)).toThrow(Error);
  });

  it("should return undefined on keys that don't exist", () => {
    const value = getValue("address.street", user);
    expect(value).toBeUndefined();
  });

  it("should return null on null key values", () => {
    const value = getValue("permanentAddress", user);
    expect(value).toBeNull();
  });

  it("should return a value from one key", () => {
    const value = getValue("age", user);
    expect(value).toEqual(user.age);
  });

  it("should return values when nested more than 2 depths", () => {
    const value = getValue("name.middle.initial", user);
    expect(value).toEqual(user.name.middle.initial);
  });
});
