import esri = __esri;
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
  on!: (type: string | string[], listener: esri.EventHandler) => IHandle;
  emit!: (type: string, event?: any) => boolean;
  // type `own` b/c it would be typed
  // NOTE: type `addHandles`, etc when typed
  own!: (handle: IHandle) => boolean;

  constructor(properties?: { view: esri.MapView }) {
    super(properties);
  }

  @property()
  view!: esri.MapView;
}
