import { ɵmarkDirty as markDirty } from '@angular/core';
import {
  RenderStrategy,
  RenderStrategyFactoryConfig,
} from '../../core/render-aware';

export function getGlobalStrategies(
  config: RenderStrategyFactoryConfig
): { [strategy: string]: RenderStrategy } {
  return {
    global: createGlobalStrategy(config),
  };
}

/**
 * Global Strategies
 *
 * - ɵMD - `ɵmarkDirty`
 * - C - `Component`
 *
 * | Name        | ZoneLess | Render Method | ScopedCoalescing | Scheduling | Chunked |
 * |-------------| ---------| --------------| ---------------- | ---------- |-------- |
 * | `global`     | ✔        | ɵMD           | C + Pr          | ❌         | ❌      |
 *
 */

/**
 *
 * Global Strategy
 *
 * This strategy is rendering the application root and
 * all it's children that are on a path
 * that is marked as dirty or has components with `ChangeDetectionStrategy.Default`.
 *
 * | Name        | ZoneLess | Render Method | ScopedCoalescing | Scheduling | Chunked |
 * |-------------| ---------| --------------| ---------------- | ---------- |-------- |
 * | `global`     | ✔        | ɵMD           | C + Pr          | ❌         | ❌      |
 *
 * @param config { RenderStrategyFactoryConfig } - The values this strategy needs to get calculated.
 * @return {RenderStrategy<T>} - The calculated strategy
 *
 */
export function createGlobalStrategy(
  config: RenderStrategyFactoryConfig
): RenderStrategy {
  const renderMethod = () => markDirty((config.cdRef as any).context);

  return {
    name: 'global',
    detectChanges: renderMethod,
    rxScheduleCD: (o) => o,
    scheduleCD: () => {
      renderMethod();
      return new AbortController();
    },
  };
}
