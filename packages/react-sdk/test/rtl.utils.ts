import { RenderHookOptions, renderHook } from "@testing-library/react";
import { AllTheProviders } from "./rtl.providers";

const customRenderHook = <Result, Props>(
  render: (props: Props) => Result,
  options?: RenderHookOptions<Props>
) =>
  renderHook(render, {
    wrapper: AllTheProviders,
    ...options,
  });

  export * from "@testing-library/react";
export { customRenderHook as renderHook };
