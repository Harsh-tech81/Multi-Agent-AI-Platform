import proxy from "express-http-proxy";

export const proxyWithHeader = (serviceUrl) => {
  return proxy(serviceUrl, {
    parseReqBody: false,
    timeout: 120000, // 2 minutes for LLM responses
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      }
      return proxyReqOpts;
    },
  });
};
