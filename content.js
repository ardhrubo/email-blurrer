(() => {
  const ns = window.EmailHider;

  if (!ns || !ns.runtime) {
    return;
  }

  ns.runtime.init();
})();
