"use client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const useMounted = () => useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
export default useMounted;
