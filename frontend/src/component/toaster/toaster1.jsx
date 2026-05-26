import  { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

// format of toaster data expected from parent component
/*
[
  {
    id: "unique-string-or-number",
    status: "success",
    info: "Signed in successfully!",
    align: "top-right",
    duration: 5000,
    closable: true,
  },
];*/


// Reusable SVG Icons for different status types
const SuccessIcon = () => <CheckCircle className="w-5 h-5 text-emerald-400" />;

const ErrorIcon = () => <XCircle className="w-5 h-5 text-rose-400" />;

const WarningIcon = () => <AlertTriangle className="w-5 h-5 text-amber-400" />;

const MessageIcon = () => <Info className="w-5 h-5 text-blue-400" />;

// Configuration for styling based on status
const statusConfig = {
  success: {
    icon: SuccessIcon,
    borderColor: "border-emerald-500/50",
    bgColor: "bg-emerald-500/10",
  },
  error: {
    icon: ErrorIcon,
    borderColor: "border-rose-500/50",
    bgColor: "bg-rose-500/10",
  },
  warning: {
    icon: WarningIcon,
    borderColor: "border-amber-500/50",
    bgColor: "bg-amber-500/10",
  },
  message: {
    icon: MessageIcon,
    borderColor: "border-blue-400/50",
    bgColor: "bg-blue-400/10",
  },
};

// Configuration for placement classes
const placementClasses = {
  top: "top-4 left-1/2 -translate-x-1/2 flex-col",
  bottom: "bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse",
  left: "top-1/2 left-4 -translate-y-1/2 flex-col",
  right: "top-1/2 right-4 -translate-y-1/2 flex-col",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col",
  "top-right": "top-4 right-4 flex-col",
  "top-left": "top-4 left-4 flex-col",
  "bottom-right": "bottom-4 right-4 flex-col-reverse",
  "bottom-left": "bottom-4 left-4 flex-col-reverse",
};

// Individual Toast Item Component
const ToastItem = ({ toast, onClose }) => {
  const [isShowing, setIsShowing] = useState(false);

  const status = toast.status?.toLowerCase() || "message";
  const config = statusConfig[status] || statusConfig.message;
  const Icon = config.icon;

  const handleClose = () => {
    setIsShowing(false);
    // Wait for exit animation to complete before actually removing
    setTimeout(() => onClose(toast.id), 300);
  };

  useEffect(() => {
    // Trigger entrance animation slightly after mount
    requestAnimationFrame(() => {
      setIsShowing(true);
    });

    // Auto-dismiss after specified duration or default to 5 seconds
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, []);


  return (
    <div
      className={`
        pointer-events-auto flex items-start p-4 mb-3 w-80 max-w-full rounded-xl shadow-2xl
        backdrop-blur-md bg-[#0a1128]/70 border border-slate-700/50
        transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
        ${isShowing ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}
        ${config.borderColor}
      `}
      role="alert"
    >
      <div className={`flex-shrink-0 p-1.5 rounded-full ${config.bgColor}`}>
        <Icon />
      </div>
      <div className="ml-3 w-0 flex-1 pt-0.5">
        <p className="text-sm font-medium text-slate-100 tracking-wide">
          {toast.info}
        </p>
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          className="bg-transparent rounded-md inline-flex text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          onClick={handleClose}
        >
          <span className="sr-only">Close</span>
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

// Main Toaster Container Component
const Toaster1 = ({ data = [] }) => {
  const [toasts, setToasts] = useState([]);
  const seenObjects = useRef(new WeakSet()); // Track objects we've already processed
  const idCounter = useRef(0);

  // Process incoming data props and assign unique IDs
  useEffect(() => {
    if (data && data.length > 0) {
      const newToasts = [];

      data.forEach((item) => {
        // Track object references so we don't re-add a toast that was already processed
        // and subsequently removed from the internal state by the duration timeout.
        if (!seenObjects.current.has(item)) {
          seenObjects.current.add(item);

          // Give unique id to every toaster data if parent didn't provide one
          const finalId =
            item.id || `toast_internal_${Date.now()}_${idCounter.current++}`;

          newToasts.push({ ...item, id: finalId });
        }
      });

      // Append new toasts using its own internal state
      if (newToasts.length > 0) {
        setToasts((prev) => [...prev, ...newToasts]);
      }
    }
  }, [data]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Group toasts by alignment to render them in different positions
  const groupedToasts = useMemo(() => {
    const groups = {};
    toasts.forEach((toast) => {
      const align = toast.align || "bottom-right";
      if (!groups[align]) groups[align] = [];
      groups[align].push(toast);
    });
    return groups;
  }, [toasts]);

  // Use a portal if running in a browser environment to avoid z-index/overflow issues
  const isBrowser = typeof window !== "undefined";

  const toasterContent = (
    <>
      {Object.entries(groupedToasts).map(([align, alignToasts]) => (
        <div
          key={`group-${align}`}
          className={`fixed z-[9999] pointer-events-none flex ${placementClasses[align] || placementClasses["bottom-right"]}`}
        >
          {alignToasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        
        </div>
      ))}
    </>
  );

  if (!isBrowser) return null;

  // Try to find a portal root, otherwise append to body
  let portalRoot = document.getElementById("toaster-root");
  if (!portalRoot) {
    portalRoot = document.createElement("div");
    portalRoot.id = "toaster-root";
    document.body.appendChild(portalRoot);
  }

  return createPortal(toasterContent, portalRoot);
};
 export default Toaster1;