import { useEffect, useState } from "react";

export function Fade(props: { children(): React.ReactChild; show: boolean }) {
  const { show, children } = props;

  return <>{show ? children() : null}</>;
}
