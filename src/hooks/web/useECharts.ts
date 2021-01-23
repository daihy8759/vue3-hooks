import type { ECharts, EChartsOption } from 'echarts';
import echarts from 'echarts';
import { nextTick, Ref, unref } from 'vue';
import { tryOnUnmounted } from '../../utils/vue';
import { useDebounce } from '../core/useDebounce';
import { useTimeoutFn } from '../core/useTimeout';
import { useBreakpoint } from '../event/useBreakpoint';
import { useEventListener } from '../event/useEventListener';

export type { EChartsOption, ECharts };
export function useECharts(
    elRef: Ref<HTMLDivElement>,
    theme: 'light' | 'dark' | 'default' = 'light'
) {
    let chartInstance: Nullable<ECharts> = null;
    let resizeFn: Fn = resize;
    let removeResizeFn: Fn = () => {};

    const [debounceResize] = useDebounce(resize, 200);
    resizeFn = debounceResize;

    function init() {
        const el = unref(elRef);
        if (!el || !unref(el)) {
            return;
        }

        chartInstance = echarts.init(el, theme);
        const { removeEvent } = useEventListener({
            el: window,
            name: 'resize',
            listener: resizeFn,
        });
        removeResizeFn = removeEvent;
        const { widthRef, screenEnum } = useBreakpoint();
        if (unref(widthRef) <= screenEnum.MD || el.offsetHeight === 0) {
            useTimeoutFn(() => {
                resizeFn();
            }, 30);
        }
    }

    function setOptions(options: any, clear = true) {
        if (unref(elRef)?.offsetHeight === 0) {
            useTimeoutFn(() => {
                setOptions(options);
            }, 30);
            return;
        }
        nextTick(() => {
            useTimeoutFn(() => {
                if (!chartInstance) {
                    init();

                    if (!chartInstance) return;
                }
                clear && chartInstance?.clear();

                chartInstance?.setOption(options);
            }, 30);
        });
    }

    function resize() {
        chartInstance?.resize();
    }

    tryOnUnmounted(() => {
        if (!chartInstance) return;
        removeResizeFn();
        chartInstance.dispose();
        chartInstance = null;
    });

    return {
        setOptions,
        echarts,
        resize,
    };
}
