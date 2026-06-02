// Clipboard copy helper
const copyToClipboard = (text) => {
  if (!text) return;
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Failed to copy", err);
  }
  document.body.removeChild(tempTextArea);
};
export default copyToClipboard