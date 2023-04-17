import esri = __esri;
import type Accessor from '@arcgis/core/core/Accessor';
import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';
import Evented from '@arcgis/core/core/Evented';

// @ts-ignore
const _E = Evented.EventedAccessor;

/**
 * Template class of evented accessor.
 */
@subclass('EvtAccessor')
export default class EvtAccessor extends _E {
  // type evented methods
  addHandles!: Accessor['addHandles'];
  emit!: (type: string, event?: any) => boolean;
  hasEventListener!: (type: string) => boolean;
  hasHandles!: Accessor['hasHandles'];
  on!: (type: string | string[], listener: esri.EventHandler) => IHandle;

  constructor(properties?: { view: esri.MapView }) {
    super(properties);
  }

  @property()
  view!: esri.MapView;
}
