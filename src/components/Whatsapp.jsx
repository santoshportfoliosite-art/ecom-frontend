// src/components/Whatsapp.jsx
import { useEffect, useState } from "react";

/**
 * Whatsapp floating button
 * - Fetches site config from `${VITE_BACKEND_URL}/api/site`
 * - Reads whatsapp number from common fields and builds wa.me link
 * - Shows a floating icon at right-middle of the viewport
 *
 * Usage: put <Whatsapp /> near root of your app (e.g. in App.jsx or Layout)
 */

export default function Whatsapp() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [phone, setPhone] = useState(null); // raw value from API
  const [waLink, setWaLink] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchSite = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/site`);
        if (!res.ok) {
          console.warn("Whatsapp: failed to fetch site", res.status);
          return;
        }
        const data = await res.json();
        // defensively read common fields (adjust to your API shape)
        const site = data?.site ?? data;
        const candidates = [
          site?.whatsapp,
          site?.whatsappNumber,
          site?.phone,
          site?.contact?.whatsapp,
          site?.contact?.phone,
        ];
        const found = candidates.find((c) => typeof c === "string" && c.trim().length > 0);
        if (!mounted) return;
        if (found) {
          setPhone(found);
        } else {
          console.warn("Whatsapp: no phone found in site data");
        }
      } catch (err) {
        console.error("Whatsapp: fetch error", err);
      }
    };

    fetchSite();

    return () => {
      mounted = false;
    };
  }, [backendUrl]);

  // when phone updates, build wa.me link
  useEffect(() => {
    if (!phone) {
      setVisible(false);
      setWaLink("");
      return;
    }

    // normalize phone for wa.me: remove non-digit characters and leading plus
    // wa.me requires country code and no symbols: e.g. 9779812345678
    const digits = String(phone).replace(/[^\d+]/g, "");
    // If starts with '+', remove plus for wa.me
    const normalized = digits.startsWith("+") ? digits.slice(1) : digits;
    // If normalized is empty, hide
    if (!normalized) {
      setVisible(false);
      setWaLink("");
      return;
    }

    // default message (you can change)
    const text = encodeURIComponent("Hi, I would like to inquire about an order/ product.");
    // build wa.me URL
    const url = `https://wa.me/${normalized}?text=${text}`;

    setWaLink(url);
    setVisible(true);
  }, [phone]);

  if (!visible) return null;

  return (
    <div>
      {/* container positioned right-middle */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat on WhatsApp"
        style={{
          position: "fixed",
          right: 18,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 9999,
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: "linear-gradient(180deg,#25D366,#128C7E)",
            boxShadow: "0 6px 18px rgba(18,140,126,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "transform .14s ease, box-shadow .14s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.boxShadow = "0 10px 26px rgba(18,140,126,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(18,140,126,0.2)";
          }}
        >
          {/* WhatsApp SVG icon (white) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M20.52 3.48A11.82 11.82 0 0012 0C5.373 0 .04 4.666.04 10.436c0 1.836.49 3.62 1.42 5.196L0 24l8.63-2.27A11.95 11.95 0 0012 21.6c6.627 0 11.96-4.666 11.96-10.436 0-1.95-.6-3.83-3.44-7.69z"
              fill="#ffffff"
              opacity="0.06"
            />
            <path
              d="M20.52 3.48A11.82 11.82 0 0012 0C5.373 0 .04 4.666.04 10.436c0 1.836.49 3.62 1.42 5.196L0 24l8.63-2.27A11.95 11.95 0 0012 21.6c6.627 0 11.96-4.666 11.96-10.436 0-1.95-.6-3.83-3.44-7.69z"
              fill="white"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="0.2"
              opacity="0.12"
            />
            <path
              d="M17.472 14.382c-.297-.148-1.756-.867-2.028-.967-.272-.099-.47-.148-.669.15-.198.297-.767.967-.942 1.165-.173.198-.347.223-.644.075-.297-.148-1.255-.462-2.39-1.476-.884-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.134.298-.347.447-.52.15-.173.199-.297.298-.495.099-.198.05-.371-.025-.52-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.371s-1.04 1.015-1.04 2.479 1.064 2.876 1.212 3.074c.148.198 2.095 3.2 5.076 4.487  .709.306 1.26.489 1.691.627.711.226 1.358.194 1.87.118.571-.085 1.756-.717 2.005-1.409.248-.694.248-1.288.173-1.409-.074-.12-.272-.198-.57-.347z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </a>
    </div>
  );
}
