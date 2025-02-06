"use client"

import { LineaProvider } from "@/context/LineaContext";
import Monitoreo from "./monitoreo";

export default function MonitoreoPage() {
    return (
        <LineaProvider>
            <Monitoreo />
        </LineaProvider>
    );
}