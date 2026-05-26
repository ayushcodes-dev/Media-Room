import { useState } from "react";
import { Copy, Check } from "lucide-react";

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();

    const copyToClipboard = (val) => {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(val);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = val;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          return Promise.resolve();
        } catch (err) {
          return Promise.reject(err);
        } finally {
          textArea.remove();
        }
      }
    };

    copyToClipboard(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold active:scale-90
        ${
          copied
            ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
            : "bg-sky-500/10 border-sky-500/20 text-sky-400 hover:bg-sky-500/20"
        }`}
    >
      {copied ? (
        <Check size={14} className="animate-in zoom-in" />
      ) : (
        <Copy size={14} />
      )}
      {copied ? "COPIED" : "COPY"}
    </button>
  );
};
export default CopyButton;