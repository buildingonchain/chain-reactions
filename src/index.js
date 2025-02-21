const { demos, DemosWebAuth, prepareXMScript, prepareXMPayload } = require("@kynesyslabs/demosdk/websdk");
const { EVM } = require("@kynesyslabs/demosdk/xm-websdk");

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Export what we need
    window.demos = demos;
    window.DemosWebAuth = DemosWebAuth;
    window.prepareXMScript = prepareXMScript;
    window.prepareXMPayload = prepareXMPayload;
    window.EVM = EVM;

    // Initialize demos instance
    window.demosInstance = demos.getInstance();
}); 