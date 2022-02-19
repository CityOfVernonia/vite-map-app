import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';
import Widget from '@arcgis/core/widgets/Widget';
import { tsx } from '@arcgis/core/widgets/support/widget';

const CSS = {
  base: 'new-widget',
};

@subclass('NewWidget')
export default class NewWidget extends Widget {
  constructor(
    properties: esri.WidgetProperties & {
      view: esri.MapView;
      layer: esri.FeatureLayer;
    },
  ) {
    super(properties);
  }

  view!: esri.MapView;

  layer!: esri.FeatureLayer;

  render(): tsx.JSX.Element {
    return <div class={CSS.base}>I'm a widget.</div>;
  }
}
