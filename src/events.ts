import Cache from "./Cache";

declare type CacheEvent = "loaded" | "change" | "save";

export function on(this: Cache, event: CacheEvent, callback: (data: any) => void)
{
    this.events[event] = callback;
}

export function trigger(this: Cache, event: CacheEvent, data?: any)
{
    if (this.events[event]) {
        this.events[event](data);
    }
}