import { Signal, assertInInjectionContext, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params } from '@angular/router';
import { map } from 'rxjs';

export function injectParams<T>(
  keyOrTransform?: string | ((params: Params) => T)
): Signal<T | Params | string | null> {
  assertInInjectionContext(injectParams);
  const route = inject(ActivatedRoute);

  if (typeof keyOrTransform === 'function') {
    return toSignal(route.params.pipe(map(keyOrTransform)), {
      requireSync: true,
    });
  }

  const getParam = (params: Params) =>
    keyOrTransform ? params?.[keyOrTransform] ?? null : params;

  return toSignal(route.params.pipe(map(getParam)), { requireSync: true });
}

export function getuid() {
  return Math.random().toString(36).substr(2, 9);
}

export function dateFormat(value: any): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
}

export function DateFormat(dataObject: any, dateKey: string) {
  const dateValue = dataObject[dateKey] ? new Date(dataObject[dateKey]) : null;

  if (dateValue && !isNaN(dateValue.getTime())) {
    dataObject[dateKey] = `${dateValue.getUTCFullYear()}_${(
      dateValue.getUTCMonth() + 1
    )
      .toString()
      .padStart(2, '0')}_${dateValue
      .getUTCDate()
      .toString()
      .padStart(2, '0')}_${dateValue
      .getUTCHours()
      .toString()
      .padStart(2, '0')}_${dateValue
      .getUTCMinutes()
      .toString()
      .padStart(2, '0')}_${dateValue
      .getUTCSeconds()
      .toString()
      .padStart(2, '0')}`;
  } else {
    dataObject[dateKey] = null;
  }
}

export function getMaxCacheTime() {
  return 60 * 60 * 24 * 365 * 10;
}
