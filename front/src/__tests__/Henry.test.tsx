import { expect, test } from "@rstest/core";
import { hiProf } from "../components/Henry";

test("should hiProf correctly", () => {
    expect(hiProf()).toBe("Henry Quartermain!");
});



