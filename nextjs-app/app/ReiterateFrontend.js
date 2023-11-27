"use client";

import { useEffect } from "react";

const serializeEvent = (event) => {
    // Basic Event properties
    const serializedEvent = {
        type: event.type,
        timeStamp: event.timeStamp,
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        defaultPrevented: event.defaultPrevented,
        composed: event.composed,
        isTrusted: event.isTrusted,
    };

    // PointerEvent properties
    serializedEvent.pointerId = event.pointerId;
    serializedEvent.width = event.width;
    serializedEvent.height = event.height;
    serializedEvent.pressure = event.pressure;
    serializedEvent.tangentialPressure = event.tangentialPressure;
    serializedEvent.tiltX = event.tiltX;
    serializedEvent.tiltY = event.tiltY;
    serializedEvent.twist = event.twist;
    serializedEvent.pointerType = event.pointerType;
    serializedEvent.isPrimary = event.isPrimary;

    // MouseEvent properties
    serializedEvent.screenX = event.screenX;
    serializedEvent.screenY = event.screenY;
    serializedEvent.clientX = event.clientX;
    serializedEvent.clientY = event.clientY;
    serializedEvent.ctrlKey = event.ctrlKey;
    serializedEvent.shiftKey = event.shiftKey;
    serializedEvent.altKey = event.altKey;
    serializedEvent.metaKey = event.metaKey;
    serializedEvent.button = event.button;
    serializedEvent.buttons = event.buttons;
    serializedEvent.relatedTarget = event.relatedTarget;

    // Target element properties
    serializedEvent.selector = "";
    if (event.target) {
        serializedEvent.target = {
            tagName: event.target.tagName,
            id: event.target.id,
            className: event.target.className,
            name: event.target.name,
            type: event.target.type,
            value: event.target.value,
            // Add more element properties as needed
        };
        serializedEvent.target["aria-role"] = event.target.getAttribute("aria-role");
        // we also want to include the text representation of the target element's inner text regardless of how many layers of children it has
        serializedEvent.target["innerText"] = event.target.innerText;
    }

    return serializedEvent;
};

const handleEvent = async (event) => {
    const serializedEvent = serializeEvent(event);

    try {
        const response = await fetch("http://localhost:3001/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(serializedEvent),
        });

        if (!response?.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const respData = await response.json();
    } catch (error) {
        console.error("Error sending event data:", error);
    }
};

export default function ReiterateFrontend() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        const addListeners = () => {
            document.addEventListener("click", handleEvent);
            document.addEventListener("input", handleEvent);
            document.addEventListener("keydown", handleEvent);
        };

        const removeListeners = () => {
            document.removeEventListener("click", handleEvent);
            document.removeEventListener("input", handleEvent);
            document.removeEventListener("keydown", handleEvent);
        };

        addListeners();
        return removeListeners;
    }, []); // Removed window from the dependency array

    return null;
}
