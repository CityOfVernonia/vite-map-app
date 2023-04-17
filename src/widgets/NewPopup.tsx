import esri = __esri;
import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';
import Widget from '@arcgis/core/widgets/Widget';
import { tsx } from '@arcgis/core/widgets/support/widget';
import Collection from '@arcgis/core/core/Collection';

const CSS = {
  table: 'esri-widget__table',
};

@subclass('NewPopup')
export default class NewPopup extends Widget {
  container = document.createElement('table');

  constructor(
    properties: esri.WidgetProperties & {
      graphic: esri.Graphic;
    },
  ) {
    super(properties);
  }

  async postInitialize(): Promise<void> {
    const { graphic, _rows } = this;

    const rows: tsx.JSX.Element[] = [];

    for (const attribute in graphic.attributes) {
      rows.push(
        <tr>
          <th>{attribute}</th>
          <td>{graphic.attributes[attribute]}</td>
        </tr>,
      );
    }

    _rows.addMany(rows);
  }

  graphic!: esri.Graphic;

  @property({ aliasOf: 'graphic.layer' })
  layer!: esri.FeatureLayer;

  @property({ aliasOf: 'graphic.layer.objectIdField' })
  objectIdField!: string;

  private _rows: Collection<tsx.JSX.Element> = new Collection();

  render(): tsx.JSX.Element {
    const { _rows } = this;
    return <table class={CSS.table}>{_rows.toArray()}</table>;
  }
}
