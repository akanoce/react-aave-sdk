import { AllTheProvidersAaveNotActive } from "../../../test/rtl.providers";
import { useUserReserves } from "./useUserReserves";
import { renderHook, waitFor,  mockReservesRpcResponse, mockUserReservesHookCall } from "@/test";
import { renderHook as defaultRenderHook, waitFor as defaultWaitFor } from "@testing-library/react";


const testAddress = "0x5AB3CC5811AE2080FE4A17335a48d361413c2112"

describe("useUserReserves", () => {
    beforeEach(() => {
        vi.resetAllMocks()
        vi.clearAllMocks()
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
//   it("no user - should return null with the correct rq state", async () => {
//     const { result } = renderHook(() => useUserReserves(), );
//     await waitFor(() => {
//       expect(result.current).toEqual({
//         data: null,
//         dataUpdatedAt: 0,
//         error: null,
//         errorUpdateCount: 0,
//         errorUpdatedAt: 0,
//         failureCount: 0,
//         failureReason: null,
//         fetchStatus: "fetching",
//         isError: false,
//         isFetched: false,
//         isFetchedAfterMount: false,
//         isFetching: true,
//         isInitialLoading: true,
//         isLoading: true,
//         isLoadingError: false,
//         isPaused: false,
//         isPending: true,
//         isPlaceholderData: false,
//         isRefetchError: false,
//         isRefetching: false,
//         isStale: true,
//         isSuccess: false,
//         refetch: expect.any(Function),
//         status: "pending",
//       });
//     });
//   })//no data - should return undefined with the correct rq state
  it("not wrapped in provider - should throw an error", async () => {

    try {
        defaultRenderHook(() => useUserReserves());
      }
      catch (error){
        expect(error).toEqual(new Error("AaveContractsContext has to be used within <AaveContractsContext.Provider>"))
      }

  })//not wrapped in provider - should throw an error
//   it("provider not set - query should not be enabled", async () => {
//     //TODO: not working for some reason. Query is not enabled but from the test it is. Not sure why
//     const { result } = defaultRenderHook(() => useReserves(), {
//         wrapper: AllTheProvidersAaveNotActive,
//     } );

//     await defaultWaitFor(() => {
//       expect(result.current).toEqual({
//         data: undefined,
//         dataUpdatedAt: 0,
//         error: null,
//         errorUpdateCount: 0,
//         errorUpdatedAt: 0,
//         failureCount: 0,
//         failureReason: null,
//         fetchStatus: "fetching",
//         isError: false,
//         isFetched: false,
//         isFetchedAfterMount: false,
//         isFetching: true,
//         isInitialLoading: true,
//         isLoading: true,
//         isLoadingError: false,
//         isPaused: true,
//         isPending: true,
//         isPlaceholderData: false,
//         isRefetchError: false,
//         isRefetching: false,
//         isStale: false,
//         isSuccess: false,
//         refetch: expect.any(Function),
//         status: "pending",
//       }, );
//     }, {timeout: 4000});
//   })// provider not set - query should not be enabled
  it("wait for data - should return reserves with the correct keys and types", async () => {
    //not working - not needed anyway as we use real data from nodes 
    // const expectation = nock('https://rpc.sepolia.org').post("/").reply(200, mockReservesRpcResult )
    const { result } = renderHook(() => useUserReserves(testAddress));
    
    //check that value is defined and each reserve is defined and has the expected properties
    await waitFor(() => {
        expect(result.current.data).toBeTruthy()
        expect(result.current.data?.formattedReserves).toEqual(mockUserReservesHookCall.formatted.expectedGeneralData)
        result.current.data?.formattedReserves.userReservesData.map((reserve) => {
            expect(reserve).toEqual(expect.objectContaining(mockUserReservesHookCall.formatted.expectedUserReserveData))
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
      }, {timeout: 8000});


})//wait for data - should return reserves with the correct keys and types
}, {timeout: 10000})

