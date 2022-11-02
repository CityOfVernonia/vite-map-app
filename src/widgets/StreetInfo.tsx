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

    const click = view.on('click', this.clickHandler.bind(this));

    this.own(click);
  }

  view!: esri.MapView;

  layer!: esri.FeatureLayer;

  layerView!: esri.FeatureLayerView;

  highlight!: esri.Handle;

  @property()
  feature!: esri.Graphic;

  related!: { [key: number]: esri.FeatureSet }[];

  conditions = [null, 'Poor', 'Marginal', 'Fair', 'Good', 'Excellent'];

  types: { name: string; code: string }[] = [
    {
      name: 'UNIMPROVED (Open for Travel)',
      code: 'U',
    },
    {
      name: 'GRADED & DRAINED (Natural Surface)',
      code: 'D',
    },
    {
      name: 'GRADED AND DRAINED (Gravel)',
      code: 'G',
    },
    {
      name: 'OIL MAT',
      code: 'O',
    },
    {
      name: 'ASPHALT CONCRETE',
      code: 'A',
    },
    {
      name: 'CONCRETE, BRICK, STONE',
      code: 'N',
    },
    {
      name: 'OTHER, UNKNOWN',
      code: 'Z',
    },
  ];

  @property()
  state: 'ready' | 'info' = 'ready';

  async clickHandler(event: esri.ViewClickEvent): Promise<void> {
    const { id, layer, layerView, highlight } = this;

    if (highlight) highlight.remove();

    const featureSet = await layerView.queryFeatures({
      geometry: event.mapPoint,
      distance: 3,
      outFields: ['*'],
      returnGeometry: true,
    });

    const { features } = featureSet;

    const feature = features[0];

    if (!feature) {
      this.state = 'ready';
      return;
    }

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

    this.feature = feature;

    this.highlight = layerView.highlight(feature);

    this.state = 'info';

    this.emit('show-widget', id);
  }

  sortMValues(features: esri.Graphic[]): esri.Graphic[] {
    return features.sort((a: esri.Graphic, b: esri.Graphic) => (a.attributes.BEG_M > b.attributes.BEG_M ? 1 : -1));
  }

  zoomTo(): void {
    const { view, feature } = this;
    if (!feature) return;
    view.goTo(feature);
  }

  render(): tsx.JSX.Element {
    const { feature, state } = this;
    return (
      <calcite-panel
        class={CSS.base}
        heading={
          state === 'info' && feature ? feature.attributes.LABEL || feature.attributes.FUNC_CLASS : 'Street Info'
        }
      >
        <calcite-action
          hidden={state !== 'info'}
          icon="magnifying-glass"
          slot={state === 'info' ? 'header-actions-end' : ''}
          text="Zoom to"
          onclick={this.zoomTo.bind(this)}
        >
          <calcite-tooltip placement="bottom" slot="tooltip">
            Zoom to
          </calcite-tooltip>
        </calcite-action>
        <div class={CSS.content}>
          <calcite-notice hidden={state !== 'ready'} icon="cursor-click" open="">
            <div slot="message">Click on a street in the map to view information</div>
          </calcite-notice>
          <div hidden={state !== 'info'}>{this.renderInfo()}</div>
        </div>
      </calcite-panel>
    );
  }

  renderInfo(): tsx.JSX.Element {
    const { layer, feature, related, conditions, types } = this;

    if (!feature) return <div key={KEY++}></div>;

    const { FUNC_CLASS, OWNER, MAINTAINER, SURF_REPORT, ODOT_REPORT, Shape_Length } = feature.attributes;

    const objectId = feature.attributes[layer.objectIdField];

    const rows: tsx.JSX.Element[] = [];

    if (related[0][objectId]) {
      const conditionFeatures = this.sortMValues(related[0][objectId].features);

      rows.push(
        <tr>
          <th class={CSS.th} colspan="2" style="border-right:none;">
            <strong>Surface Condition</strong>
          </th>
        </tr>,
      );

      conditionFeatures.forEach((conditionFeature: esri.Graphic): void => {
        const { attributes } = conditionFeature;
        rows.push(
          <tr>
            <th class={CSS.th}>
              {attributes.BEG_M} - {attributes.END_M}
              <br></br>({(attributes.END_M - attributes.BEG_M).toLocaleString()} feet)
            </th>
            <td class={CSS.td}>{conditions[attributes.SURF_CONDITION]}</td>
          </tr>,
        );
      });
    }

    if (related[1][objectId]) {
      const typeFeatures = this.sortMValues(related[1][objectId].features);

      rows.push(
        <tr>
          <th class={CSS.th} colspan="2" style="border-right:none;">
            <strong>Surface Type</strong>
          </th>
        </tr>,
      );

      typeFeatures.forEach((typeFeature: esri.Graphic): void => {
        const { attributes } = typeFeature;

        const surfType = types.find((t: { name: string; code: string }) => {
          return t.code === attributes.SURF_TYPE;
        })?.name;

        rows.push(
          <tr>
            <th class={CSS.th}>
              {attributes.BEG_M} - {attributes.END_M}
              <br></br>({(attributes.END_M - attributes.BEG_M).toLocaleString()} feet)
            </th>
            <td class={CSS.td}>{surfType || ''}</td>
          </tr>,
        );
      });
    }

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
          {rows}
        </table>
      </div>
    );
  }
}
