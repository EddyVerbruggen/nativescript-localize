import { LocalizePipe  } from "nativescript-localize/src//localize.pipe";

describe("LocalizePipe", () => {
  let pipe: LocalizePipe;

  beforeEach(() => {
    pipe = new LocalizePipe();
  });

  it("works with a simple string", () => {
    expect(pipe.transform("app.name")).toEqual("NSL NG Demo");
  });

  it("formats a string with given arguments", () => {
    expect(pipe.transform("sprintf", "test", "ok")).toEqual("format me test : ok");
  });
});
