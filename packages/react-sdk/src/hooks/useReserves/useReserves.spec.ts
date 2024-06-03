import { useReserves } from "./useReserves";
import { renderHook, waitFor,  mockReservesRpcResponse } from "@/test";





describe("useReserves", () => {
  it("no data - should return undefined with the correct rq state", async () => {
    const { result } = renderHook(() => useReserves(), );
    await waitFor(() => {
      expect(result.current).toEqual({
        data: undefined,
        dataUpdatedAt: 0,
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        fetchStatus: "fetching",
        isError: false,
        isFetched: false,
        isFetchedAfterMount: false,
        isFetching: true,
        isInitialLoading: true,
        isLoading: true,
        isLoadingError: false,
        isPaused: false,
        isPending: true,
        isPlaceholderData: false,
        isRefetchError: false,
        isRefetching: false,
        isStale: true,
        isSuccess: false,
        refetch: expect.any(Function),
        status: "pending",
      });
    });
  });
  it("wait for data - should return reserves with the correct keys and types", async () => {
    //not working - not needed anyway as we use real data from nodes 
    // const expectation = nock('https://rpc.sepolia.org').post("/").reply(200, mockReservesRpcResult )
    const { result } = renderHook(() => useReserves());
    
    //check that value is defined and each reserve is defined and has the expected properties
    await waitFor(() => {
        expect(result.current.data).toBeTruthy()
        result.current.data?.formattedReserves?.forEach((reserve) => {
            expect(reserve).toEqual(expect.objectContaining(mockReservesRpcResponse.formattedReservesExpectResult))
        })
        
        expect(result.current).toEqual({
            data: expect.any(Object),
          "dataUpdatedAt": expect.any(Number),
          error: null,
          errorUpdateCount: 0,
          errorUpdatedAt: 0,
          failureCount: 0,
          failureReason: null,
          fetchStatus: "idle",
          isError: false,
            "isFetched": true,
             "isFetchedAfterMount": true,
             "isFetching": false,
             "isInitialLoading": false,
             "isLoading": false,
          isLoadingError: false,
          isPaused: false,
          "isPending": false,
          isPlaceholderData: false,
          isRefetchError: false,
          isRefetching: false,
          isStale: true,
          "isSuccess": true,
          refetch: expect.any(Function),
          "status": "success",
        });
      }, {timeout: 4000});


});
})

