import esri = __esri;
import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';
import Widget from '@arcgis/core/widgets/Widget';
import { tsx } from '@arcgis/core/widgets/support/widget';

const CSS = {
  base: 'street-info',
  content: 'street-info_content',
  table: 'esri-widget__table',
  th: 'esri-feature__field-header',
  td: 'esri-feature__field-data',
};

let KEY = 0;

@subclass('StreetInfo')
export default class StreetInfo extends Widget {
  constructor(
    properties: esri.WidgetProperties & {
      view: esri.MapView;
      layer: esri.FeatureLayer;
    },
  ) {
    super(properties);
  }

  async postInitialize(): Promise<void> {
    const { view, layer } = this;

    this.layerView = await view.whenLayerView(layer);

    this.own(view.on('click', this._clickHandler.bind(this)));
  }

  view!: esri.MapView;

  layer!: esri.FeatureLayer;

  @property()
  state: 'ready' | 'info' = 'ready';

  name!: string | null;

  attributes!: esri.Graphic['attributes'] | null;

  related!: esri.FeatureSet[];

  layerView!: esri.FeatureLayerView;

  highlight!: esri.Handle;

  private async _clickHandler(event: esri.ViewClickEvent): Promise<void> {
    const {
      id,
      view: { spatialReference },
      layer,
      layerView,
      highlight,
    } = this;

    this.attributes = null;
    this.name = null;
    if (highlight) this.highlight.remove();

    const query = await layerView.queryFeatures({
      geometry: event.mapPoint,
      outSpatialReference: spatialReference,
      returnGeometry: true,
      outFields: ['*'],
      distance: 2,
    });

    if (!query.features || !query.features.length) {
      this.state = 'ready';
      this.scheduleRender(); // why is updated state not rendering?
      return;
    }

    const feature = query.features[0];

    const objectId = feature.attributes[layer.objectIdField];

    this.related = await Promise.all([
      // condition
      layer.queryRelatedFeatures({
        relationshipId: 0,
        objectIds: [objectId],
        outFields: ['*'],
      }),
      // type
      layer.queryRelatedFeatures({
        relationshipId: 2,
        objectIds: [objectId],
        outFields: ['*'],
      }),
      // width
      layer.queryRelatedFeatures({
        relationshipId: 2,
        objectIds: [objectId],
        outFields: ['*'],
      }),
    ]);

    this.attributes = feature.attributes;
    this.name = feature.attributes.LABEL;
    this.highlight = layerView.highlight(feature);

    this.state = 'info';
    this.scheduleRender(); // why is updated state not rendering?

    this.emit('show-widget', id);
  }

  render(): tsx.JSX.Element {
    const { state, name } = this;

    return (
      <calcite-panel class={CSS.base} heading={name || 'Street info'}>
        <div class={CSS.content}>
          <calcite-notice hidden={state !== 'ready'} icon="cursor-click" open="" scale="s">
            <div slot="message">Click on a street in the map to view street information</div>
          </calcite-notice>

          <div hidden={state !== 'info'}>{this._renderInfo()}</div>
        </div>
      </calcite-panel>
    );
  }

  private _renderInfo(): tsx.JSX.Element {
    const { attributes, related } = this;

    if (!attributes) return <div key={KEY++}></div>;

    const { FUNC_CLASS, OWNER, MAINTAINER, SURF_REPORT, ODOT_REPORT, Shape_Length } = attributes;

    // console.log(related);


    // const conditionFeatures = related[0].features;

    // if (conditionFeatures.length) {
    //   conditionFeatures.forEach()
    // }

    return (
      <div key={KEY++}>
        <table class={CSS.table}>
          <tr>
            <th class={CSS.th}>Functional Classification</th>
            <td class={CSS.td}>{FUNC_CLASS}</td>
          </tr>
          <tr>
            <th class={CSS.th}>Owner</th>
            <td class={CSS.td}>{OWNER}</td>
          </tr>
          <tr>
            <th class={CSS.th}>Maintainer</th>
            <td class={CSS.td}>{MAINTAINER}</td>
          </tr>
          <tr>
            <th class={CSS.th}>Condition Reported</th>
            <td class={CSS.td}>{SURF_REPORT === 1 ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th class={CSS.th}>ODOT Reported</th>
            <td class={CSS.td}>{ODOT_REPORT === 1 ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th class={CSS.th}>Length</th>
            <td class={CSS.td}>{`${Number((Shape_Length as number).toFixed(2)).toLocaleString()} feet`}</td>
          </tr>
        </table>
      </div>
    );
  }
}
