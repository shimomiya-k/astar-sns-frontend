import { useRouter } from "next/router";
import React, { useState } from "react";

import Footer from "./organisms/footer";

export default function BottomNavigation(props: any) {
  const router = useRouter();
  const [witchScreen, setWitchScreen] = useState(
    router.pathname.replace(/[/]/g, "")
  );

  return (
    <Footer selectedScreen={witchScreen} setSelectedScreen={setWitchScreen} />
  );
}
