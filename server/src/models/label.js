import dao from '../data/connectors';

export class Label {
    constructor({ labelId, name, founded } = {}) {
        this.labelId = labelId;
        this.name = name;
        this.founded = founded;
    }

    static async get(viewer, ids) {
        const data = await dao.getLabels(ids);
        return data.map(item => new Label(item));
    }
}

export default Label;
