"use strict";

export function isNullOrEmpty(value)
{
    return !value || value.trim().length === 0;
}