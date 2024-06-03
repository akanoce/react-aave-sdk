import { useSupply } from "./useSupply";
import { renderHook, waitFor, } from "@/test";
import { renderHook as defaultRenderHook, waitFor as defaultWaitFor } from "@testing-library/react";
import { AllTheProvidersAaveNotActive } from "../../../test/rtl.providers";
import * as aaveContractsProvider from "../../providers/AaveContractsProvider"
import {
    Pool,
} from "@aave/contract-helpers";

const testAddress = "0x5AB3CC5811AE2080FE4A17335a48d361413c2112"

/**
 * This line mocks the module so the actual class method doesn't get called
 */
vi.mock("@aave/contract-helpers", async importActual => {
    return {
        /**
         * Require the actual module
         *
         * (optional, only if you want to keep the original methods too)
         */
        ...(await importActual<typeof import("@aave/contract-helpers")>()),
        Pool: vi.fn().mockImplementation(() => {
            return {
                supply: vi.fn().mockReturnValue(new Promise(() => []))
            }
        })
    }
})

describe("useSupply", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })
    it("not rendered under AaveContractProvider - throws an error", async () => {

        try {
            defaultRenderHook(() => useSupply({ signer: null as any }));


        }
        catch (error) {
            expect(error).toEqual(new Error("AaveContractsContext has to be used within <AaveContractsContext.Provider>"))
        }

    })//no signer - throws an error

    it("no pool contract/provider - set error in mutation", async () => {

        const { result } = defaultRenderHook(() => useSupply({ signer: null as any }),
            { wrapper: AllTheProvidersAaveNotActive });

        result.current.mutate(
            {
                reserve: "0xReserveAddress",
                amount: "2.5"
            }
        )

        await waitFor(() => {
            expect(result.current.error).toEqual(new Error("Pool contract not found"))
        })


    })//no signer - set error in mutation

    it("no signer account - set error in mutation", async () => {

        const signer = {
            account: null
        }
        const { result } = renderHook(() => useSupply({ signer: signer as any })
        );

        result.current.mutate(
            {
                reserve: "0xReserveAddress",
                amount: "2.5"
            }
        )

        await waitFor(() => {
            expect(result.current.error).toEqual(new Error("Signer account not found"))
        })
    })//no signer - set error in mutation

    it("no txs returned - throw an error", async () => {

        // vi.mock("../../providers/AaveContractsProvider", async (importOriginal) => {
        //     return {
        //       ...await importOriginal<typeof import("../../providers/AaveContractsProvider")>(),
        //       useAaveContracts: vi.fn().mockReturnValue({
        //             poolContract: {
        //             supply: vi.fn().mockReturnValue(new Promise(() => []))
        //             } as any
        //         })
        //     }
        //   })
        // @ts-ignore
        // vi.spyOn(aaveContractsProvider, "useAaveContracts").mockReturnValue({
        //     poolContract: {
        //         supply: vi.fn().mockReturnValue(new Promise(() => []))
        //     } as any
        // })

        const classInstance = new Pool()
 
        /**
         * This gives you access to the mock function created in the module
         * mock above
         */
        const methodMock = vi.mocked(classInstance.supply)
        // const poolSpy = vi.spyOn(Pool.prototype, "supply")

        const signer = {
            account: testAddress,
        }
        const { result } = renderHook(() => useSupply({ signer: signer as any })
        );

        result.current.mutate(
            {
                reserve: testAddress,
                amount: "2.5"
            }
        )

        await waitFor(() => {
            expect(methodMock).toHaveBeenCalled()
            expect(result.current.error).toEqual(new Error("Supply transactions not found"))
        }, { timeout: 4000 })
    })//no signer - set error in mutation


})