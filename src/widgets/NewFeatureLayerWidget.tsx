import esri = __esri;
import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';
import Widget from '@arcgis/core/widgets/Widget';
import { tsx } from '@arcgis/core/widgets/support/widget';
import Color from '@arcgis/core/Color';

const CSS = {
  content: 'padding: 0.75rem;',
};

let KEY = 0;

@subclass('NewFeatureLayerWidget')
export default class NewFeatureLayerWidget extends Widget {
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
    this._layerView = await view.whenLayerView(layer);
    this._layerView.highlightOptions = {
      color: new Color('red'),
    };
  }

  view!: esri.MapView;

  layer!: esri.FeatureLayer;

  onShow(): void {
    const {
      view,
      view: { popup },
    } = this;
    this._queryHandle = view.on('click', this._clickEvent.bind(this));
    if (popup.clear && typeof popup.clear === 'function') popup.clear();
    popup.close();
  }

  onHide(): void {
    const { _queryHandle } = this;
    if (_queryHandle) _queryHandle.remove();
    this._clearFeature();
  }

  @property({ aliasOf: 'layer.title' })
  private _title = 'Layer';

  private _layerView!: esri.FeatureLayerView;

  private _queryHandle!: IHandle;

  private _highlightHandle!: IHandle;

  @property()
  private _feature: esri.Graphic | null = null;

  private _clearFeature(): void {
    const { _highlightHandle } = this;
    if (_highlightHandle) _highlightHandle.remove();
    this._feature = null;
  }

  private async _clickEvent(event: esri.ViewClickEvent): Promise<void> {
    const { view, _layerView } = this;
    const { mapPoint, stopPropagation } = event;
    stopPropagation();
    this._clearFeature();

    const feature = (
      await _layerView.queryFeatures({
        geometry: mapPoint,
        outFields: ['*'],
        distance: view.resolution * 3,
      })
    ).features[0];

    if (!feature) {
      this._clearFeature();
      return;
    }

    this._highlightHandle = _layerView.highlight(feature);
    this._feature = feature;
  }

  render(): tsx.JSX.Element {
    const { _title, _feature } = this;
    return (
      <calcite-panel heading={_title}>
        <div style={CSS.content} hidden={_feature}>
          <calcite-notice icon="cursor-click" open="" scale="s">
            <div slot="title">{_title} info</div>
            <div slot="message">Click on a feature in the map to view information.</div>
          </calcite-notice>
        </div>
        <div hidden={!_feature}>{this._renderFeatureInfo(_feature)}</div>
      </calcite-panel>
    );
  }

  private _renderFeatureInfo(feature: esri.Graphic | null): tsx.JSX.Element | null {
    if (!feature) return null;

    const rows: tsx.JSX.Element[] = [];
    for (const attribute in feature.attributes) {
      rows.push(
        <tr>
          <th>{attribute}</th>
          <td>{feature.attributes[attribute]}</td>
        </tr>,
      );
    }

    return (
      <table key={KEY++} class="esri-widget__table">
        {rows}
      </table>
    );
  }
}
