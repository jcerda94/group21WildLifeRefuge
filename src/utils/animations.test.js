const { animate } = require("./animations");
describe("animation tests", () => {
  it("should calculate no distance travelled if elapsed time matches start time", () => {
    const animation = animate({
      model: { position: { x: 0, y: 0, z: 0 } },
      to: { dx: 100, dy: 100, dz: 100 },
      options: {
        duration: 2000,
        start: 1100,
        elapsed: 1100
      }
    });
    expect(animation.currentPosition).toEqual({ x: 0, y: 0, z: 0 });
  });

  it("should be 50% done when elapsed is halfway through duration", () => {
    const animation = animate({
      model: { position: { x: 0, y: 0, z: 0 } },
      to: { dx: 100, dy: 100, dz: 100 },
      options: {
        duration: 2000,
        start: 1100,
        elapsed: 2100
      }
    });
    expect(animation.currentPosition).toEqual({ x: 50, y: 50, z: 50 });
  });
});
