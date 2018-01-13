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

  it("returns the given key when no translation is found", () => {
    expect(localize("unknown.key")).toEqual("unknown.key");
  });

  it("formats a string with given arguments", () => {
    expect(localize("sprintf", "test", "ok")).toEqual("format me test : ok");
  });

  it("formats a string with numbered placeholders with given arguments", () => {
    expect(localize("sprintf.numbered.placeholders", "1", "2")).toEqual("format $2: 2, $1: 1");
  });

  it("works with a percent sign", () => {
    expect(localize("test.percent")).toEqual("%");
  });

  it("works with an escaped percent sign", () => {
    expect(localize("test.escaped.percent")).toEqual("%");
  });

  it("works with an escaped percent sign followed by s", () => {
    expect(localize("test.escaped.percent.followed.by.s")).toEqual("%s");
  });

  it("works with an escaped percent sign followed by a placeholder", () => {
    expect(localize("test.escaped.percent.followed.by.placeholder", "test")).toEqual("%test");
  });
});
