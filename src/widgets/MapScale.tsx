import esri = __esri;

import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import Widget from '@arcgis/core/widgets/Widget';
import { tsx } from '@arcgis/core/widgets/support/widget';

export interface MapScaleProperties extends esri.WidgetProperties {
  view?: esri.MapView | esri.SceneView;
}

const CSS = {
  base: 'esri-widget map-scale-widget',
};

@subclass('MapScale')
export default class MapScale extends Widget {
  @property()
  view!: esri.MapView | esri.SceneView;

  constructor(properties?: MapScaleProperties) {
    super(properties);
  }

  render(): tsx.JSX.Element {
    const { view: { scale } } = this;
    return (
      <div class={CSS.base}>
        1 : {Number(scale.toFixed(0)).toLocaleString()}
      </div>
    );
  }
}
