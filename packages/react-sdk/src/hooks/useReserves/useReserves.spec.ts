import { useReserves } from "./useReserves";
import { renderHook } from "@/test";

describe("useReserves", () => {
  it("should return reserves", async () => {
    const { result } = renderHook(() => useReserves());
    // await waitFor(() => {
    //   expect(result.current).toEqual([]);
    // });
  });
});
