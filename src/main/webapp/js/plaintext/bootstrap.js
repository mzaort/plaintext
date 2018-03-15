function startup() {
  window.app = new plaintext.Page();
  window.app.initializeExternal();
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  startup();
} else {
  document.addEventListener('DOMContentLoaded', startup);
}
