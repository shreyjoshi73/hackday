document.getElementById("userForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  chrome.storage.sync.set({ userData: data }, () => alert("✅ Details saved!"));
});
