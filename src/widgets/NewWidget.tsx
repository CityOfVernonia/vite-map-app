import esri = __esri;
import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';
import Widget from '@arcgis/core/widgets/Widget';
import { tsx } from '@arcgis/core/widgets/support/widget';

const CSS = {
  base: 'new-widget',
  content: 'padding: 1.5rem; background-color: var(--calcite-ui-foreground-1);',
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

  @property()
  view!: esri.MapView;

  layer!: esri.FeatureLayer;

  @property()
  protected state: 'scale' | 'zoom' = 'scale';

  render(): tsx.JSX.Element {
    const {
      view: { scale, zoom },
      state,
    } = this;
    return (
      <calcite-panel heading="View">
        <calcite-action
          active={state === 'scale'}
          icon="actual-size"
          slot="header-actions-end"
          text="Scale"
          onclick={(): void => {
            this.state = 'scale';
          }}
        >
          <calcite-tooltip label="Scale" placement="bottom" slot="tooltip">
            Scale
          </calcite-tooltip>
        </calcite-action>
        <calcite-action
          active={state === 'zoom'}
          icon="zoom-out-fixed"
          slot="header-actions-end"
          text="Zoom"
          onclick={(): void => {
            this.state = 'zoom';
          }}
        >
          <calcite-tooltip label="Zoom" placement="bottom" slot="tooltip">
            Zoom
          </calcite-tooltip>
        </calcite-action>
        <div hidden={state !== 'scale'} style={CSS.content}>
          {scale}
        </div>
        <div hidden={state !== 'zoom'} style={CSS.content}>
          {zoom}
        </div>
      </calcite-panel>
    );
  }
}
