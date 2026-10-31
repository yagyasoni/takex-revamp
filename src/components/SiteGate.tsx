"use client";

import { useLayoutEffect } from "react";
import Landing from "./Landing";
import { isRealPhone } from "./PhoneView";

/** The bare page is only for the phone frame and real phones; a desktop tab goes back to the frame. */
export default function SiteGate() {
  useLayoutEffect(() => {
    if (window.self === window.top && !isRealPhone()) window.location.replace("/");
  }, []);
  return <Landing />;
}
