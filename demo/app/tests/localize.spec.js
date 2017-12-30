var localize = require("nativescript-localize");
var i18n = require("../i18n/en.default");

describe("localize", () => {
  it("works with a key defined as a single string", () => {
    expect(localize("app.name")).toEqual(i18n["app.name"]);
  });

  it("works with a key defined as nested objects", () => {
    expect(localize("new.line")).toEqual(i18n["new"]["line"]);
  });

  it("joins the elements of an array", () => {
    expect(localize("array")).toEqual(i18n["array"].join(""));
  });

  it("formats a string with given arguments", () => {
    expect(localize("sprintf", "test", "ok")).toEqual("format me test : ok");
  });

  it("returns the given key when no translation is found", () => {
    expect(localize("unknown.key")).toEqual("unknown.key");
  });
});
