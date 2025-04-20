// theme/rtlCache.ts
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";

const rtlCache = createCache({
    key: "mui-rtl",
    stylisPlugins: [rtlPlugin],
});

export default rtlCache;
